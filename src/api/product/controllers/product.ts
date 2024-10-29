import { getDeliveryPriceHT } from '@frontboi/mondial-relay'
import { factories } from '@strapi/strapi'
import strapiUtils from '@strapi/utils'

import { createLineItem, deleteStripeSessionFromStrapi, getStripeInstance, handlePaymentSuccess } from './utils'

import { parsePhoneNumber } from 'libphonenumber-js'

const { ApplicationError } = strapiUtils.errors

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async getBestSellers() {
    const bestSellers = await strapi.documents('api::product.product').findMany({ populate: ['images'] })
    return bestSellers.slice(0, 3)
  },

  async relatedProducts(ctx) {
    const { documentId } = ctx.request.query

    const relatedProducts = await strapi.documents('api::product.product').findMany({ populate: ['images'] })

    return relatedProducts.filter(p => p.documentId !== documentId)
  },

  async getByCategory(ctx) {
    const category = ctx.request.query.category as any

    let retval
    if (category && category !== 'Tout') {
      retval = await strapi.documents('api::product.product').findMany({
        filters: {
          category: {
            $eq: category,
          },
        },
        populate: ['images'],
      })
    } else {
      retval = await strapi.documents('api::product.product').findMany({ populate: ['images'] })
    }

    return retval
  },

  async initiatePayment(ctx) {
    strapi.log.info(`[PAYMENT CREATION] Initialisation d'un paiement`)

    const {
      city,
      mail,
      genre,
      phone,
      zipCode,
      address,
      lastname,
      products,
      firstname,
      codePromo,
      countryCode,
      mondialRelayParcelId,
    } = ctx.request.body as any

    strapi.log.info(`[PAYMENT CREATION] REQUEST'S BODY ==================================`)
    console.log(ctx.request.body)
    strapi.log.info(`[PAYMENT CREATION] =================================================`)

    const stripe = await getStripeInstance()

    // récupération des prix de chaque produit
    strapi.log.info(`[PAYMENT CREATION] Récupération des prix pour tous les produits concernés`)
    const prices = new Map()
    for (const quantifiableElement of products) {
      const strapiProduct = await strapi
        .documents('api::product.product')
        .findOne({ documentId: quantifiableElement.element.documentId })

      prices.set(quantifiableElement.element.documentId, strapiProduct.price)
    }

    // récupération de la réduction éventuelle
    strapi.log.info(`[PAYMENT CREATION] Récupération du code promo éventuel`)
    let coupon
    if (codePromo) {
      const theCodePromo = await strapi.documents('api::code-promo.code-promo').findOne({ documentId: codePromo })
      strapi.log.info('[PAYMENT CREATION] Il y a un code promo: ', theCodePromo)

      coupon = await stripe.coupons.create({
        percent_off: theCodePromo.reduction,
        duration: 'once',
      })
    } else {
      strapi.log.info('[PAYMENT CREATION] Aucun code promo utilisé')
    }

    // calcul du prix de la livraison
    const productsTotalWeight = products.reduce(
      (prev, quantifiableElement) => prev + quantifiableElement.quantity * quantifiableElement.element.weight_in_grams,
      0,
    )
    const deliveryPriceHT = getDeliveryPriceHT(productsTotalWeight, countryCode)
    strapi.log.info(
      `[PAYMENT CREATION] Calcul du prix de la livraison: poids=${productsTotalWeight}g, pays=${countryCode}. Prix HT=${deliveryPriceHT}`,
    )

    // calcul du total HT
    const totalHT = products.reduce(
      (prev, quantifiableElement) =>
        prev + quantifiableElement.quantity * prices.get(quantifiableElement.element.documentId),
      deliveryPriceHT,
    )
    strapi.log.info(`[PAYMENT CREATION] Calcul du coût total HT: ${totalHT}€`)

    // récupération des informations de l'entreprise
    strapi.log.info(`[PAYMENT CREATION] Récupération des informations de l'entreprise`)
    const numeroTVA = (await strapi.documents('api::global-data.global-data').findFirst()).tva_number

    // 👕 ajout des différents produits
    const lineItems = products.map(quantifiableElement =>
      createLineItem({
        name: quantifiableElement.element.name,
        quantity: quantifiableElement.quantity,
        image: quantifiableElement.element.image,
        unitAmountInCentimes: Math.round(prices.get(quantifiableElement.element.documentId) * 100),
      }),
    )

    // 📦 ajout du prix de la livraison
    lineItems.push(
      createLineItem({
        name: 'Livraison',
        quantity: 1,
        unitAmountInCentimes: Math.round(deliveryPriceHT * 100),
      }),
    )

    // 💰 ajout de la TVA
    const amountTVA = (await strapi.documents('api::global-data.global-data').findFirst()).tva_amount
    if (amountTVA > 0) {
      lineItems.push(
        createLineItem({
          name: 'TVA',
          quantity: 1,
          unitAmountInCentimes: Math.round(totalHT * (amountTVA / 100) * 100),
        }),
      )
    }

    // création du client dans stripe pour pouvoir le retrouver ensuite via webhook
    const customer = await stripe.customers.create({
      name: `${firstname} ${lastname}`,
      email: mail,
      phone: parsePhoneNumber(phone, countryCode).number,
      metadata: {
        genre,
      },
      address: {
        city,
        line1: address,
        country: countryCode,
        postal_code: zipCode,
      },
    })

    strapi.log.info(`[PAYMENT CREATION] Création de la session Stripe`)
    const session = await stripe.checkout.sessions.create({
      locale: 'fr',
      mode: 'payment',
      customer: customer.id,
      line_items: lineItems,
      payment_method_types: ['card'],
      ...(coupon && { discounts: [{ coupon: coupon.id }] }),
      success_url: process.env.PAYMENT_SUCCESS_REDIRECT_URI,
      cancel_url: process.env.PAYMENT_CANCELLED_REDIRECT_URI,
      ...(numeroTVA && {
        metadata: {
          vatNumber: numeroTVA,
        },
      }),
    })

    // sauvegarde du lien entre la session stripe et les produits liés, pour pouvoir les retrouver
    // au moment du payment successful
    strapi.log.info("[PAYMENT CREATION] Création de l'objet stripe-session pour suivi")
    await strapi.documents('api::stripe-session.stripe-session').create({
      data: {
        session_id: session.id,
        mondial_relay_parcel_id: mondialRelayParcelId,
        elements: products.map(p => ({
          quantity: p.quantity,
          product: p.element.documentId,
        })),
      },
    })

    strapi.log.info(`[PAYMENT CREATION] Initialisation du paiement terminée ✅`)

    return session.id
  },

  async paymentOnSuccess(ctx) {
    strapi.log.info('[PAYMENT SUCCESS] Webhook déclenché')

    // Stripe a besoin de la version non parsée du body
    const raw = ctx.request.body[Symbol.for('unparsedBody')]

    const sig = ctx.request.headers['stripe-signature']
    const webhookSecret = (await strapi.documents('api::global-data.global-data').findFirst()).stripe_webhook_secret

    let event: any
    let stripe: any
    let session: any
    let customer: any
    try {
      stripe = await getStripeInstance()
      event = stripe.webhooks.constructEvent(raw, sig, webhookSecret)
      session = event.data.object

      const customerId = session.customer
      customer = await stripe.customers.retrieve(customerId)
    } catch (err) {
      strapi.log.info(`[PAYMENT SUCCESS] Erreur: ${err.message}`)
      throw new ApplicationError(`Webhook Error: ${err.message}`)
    }

    switch (event.type) {
      case 'checkout.session.completed':
        // Il faut répondre à Stripe pour lui indiquer que le webhook a bien été reçu, autrement on risque un timeout
        // @src: https://docs.stripe.com/webhooks#acknowledge-events-immediately
        ctx.send(200)

        // cette fonction s'exécutera tout de même en arrière plan car asynchrone
        handlePaymentSuccess(session.id, customer)
        break

      case 'payment_intent.canceled':
      default:
        console.log(`Unhandled event type "${event.type}"`)
        deleteStripeSessionFromStrapi(session.id)
        break
    }

    return true
  },
}))
