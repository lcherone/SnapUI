<template>
  <div id="app">
    <v-app>
      <navigation/>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  import navigation from './components/Layout/Navigation.vue'
  export default {
    name: 'snap-ui',
    components: { navigation }
  }
</script>

<style>
  /* CSS */
</style>
