const { cookieOptions } = require('./utils')

export enum CookieName {
  ACCESS_TOKEN = 'accessToken',
  REFRESH_TOKEN = 'refreshToken'
}

export const accessTokenCookieLifespanInSeconds = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN_SECONDS) || 300
export const refreshTokenCookieLifespanInSeconds = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS) || 2592000

export const accessTokenCookieOptions = cookieOptions({
  lifespanInSeconds: refreshTokenCookieLifespanInSeconds // le même que le refresh token - voir le README (partie "Authentification sécurisée") pour plus de détails
})

export const refreshTokenCookieOptions = cookieOptions({
  lifespanInSeconds: refreshTokenCookieLifespanInSeconds
})
