import React from 'react'

import { generateOAuthUrl, getUserInfos, sendMail, validateAuthCode } from '@frontboi/mailing'
import { render } from '@react-email/components'
import { factories } from '@strapi/strapi'

import AdminInitializationSuccessful from '../../../../react-email/emails/AdminInitializationSuccessful'
import Contact from '../../../../react-email/emails/Contact'

export default factories.createCoreController('api::global-data.global-data', ({ strapi }) => ({
  async getGmailOAuthEndpoint(ctx) {
    const type = ctx.request.query.type as any
    return generateOAuthUrl(type)
  },

  async hasUserSetupGmail() {
    const gmailRefreshToken = await strapi.service('api::global-data.global-data').getGmailRefreshToken()
    return !!gmailRefreshToken
  },

  async validateAuthCode(ctx) {
    const code = ctx.request.query.code as any

    const { tokens } = await validateAuthCode(code)

    // enregistrement du refresh token en BDD
    const globalDataDocumentId = (await strapi.documents('api::global-data.global-data').findFirst()).documentId
    await strapi.documents('api::global-data.global-data').update({
      documentId: globalDataDocumentId,
      data: {
        is_gmail_refresh_token_invalid: false,
        gmail_oauth_refresh_token: tokens.refresh_token,
      },
    })

    // envoi mail de confirmation de l'utilisation de la boîte mail
    const userInfos = await getUserInfos(tokens.refresh_token)
    await sendMail({
      to: userInfos.email,
      from: userInfos.email,
      refreshToken: tokens.refresh_token,
      subject: 'Bienvenue dans ton backoffice',
      body: render(<AdminInitializationSuccessful firstName={userInfos.given_name} />),
    })

    return true
  },

  async getUserInfos() {
    const gmailRefreshToken = await strapi.service('api::global-data.global-data').getGmailRefreshToken()
    if (!gmailRefreshToken || gmailRefreshToken.length === 0) {
      return null
    }

    try {
      const userInfos = await getUserInfos(gmailRefreshToken)
      return userInfos
    } catch (e) {
      if (e.message.includes('invalid_grant')) {
        // on notifie le fait que le refresh token est invalide
        const globalDataDocumentId = (await strapi.documents('api::global-data.global-data').findFirst()).documentId
        await strapi.documents('api::global-data.global-data').update({
          documentId: globalDataDocumentId,
          data: {
            is_gmail_refresh_token_invalid: true,
          },
        })
      }

      console.error(
        `Erreur lors de la récupération des infos utilisateur avec refresh token "${gmailRefreshToken}": `,
        e,
      )
    }

    return null
  },

  async sendContactMail(ctx) {
    const { firstname, lastname, email, message } = ctx.request.body as any

    const gmailRefreshToken = await strapi.service('api::global-data.global-data').getGmailRefreshToken()
    if (!gmailRefreshToken || gmailRefreshToken.length === 0) {
      return ctx.internalServerError('Aucun compte Gmail configuré')
    }

    const userInfos = await getUserInfos(gmailRefreshToken)

    await sendMail({
      to: userInfos.email,
      from: userInfos.email,
      refreshToken: gmailRefreshToken,
      subject: 'Demande de contact',
      body: render(<Contact firstName={firstname} lastname={lastname} email={email} message={message} />),
    })

    return true
  },
}))
