import { getTracking } from '@frontboi/mondial-relay'
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::command.command', ({ strapi }) => ({
  async getTrackingInfos(ctx) {
    const globalData = await strapi
      .documents('api::global-data.global-data')
      .findFirst({ populate: 'elisa_minet_address' })

    const { mondial_relay_brand_id_api, mondial_relay_password } = globalData
    const commands = await strapi.documents('api::command.command').findMany()

    const trackingResults = await Promise.all(
      commands.map(command =>
        getTracking({
          Enseigne: mondial_relay_brand_id_api,
          Expedition: command.mondial_relay_command_number,
          Langue: 'FR',
          PrivateKey: mondial_relay_password,
        })
          .then(trackingInfos => ({ id: command.id, trackingInfos }))
          .catch(e => {
            strapi.log.error('Impossible de tracker un colis: ' + e)
            return { id: command.id, trackingInfos: null }
          }),
      ),
    )

    const allTrackingInfos = new Map<string, any>(
      trackingResults.map(result => [result.id as string, result.trackingInfos]),
    )

    return allTrackingInfos
  },
}))
