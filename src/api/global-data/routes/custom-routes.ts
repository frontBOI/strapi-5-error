export default {
  routes: [
    {
      method: 'GET',
      path: '/global-data/has-user-setup-gmail',
      handler: 'global-data.hasUserSetupGmail',
    },
    {
      method: 'GET',
      path: '/global-data/validate-auth-code',
      handler: 'global-data.validateAuthCode',
    },
    {
      method: 'GET',
      path: '/global-data/get-gmail-oauth-endpoint',
      handler: 'global-data.getGmailOAuthEndpoint',
    },
    {
      method: 'GET',
      path: '/global-data/get-user-infos',
      handler: 'global-data.getUserInfos',
    },
    {
      method: 'POST',
      path: '/global-data/send-contact-mail',
      handler: 'global-data.sendContactMail',
    },
  ],
}
