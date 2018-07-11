<template>
  <div>
    <v-navigation-drawer :dark="theme.dark" :light="!theme.dark" fixed clipped app v-model="drawer" mobile-break-point="1025">
      <v-list dense>
        <template v-for="item in items">
          <v-list-group v-if="item.children" v-model="item.model" :key="item.text" :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-for="(child, i) in item.children" :key="i" @click="navigate(child.route)">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else @click="navigate(item.route)" :key="item.text">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :color="theme.color" :dark="theme.dark" :light="!theme.dark" app clipped-left fixed>
      <v-toolbar-title style="width: 300px">
        <v-toolbar-side-icon @click.stop="drawer = !drawer" :style="`color: ${theme.nav_text}`"></v-toolbar-side-icon>
        <span :style="`color: ${theme.nav_text}`">Snappi</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
  </div>
</template>

<script>
  var exec = require('child_process').exec
  export default {
    data: () => ({
      drawer: null,
      theme: {
        color: 'blue darken-4',
        primary: '#000',
        nav_text: '#fff',
        dark: false
      },
      items: [
        { icon: 'chevron_right', text: 'Home', route: '/' },
        { icon: 'chevron_right', text: 'Installed', route: '/installed' }
      ],
      sections: []
    }),
    mounted: function () {
      //
      exec('curl -sS --unix-socket /run/snapd.socket http://localhost/v2/sections', (error, stdout, stderr) => {
        if (error !== null) {
          return
        }
        let { result } = JSON.parse(stdout)

        let sections = []
        result.forEach(item => {
          sections.push({ icon: 'chevron_right', text: this.ucfirst(item.replace('-', ' ')), route: '/section/' + item })
        })

        this.items.push({
          icon: 'keyboard_arrow_down',
          'icon-alt': 'keyboard_arrow_down',
          text: 'Sections',
          model: false,
          children: sections
        })
      })
    },
    methods: {
      navigate (route) {
        this.$router.push(route)
      },
      ucfirst (str) {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1)
      }
    }
  }
</script>

<style scoped>

</style>
