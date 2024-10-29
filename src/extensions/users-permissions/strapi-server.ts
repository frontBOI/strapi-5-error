import { callback, logout, refresh, update } from './controller'
import { getCookies } from './middleware'
import customRoutes from './routes'

// (?) Ce fichier permet d'override le core plugin users-permissions. Cela me permet
// de mettre en place une authentification + sécurisée en utilisant des cookies
// httpOnly et une fonctionnalité de refresh token
//
// Pour info tout doit être déclaré dans ce fichier strapi-server.ts, mais par souci
// de lisibilité j'ai déplacé les différentes parties dans des dossiers logiques
//
// Ressources:
//    https://github.com/bwyx/strapi-jwt-cookies/blob/main/index.js
//    https://www.codeheroes.fr/2020/06/20/securiser-une-api-rest-3-3-gestion-du-jwt-cote-client/
//    https://talke.dev/strapi-user-permissions-jwt-cookies

export default plugin => {
  console.log()
  strapi.log.info('Included JWT token in httpOnly cookies')

  plugin.middlewares = {
    ...plugin.middlewares,
    getCookies,
  }

  plugin.controllers.auth = {
    ...plugin.controllers.auth,
    callback,
    refresh,
    logout,
    update,
  }

  plugin.routes['content-api'].routes.push(...customRoutes)

  return plugin
}
