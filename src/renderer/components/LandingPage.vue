<template>
  <v-app>
    <v-content>
      <v-container grid-list-lg fluid>
        <v-flex tag="h2" class="display mb-2">
          Featured
        </v-flex>
        <v-layout row wrap>
          <v-flex v-for="item in featured_items" :key="item.id" xs12 sm4>
            <v-card>
              <v-card-media :src="`${item.banner}`" height="100px">
                <v-container fill-height fluid>
                  <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                      <div v-if="item.icon" style="height:70px;width:35px;float:left;margin-right:10px">
                        <img :src="`${item.icon}`" style="width:35px;margin-top:-12px"/>
                      </div>
                      <div style="width:100%;min-width:100%;margin-top:-10px" >
                        <span :class="`headline ${item.text_color || 'grey'}--text text--darken-4`">{{ ucfirst(item.title) }}</span>
                        <p :class="`subheading ${item.text_color || 'grey'}--text text--darken-2`">{{ ucfirst(item.summary) }}</p>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-media>
              <!--
              <v-card-title primary-title>
              <div>
              <h3 class="headline mb-0">{{ item.title }}</h3>
              <div>{{ item.summary }}</div>
              </div>
              </v-card-title>
              -->
              <v-card-actions>
                <v-btn flat color="primary" :to="{ path: '/app/' + item.name.substr(0, 2) + '/' + item.id }">Details</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat color="success">Install</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid tag="section">
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-layout column>
              <v-flex tag="h1" class="display mb-2">
                <v-layout row wrap>
                  <v-flex xs6>
                    Snaps
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field style="margin-top:-5px" v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex>
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <v-data-table :headers="headers" :items="items" :search="search" hide-actions class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>
                      <img v-if="props.item.icon" :src="`${props.item.icon}`" style="width:35px;margin-top:5px"/>
                    </td>
                    <td>
                      <router-link :to="{ path: '/app/' + search_actual + '/' + props.item.id }">{{ props.item.name }}</router-link>
                    </td>
                    <td>{{ ucfirst(props.item.summary) }}</td>
                    <td>{{ props.item.version }}</td>
                    <td>{{ formatBytes(props.item['download-size']) }}</td>
                    <td>
                      <div v-if="snapIsInstalled(props.item.name)">
                        <v-btn small color="error" @click="snapAction(props.item.name, 'remove')" style="float:right" :ripple="true">Remove</v-btn>
                      </div>
                      <div v-else>
                        <v-btn small color="success" @click="snapAction(props.item.name, 'install')" style="float:right" :ripple="true">Install</v-btn>
                      </div>
                    </td>
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                  </v-alert>
                </v-data-table>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

  </v-app>
</template>

<script>
  // import _ from 'lodash'
  import snapd from '../mixins/snapd'

  /*
  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    name: 'snaps',
    cwd: 'snap-ui'
  })
  // storage.clear()

  //
  var exec = require('child_process').exec
*/

  export default {
    name: 'landing-page',
    mixins: [snapd],
    watch: {
      search (val) {
        this.snapFind(val)
      }
    },
    beforeMount () {
      document.title = 'SnapUI - Home'

      this.$nextTick(() => {
        this.snapFind('a', 'all')
        this.snapFeatured('landing')
        this.snapGetChanges()
      })
    },
    data: () => ({
      error: false,
      search: '',
      search_actual: '',
      headers: [
        {
          text: '',
          align: 'left',
          value: 'icon',
          sortable: false,
          width: '30px'
        },
        {
          text: 'Name',
          value: 'name'
        },
        { text: 'Summary', value: 'summary' },
        { text: 'Version', value: 'version' },
        { text: 'Size', value: 'download-size', width: '120px' },
        { text: 'Action', value: 'action' }
      ],
      items: [],
      featured_items: []
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },

      formatBytes (bytes, decimals) {
        if (bytes === 0) return '0 Bytes'
        var k = 1024
        var dm = decimals || 2
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        var i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
      },

      ucfirst (str) {
        return String(str).charAt(0).toUpperCase() + String(str).slice(1)
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto');
</style>
