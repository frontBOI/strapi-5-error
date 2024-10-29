import got from 'got'

export async function logErrorToNext(title: string, message: string) {
  const nextDomain = process.env.NEXT_INTERNAL_API ?? process.env.NEXT_LOCAL_API
  try {
    await got.put(`${nextDomain}/api/logs`, {
      json: {
        accessToken: process.env.STRAPI_TO_NEXT_ACCESS_TOKEN,
        newLog: {
          title,
          message,
        },
      },
    })
  } catch (e: any) {
    console.log(e)
  }
}
