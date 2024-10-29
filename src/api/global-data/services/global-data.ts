/**
 * global-data service
 */
import { factories } from '@strapi/strapi'

export default factories.createCoreService('api::global-data.global-data', ({ strapi }) => ({
  async getGmailRefreshToken() {
    const refreshToken = (await strapi.documents('api::global-data.global-data').findFirst()).gmail_oauth_refresh_token
    return refreshToken
  },
}))
