<template>
  <v-app>
    <v-content>
      <img :src="item.banner" style="position:absolute;width:100%;z-index:1" v-if="item.banner"/>
      <v-container fluid tag="section">
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-layout column>
              <v-flex tag="h1" class="headline-2 mb-2" style="z-index:2">
                <v-layout row wrap>
                  <v-flex xs11>
                    <div v-if="item.icon" style="height:70px;width:55px;float:left;margin-right:10px">
                      <img :src="`${item.icon}`" style="width:55px"/>
                    </div>
                    <div style="width:100%;min-width:100%">
                      {{ item.title }}
                      <p class="subheading">{{ item.summary }}</p>
                    </div>
                  </v-flex>
                  <v-flex xs1>
                    <v-btn small color="success" @click="snapAction(item.name, 'install')" style="float:right" :ripple="true">Install</v-btn>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex style="z-index:2">
                <v-alert type="error" :value="error">
                  {{ error }}
                </v-alert>
                <v-card class="mb-3" v-if="item.screenshots && item.screenshots.length > 0">
                  <v-card-text>
                    <h3 class="title mb-3">Screens</h3>
                    <div style="margin-left:-10px">
                      <img :src="`${img.url}`" style="margin-left:10px;height:130px" v-for="img in item.screenshots" :key="img.url" @click="openScreen(img)"/>
                    </div>
                  </v-card-text>
                </v-card>
                <v-card class="mb-3">
                  <v-card-text>
                    <h3 class="title mb-3">Description</h3>
                    <div v-html="item.description"></div>
                  </v-card-text>
                </v-card>
                <v-card class="mb-3">
                  <v-card-text style="padding: 16px 0px">
                    <h3 class="title mb-3" style="padding: 0 16px">Details</h3>
                    <v-card-text style="padding: 0px">
                      <v-layout row wrap>
                        <v-flex xs6>
                          <table class="v-datatable v-table">
                            <tbody>
                              <tr>
                                <td style="width:40%"><strong>Developer</strong></td>
                                <td>{{ item.developer ? ucfirst(item.developer) : '-' }}</td>
                              </tr>
                              <tr>
                                <td style="width:40%"><strong>Contact</strong></td>
                                <td>{{ item.contact ? item.contact.replace('mailto:', '') : '-' }}</td>
                              </tr> 
                              <tr>
                                <td style="width:40%"><strong>Size</strong></td>
                                <td>{{ formatBytes(item['download-size']) }}</td>
                              </tr>          
                              <tr>
                                <td style="width:40%"><strong>Version</strong></td>
                                <td>{{ item.version }}</td>
                              </tr>
                              <tr>
                                <td style="width:40%"><strong>Revision</strong></td>
                                <td>{{ item.revision }}</td>
                              </tr>                         
                              <tr>
                                <td style="width:40%"><strong>License</strong></td>
                                <td>{{ item.license }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </v-flex>
                        <v-flex xs6>
                          <table class="v-datatable v-table">
                            <tbody>
                              <tr>
                                <td style="width:40%"><strong>Channel</strong></td>
                                <td>{{ ucfirst(item.channel) }}</td>
                              </tr>
                              <tr>
                                <td style="width:40%"><strong>Status</strong></td>
                                <td>{{ ucfirst(item.status) }}</td>
                              </tr>             
                              <tr>
                                <td style="width:40%"><strong>Type</strong></td>
                                <td>{{ ucfirst(item.type) }}</td>
                              </tr>             
                              <tr>
                                <td style="width:40%"><strong>Confinement</strong></td>
                                <td>{{ ucfirst(item.confinement) }}</td>
                              </tr>
                              <tr>
                                <td style="width:40%"><strong>Private</strong></td>
                                <td>{{ ucfirst(item.private) }}</td>
                              </tr>
                              <tr>
                                <td style="width:40%"><strong>Modes</strong></td>
                                <td><strong>Dev:</strong> {{ ucfirst(item.devmode) }} <strong>Jail:</strong> {{ ucfirst(item.jailmode) }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-dialog v-model="dialog" hide-overlay>
      <img :src="`${screen_item.url}`" style="width: calc(100vw - 63px)" @click="dialog = false"/>
    </v-dialog>
  </v-app>
</template>

<script>
  import snapd from '../mixins/snapd'
  
  import ElectronStore from 'electron-store'
  const storage = new ElectronStore({
    name: 'snaps',
    cwd: 'snap-ui'
  })

  // marked (converts markdown to html)
  const markedUp = require('marked')
  markedUp.setOptions({
    pedantic: true,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    xhtml: false
  })

  export default {
    name: 'app-page',
    props: ['search', 'id', 'section'],
    mixins: [snapd],
    data: () => ({
      error: '',
      dialog: false,
      item: {
        screenshots: []
      },
      banner: '',
      screen_item: {}
    }),
    mounted: function () {
      document.title = 'SnapUI - App'

      this.$nextTick(() => {
        console.log((this.section ? this.section : 'all') + '.' + this.search.substring(0, 2))

        let items = storage.get((this.section ? this.section : 'all') + '.' + this.search.substring(0, 2))

        this.item = items.find(obj => {
          return obj.id === this.id
        })
        this.item.description = markedUp(this.ucfirst(this.item.description))
      })
    },
    methods: {
      openScreen (item) {
        this.dialog = true
        this.screen_item = item
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

</style>