export default [
  {
    method: 'GET',
    path: '/auth/refresh',
    handler: 'auth.refresh',
    config: {
      prefix: '',
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/auth/logout',
    handler: 'auth.logout',
    config: {
      prefix: '',
    },
  },
  {
    method: 'PUT',
    path: '/auth/user',
    handler: 'auth.update',
    config: {
      prefix: '',
    },
  },
]
