export default {
  routes: [
    {
      method: 'GET',
      path: '/products/best-sellers',
      handler: 'product.getBestSellers',
    },
    {
      method: 'GET',
      path: '/products/related-products',
      handler: 'product.relatedProducts',
    },
    {
      method: 'GET',
      path: '/products/by-category',
      handler: 'product.getByCategory',
    },
    {
      method: 'POST',
      path: '/products/initiate-payment',
      handler: 'product.initiatePayment',
    },
    {
      method: 'POST',
      path: '/products/payment/on-success',
      handler: 'product.paymentOnSuccess',
    },
  ],
}
