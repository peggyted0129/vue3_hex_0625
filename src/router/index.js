import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/front/FrontStage'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/front/Home')
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/front/Login')
      },
      {
        path: 'cart', // 購物車列表
        name: 'Cart',
        component: () => import('@/views/front/Cart')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/front/Products')
      },
      {
        path: '/product/:id',
        name: 'ProductDetail',
        component: () => import('@/views/front/Product')
      },
      {
        path: '/checkout',
        component: () => import('@/components/front/Checkout'),
        children: [
          {
            path: 'order_create', // 建立訂單
            name: 'OrderCreate',
            component: () => import('@/views/front/OrderCreate')
          }
          // {
          //   path: 'order_paying/:orderId', // 確認訂單
          //   name: 'OrderPaying',
          //   component: () => import('@/views/front/OrderPaying')
          // },
          // {
          //   path: 'order_paid/:orderId', // 結帳成功
          //   name: 'OrderPaid',
          //   component: () => import('@/views/front/OrderPaid')
          // }
        ]
      }
    ]
  },
  {
    path: '/admin',
    component: () => import('@/components/back/BackStage'),
    children: [
      {
        path: 'products',
        name: 'BackProducts',
        component: () => import('@/views/back/BackProducts'),
        meta: { requiresAuth: true }
      },
      {
        path: 'coupon',
        name: 'BackCoupon',
        component: () => import('@/views/back/BackCoupon'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/backstage',
    component: () => import('@/components/back/BackStage'),
    children: [
      {
        path: 'shopping',
        name: 'Backshopping',
        component: () => import('@/views/back/BackShopping')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
