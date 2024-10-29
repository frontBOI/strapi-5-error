import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::code-promo.code-promo', ({ strapi }) => ({
  async validate(ctx) {
    const { name } = ctx.request.body as any

    const codePromo = await strapi.documents('api::code-promo.code-promo').findFirst({ filters: { name } })
    if (!codePromo) {
      return ctx.badRequest('Code promo invalide')
    }

    return codePromo
  },
}))
