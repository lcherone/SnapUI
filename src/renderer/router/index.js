import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/installed',
      name: 'installed-page',
      component: require('@/components/InstalledPage').default
    },
    {
      path: '/app/:search/:id',
      name: 'app-page',
      component: require('@/components/AppPage').default,
      props: true
    },
    {
      path: '/app/:search/:id/:section',
      name: 'app-section-page',
      component: require('@/components/AppPage').default,
      props: true
    },
    {
      path: '/section/:section',
      name: 'section-page',
      component: require('@/components/SectionPage').default,
      props: true
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
