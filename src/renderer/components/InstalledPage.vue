<template>
  <v-app>
    <v-content>
      <v-container fluid tag="section">
        <v-layout row wrap>
          <v-flex d-flex xs12 order-xs5>
            <v-layout column>
              <v-flex tag="h1" class="display mb-2">
                <v-layout row wrap>
                  <v-flex xs6>
                    Snaps - Installed
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
                <v-data-table :headers="headers" :items="items.result" :search="search" hide-actions class="elevation-1">
                  <template slot="items" slot-scope="props">
                    <td>
                      <img v-if="props.item.icon && props.item.icon !== ''" :src="`${props.item.icon}`" style="width:35px;margin-top:5px"/>
                    </td>
                    <td>
                      <router-link :to="{ path: '/app/' + search_actual + '/' + props.item.id }">{{ props.item.name }}</router-link>
                    </td>
                    <td>{{ props.item.summary }}</td>
                    <td>{{ props.item.version }}</td>
                    <td>{{ formatBytes(props.item['installed-size']) }}</td>
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

  //
  var exec = require('child_process').exec

  export default {
    name: 'installed-page',
    watch: {
      search (val) {
        this.snapFind(val)
      }
    },
    beforeMount () {
      document.title = 'SnapUI - Installed'
      this.$nextTick(() => {
        this.snapFind()
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
        { text: 'Size', value: 'installed-size', width: '120px' }
      ],
      items: []
    }),
    methods: {
      snapFind () {
        //
        exec('curl -sS --unix-socket /run/snapd.socket http://localhost/v2/snaps', (error, stdout, stderr) => {
          this.items = []
          if (error !== null) {
            return
          }
          this.items = JSON.parse(stdout)

          this.items.result.forEach((item, index) => {
            this.getIcon(item.name, index)
          })
        })
      },

      getIcon (name, index) {
        //
        exec('curl -sS --unix-socket /run/snapd.socket http://localhost/v2/find?name=' + name, (error, stdout, stderr) => {
          if (error !== null) {
            this.$set(this.items.result[index], 'icon', '')
            return
          }

          let result = JSON.parse(stdout)

          if (result['status-code'] !== 200) {
            this.$set(this.items.result[index], 'icon', '')
          } else {
            this.$set(this.items.result[index], 'icon', (result.result[0].icon || ''))
          }
        })
      },

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
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto');
</style>
