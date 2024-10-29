import React from 'react'

import { getUserInfos, sendMail } from '@frontboi/mailing'
import { createShipment } from '@frontboi/mondial-relay'
import { render } from '@react-email/components'
import strapiUtils from '@strapi/utils'

import CommandSuccessful from '../../../../react-email/emails/CommandSuccessful'
import NewCommand from '../../../../react-email/emails/NewCommand'

import { parsePhoneNumber } from 'libphonenumber-js'

const { ApplicationError } = strapiUtils.errors

interface CreateLineItemParams {
  name: string
  image?: string
  quantity: number
  description?: string
  unitAmountInCentimes: number
}

export function createLineItem(params: CreateLineItemParams) {
  const { name, image, description, unitAmountInCentimes, quantity } = params

  return {
    price_data: {
      currency: 'eur',
      product_data: {
        name,
        description,
        ...(image && { images: [image] }),
      },
      unit_amount: unitAmountInCentimes, // en centimes
    },
    quantity,
  }
}

export async function getStripeInstance() {
  const STRIPE_PRIVATE_KEY = (await strapi.documents('api::global-data.global-data').findFirst()).stripe_private_key
  const stripe: any = (await import('stripe')).default
  return stripe(STRIPE_PRIVATE_KEY)
}

export async function deleteStripeSessionFromStrapi(stripeSessionId: string) {
  const stripeSession = await strapi
    .documents('api::stripe-session.stripe-session')
    .findFirst({ filters: { session_id: stripeSessionId } })

  if (!stripeSession) {
    strapi.log.error('Aucune session stripe liée trouvée')
    throw new ApplicationError('Aucune session stripe liée trouvée')
  }

  await strapi.documents('api::stripe-session.stripe-session').delete({ documentId: stripeSession.documentId })
}

