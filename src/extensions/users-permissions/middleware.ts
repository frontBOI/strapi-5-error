'use strict'

const { CookieName } = require('./config')

export function getCookies(/*config, { strapi }*/) {
  return async (ctx, next) => {
    if (ctx.request.url.startsWith('/api')) {
      const accessToken = ctx.cookies.get(CookieName.ACCESS_TOKEN)

      // on transforme les cookies en JWT classique, car ce n'est que ce que comprend Strapi
      if (accessToken) {
        ctx.request.headers.authorization = `Bearer ${accessToken}`
      }
    }
    await next()
  }
}
