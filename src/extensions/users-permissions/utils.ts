'use strict'

import { accessTokenCookieLifespanInSeconds, refreshTokenCookieLifespanInSeconds } from './config'

import jwt from 'jsonwebtoken'
import _ from 'lodash'

export enum TokenType {
  ACCESS_TOKEN = 'access token',
  REFRESH_TOKEN = 'refresh token',
}

export function getService(name) {
  return strapi.plugin('users-permissions').service(name)
}

export function isFromFrontend(req) {
  req.headers['x-requested-with'] === 'XMLHttpRequest'
}

export function issueJWT(payload: any, type: TokenType) {
  const expirationTimeInSeconds =
    type === TokenType.ACCESS_TOKEN ? accessTokenCookieLifespanInSeconds : refreshTokenCookieLifespanInSeconds

  return jwt.sign(
    _.clone(payload.toJSON ? payload.toJSON() : payload),
    strapi.config.get('plugin::users-permissions.jwtSecret'),
    { expiresIn: expirationTimeInSeconds }, // expressed in seconds
  )
}

export function verifyJWTToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, strapi.config.get('plugin::users-permissions.jwtSecret'), {}, (err, payload) => {
      if (err) {
        return reject('Invalid token.')
      }

      resolve(payload)
    })
  })
}

// n'oublie pas qu'en localhost, les cookies ne sont pas passés à un autre domaine. Donc impossible d'utiliser
// les cookies pour connexion entre le front et le back.
export const cookieOptions = ({ path = '/', signed = false, httpOnly = true, lifespanInSeconds = undefined }) => {
  const options: any = {
    path,
    signed,
    httpOnly,
    sameSite: 'lax',
    maxAge: lifespanInSeconds * 1000 ?? 300000, // must be expressed in milliseconds
  }

  // set le domaine du cookie si non localhost
  if (process.env.IS_DOCKER) {
    options.domain = `.${process.env.DOMAIN}`
  }

  // ! 21/03/23: j'ai désactivé les cookies secure, car je n'arrive pas à forward les headers
  // ! de mon front au travers de Traefik, malgré beaucoup d'essais. À réitérer dans le futur !
  if (process.env.NODE_ENV === 'production') {
    options.secure = false
  }

  return options
}