export async function handlePaymentSuccess(sessionId: string, customer: any) {
  try {
    strapi.log.info('[PAYMENT SUCCESS] Début du traitement du webhook')

    // récupération des données globales
    strapi.log.info(`[PAYMENT SUCCESS] Récupération de global-data`)
    const globalData = await strapi
      .documents('api::global-data.global-data')
      .findFirst({ populate: 'elisa_minet_address' })

    // création du client dans Strapi si il n'existe pas déjà
    let client = await strapi.documents('api::client.client').findFirst({ filters: { email: customer.email } })
    if (!client) {
      strapi.log.info(
        `[PAYMENT SUCCESS] Création du client (nom complet: "${customer.name}", mail: "${customer.email}")`,
      )
      client = await strapi.documents('api::client.client').create({
        data: {
          email: customer.email,
          phone: customer.phone,
          lastname: customer.name.split(' ')[1],
          firstname: customer.name.split(' ')[0],
          address: {
            country: customer.address.country,
            city: customer.address.city,
            line1: customer.address.line1,
            line2: customer.address.line2,
            zip_code: customer.address.postal_code,
          },
        },
      })
    } else {
      strapi.log.info(`[PAYMENT SUCCESS] Client "${client.email}" déjà existant`)
    }

    // récupération des produits liés à la session Stripe
    strapi.log.info(`[PAYMENT SUCCESS] Récupération de la session-stripe d'Id "${sessionId}"`)
    const strapiStripeSession = await strapi
      .documents('api::stripe-session.stripe-session')
      .findFirst({ filters: { session_id: sessionId }, populate: ['elements', 'elements.product'] })

    if (!strapiStripeSession) {
      strapi.log.error('Aucune session stripe liée trouvée')
      throw new ApplicationError('Aucune session stripe liée trouvée')
    }

    // création de la commande dans Strapi
    strapi.log.info('[PAYMENT SUCCESS] Création de la commande')
    const command = await strapi.documents('api::command.command').create({
      data: {
        date: new Date(),
        client: client.id,
        command_status: 'En cours',
        // @ts-ignore
        elements: strapiStripeSession.elements.map(e => ({ quantity: e.quantity, product: e.product.documentId })),
      },
    })

    // suppression du lien car il n'était utile que maitenant
    await strapi.documents('api::stripe-session.stripe-session').delete({ documentId: strapiStripeSession.documentId })

    // envoi du mail de confirmation au client
    strapi.log.info(`[PAYMENT SUCCESS] Envoi du mail de confirmation au client ("${customer.email}")`)
    const gmailRefreshToken = globalData.gmail_oauth_refresh_token
    const adminUserInfos = await getUserInfos(gmailRefreshToken)
    await sendMail({
      to: customer.email,
      from: adminUserInfos.email,
      refreshToken: gmailRefreshToken,
      subject: 'Tout est en préparation !',
      body: render(
        <CommandSuccessful
          commandId={command.id as string}
          clientFirstName={customer.name.split(' ')[0]}
          date={new Date().toLocaleDateString('fr-FR')}
          // @ts-ignore
          elements={strapiStripeSession.elements.map(e => ({ quantity: e.quantity, element: e.product }))}
        />,
      ),
    })

    strapi.log.info('[PAYMENT SUCCESS] Mail envoyé au client')

    // calcul du poids total du colis
    // @ts-ignore
    const packageWeight = strapiStripeSession.elements
      .map(e => ({ quantity: e.quantity, element: e.product }))
      .reduce((acc, e) => acc + e.quantity * e.element.weight_in_grams, 0)
    strapi.log.info(`[PAYMENT SUCCESS] Poids total du colis: ${packageWeight}g`)

    // envoi d'un mail à Elisa pour l'informer de la commande
    strapi.log.info(
      `[PAYMENT SUCCESS] Envoi d'un mail à l'admin "${adminUserInfos.email}" pour l'informer de la commande`,
    )
    // @ts-ignore
    const totalTTC = strapiStripeSession.elements.reduce((acc, e) => acc + e.product.price * e.quantity, 0)
    await sendMail({
      to: adminUserInfos.email,
      from: adminUserInfos.email,
      refreshToken: gmailRefreshToken,
      subject: 'Nouvelle commande !',
      body: render(
        <NewCommand
          totalTTC={totalTTC}
          clientLastName={customer.name.split(' ')[1]}
          clientFirstName={customer.name.split(' ')[0]}
          // @ts-ignore
          elements={strapiStripeSession.elements.map(e => ({ quantity: e.quantity, element: e.product }))}
        />,
      ),
    })

    strapi.log.info("[PAYMENT SUCCESS] Mail envoyé à l'admin")

    // création envoi dans Mondial Relay si on y arrive
    // il peut y avoir une erreur si par exemple il n'y a pas assez de crédits côté Mondial Relay pour créer un nouvel envoi
    // @ts-ignore
    const elisaMinetAddress = globalData.elisa_minet_address[0]
    strapi.log.info("[PAYMENT SUCCESS] Création de l'envoi chez Mondial Relay")
    const { mondial_relay_brand_id_api, mondial_relay_login_api, mondial_relay_password } = globalData
    const shipmentInformations = {
      context: {
        CustomerId: mondial_relay_brand_id_api,
        Password: mondial_relay_password,
        Login: mondial_relay_login_api,
      },
      shipment: {
        OrderNo: command.id + '',

        CustomerNo: client.id + '',

        ParcelCount: '1',

        CollectionMode: {
          Mode: 'CCC',
        },

        DeliveryMode: {
          Mode: '24R',
          Location: strapiStripeSession.mondial_relay_parcel_id,
        },

        Sender: {
          Firstname: 'Tesnim',
          Lastname: '',
          HouseNo: '',
          CountryCode: 'FR',
          PhoneNo: '',
          MobileNo: parsePhoneNumber(globalData.elisa_minet_phone, 'FR').number,
          Email: adminUserInfos.email,
          // @ts-ignore
          Streetname: elisaMinetAddress.line1,
          // @ts-ignore
          PostCode: '' + elisaMinetAddress.zip_code,
          // @ts-ignore
          City: elisaMinetAddress.city,
        },

        Recipient: {
          Title: customer.metadata.genre,
          Firstname: customer.name.split(' ')[0],
          Lastname: customer.name.split(' ')[1],
          Streetname: customer.address.line1,
          HouseNo: '',
          CountryCode: customer.address.country,
          PostCode: '' + customer.address.postal_code,
          City: customer.address.city,
          PhoneNo: '',
          MobileNo: customer.phone,
          Email: customer.email,
        },

        Parcels: {
          Parcel: {
            Content: 'Produits cosmetiques',
            Weight: {
              Unit: 'gr',
              Value: packageWeight,
            },
          },
        },
      },
    }

    try {
      // @ts-ignore
      const { etiquetteLink, sendingNumber } = await createShipment(shipmentInformations)

      // enregistrement de l'étiquette de la commande Mondial Relay dans Strapi
      strapi.log.info("[PAYMENT SUCCESS] Enregistrement de l'étiquette de la commande Mondial Relay dans Strapi")
      await strapi.documents('api::command.command').update({
        documentId: command.documentId,
        data: {
          mondial_relay_etiquette: etiquetteLink,
          mondial_relay_command_number: sendingNumber,
        },
      })
    } catch (e) {
      strapi.log.error("[PAYMENT SUCCESS] Erreur lors de la création de l'envoi chez Mondial Relay")
      console.error(e)
      console.log(shipmentInformations)
    }

    strapi.log.info('[PAYMENT SUCCESS] Fin du traitement du webhook')
  } catch (e) {
    strapi.log.error('[PAYMENT SUCCESS] Erreur lors du traitement du webhook.')
    console.error(e)
  }
}
