import utils from '@strapi/utils'

import {
  accessTokenCookieLifespanInSeconds,
  accessTokenCookieOptions,
  CookieName,
  refreshTokenCookieLifespanInSeconds,
  refreshTokenCookieOptions,
} from './config'
import { cookieOptions, getService, issueJWT, TokenType, verifyJWTToken } from './utils'

import _ from 'lodash'
import { object, string } from 'zod'

const { ApplicationError, NotFoundError, UnauthorizedError } = utils.errors

export async function callback(ctx) {
  const provider = ctx.params.provider || 'local'
  const params = ctx.request.body
  const store = strapi.store({ type: 'plugin', name: 'users-permissions' })
  const grantSettings = await store.get({ key: 'grant' })
  const grantProvider = provider === 'local' ? 'email' : provider
  if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
    throw new ApplicationError('This provider is disabled')
  }

  if (provider === 'local') {
    const callbackSchema = object({
      identifier: string(),
      password: string(),
    })

    callbackSchema.parse(params)
    const { identifier } = params

    // 1) check if the user fulfills all the requirements to be authenticated
    const user = await strapi.query('plugin::users-permissions.user').findOne({
      where: {
        provider,
        $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
      },
    })

    if (!user || !user.password) {
      throw new NotFoundError('Invalid identifier or password')
    }

    const validPassword = await getService('user').validatePassword(params.password, user.password)
    if (!validPassword) {
      throw new UnauthorizedError('Invalid identifier or password')
    }

    const advancedSettings = await store.get({ key: 'advanced' })
    const requiresConfirmation = _.get(advancedSettings, 'email_confirmation')
    if (requiresConfirmation && user.confirmed !== true) {
      throw new ApplicationError('Your account email is not confirmed')
    }

    if (user.blocked === true) {
      throw new ApplicationError('Your account has been blocked by an administrator')
    }

    // 2) save the tokens in the cookies
    const payload = { id: user.id }
    const accessToken = issueJWT(payload, TokenType.ACCESS_TOKEN)
    const refreshToken = issueJWT(payload, TokenType.REFRESH_TOKEN)

    ctx.cookies.set(CookieName.ACCESS_TOKEN, accessToken, accessTokenCookieOptions)
    ctx.cookies.set(CookieName.REFRESH_TOKEN, refreshToken, refreshTokenCookieOptions)

    // 3) get the user's role
    const userWithRole = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
      populate: ['role'],
    })
    // @ts-ignore
    userWithRole.role = userWithRole.role.name.toUpperCase()

    delete userWithRole.password // sécurité...

    // 4) send the response
    return ctx.send({
      user: userWithRole,
      accessTokenExpiresIn: accessTokenCookieLifespanInSeconds,
      refreshTokenExpiresIn: refreshTokenCookieLifespanInSeconds,
    })
  }

  // if not local strategy, connect the user with a third-party provider
  try {
    const user = await getService('providers').connect(provider, ctx.query)
    return ctx.send({
      jwt: getService('jwt').issue({ id: user.id }),
    })
  } catch (error: any) {
    throw new ApplicationError(error.message)
  }
}

export async function refresh(ctx) {
  const refreshToken = ctx.cookies.get(CookieName.REFRESH_TOKEN)
  if (!refreshToken) {
    return ctx.unauthorized('No refresh token has been provided')
  }

  try {
    let payload: { id: string }
    try {
      payload = (await verifyJWTToken(refreshToken)) as { id: string }
    } catch (e: any) {
      return ctx.unauthorized('Invalid refresh token')
    }

    const store = await strapi.store({ type: 'plugin', name: 'users-permissions' })
    const user = await strapi.query('plugin::users-permissions.user').findOne({ where: { id: payload.id } })
    if (!user) {
      throw new NotFoundError('Invalid identifier or password')
    }
    if (_.get(await store.get({ key: 'advanced' }), 'email_confirmation') && user.confirmed !== true) {
      throw new ApplicationError('Your account email is not confirmed')
    }
    if (user.blocked === true) {
      throw new ApplicationError('Your account has been blocked by an administrator')
    }

    // forge new accesToken and refrestToken
    const newPayload = { id: user.id }
    const newAccessToken = issueJWT(newPayload, TokenType.ACCESS_TOKEN)
    const newRefreshToken = issueJWT(newPayload, TokenType.REFRESH_TOKEN)

    ctx.cookies.set(CookieName.ACCESS_TOKEN, newAccessToken, accessTokenCookieOptions)
    ctx.cookies.set(CookieName.REFRESH_TOKEN, newRefreshToken, refreshTokenCookieOptions)

    return ctx.send({
      accessTokenExpiresIn: accessTokenCookieLifespanInSeconds,
      refreshTokenExpiresIn: refreshTokenCookieLifespanInSeconds,
    })
  } catch (err) {
    return ctx.badRequest(err.toString())
  }
}

export function logout(ctx) {
  const options = cookieOptions({
    lifespanInSeconds: 0,
  })

  ctx.cookies.set(CookieName.ACCESS_TOKEN, '', options)
  ctx.cookies.set(CookieName.REFRESH_TOKEN, '', options)
  ctx.response.status = 204
}

// il est nécessaire de surcharger la méthode de mise à jour d'un utilisateur, car autrement la MAJ de champs
// n'est pas prise en compte par un PUT classique... Strapi, tu m'étonneras toujours.
export async function update(ctx) {
  const { data: user } = ctx.request.body

  // je supprime ce champ car il sera jamais mis à jour, et en plus dans le front il est tranformé
  // en toUpperCase()
  delete user.role

  const updatedUser = await strapi.entityService.update('plugin::users-permissions.user', user.id, {
    data: { ...user, id: +user.id },
  })

  return updatedUser
}
