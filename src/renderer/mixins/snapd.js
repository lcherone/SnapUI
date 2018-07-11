// store/cache
import ElectronStore from 'electron-store'
const storage = {
  snaps: new ElectronStore({name: 'snaps', cwd: 'snap-ui'}),
  installed: new ElectronStore({name: 'installed', cwd: 'snap-ui'}),
  featured: new ElectronStore({name: 'featured', cwd: 'snap-ui'})
}

// node exec
const exec = require('child_process').exec

// github client
const octokit = require('@octokit/rest')()

// gist ids for featured items
const gistIds = {
  'landing': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'featured': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'games': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'finance': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'developers': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'social-networking': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'video': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'music': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'productivity': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'utilities': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'graphics': 'e46f1a21e0d9f06b2db31b9a910b4de3',
  'server': 'e46f1a21e0d9f06b2db31b9a910b4de3'
}

//
export default {
  data: () => ({
    items: [],
    changes: [],
    featured_items: [],
    installed_items: [],
    installed_check: false,
    search_actual: ''
  }),
  methods: {
    /**
     *
     */
    snapFind (search, section = 'all') {
      this.search_actual = search

      if (search === '') {
        this.items = []
        return
      }

      if (storage.snaps.has(section + '.' + search.substring(0, 2))) {
        this.items = storage.snaps.get(section + '.' + search.substring(0, 2))
        return
      }

      //
      let query = '?'

      if (section !== 'all') {
        query += 'section=' + encodeURIComponent(section) + '&'
      }

      query += 'q=' + encodeURIComponent(search)

      //
      exec('curl -sS --unix-socket /run/snapd.socket http://localhost/v2/find' + query, (error, stdout, stderr) => {
        this.items = []
        if (error !== null) {
          return
        }
        let { result } = JSON.parse(stdout)
        this.items = result

        // detect if has banner image
        this.items.forEach((item, idx) => {
          if (this.items[idx].screenshots) {
            this.items[idx].screenshots.forEach((obj, index) => {
              if (String(obj.url).indexOf('/banner-') !== -1) {
                this.items[idx].screenshots[index].url = ''
              }
              if (String(obj.url).indexOf('/banner_') !== -1) {
                this.$set(this.items[idx], 'banner', obj.url)
                this.items[idx].screenshots[index].url = ''
              }
              if (String(obj.url).indexOf('/banner.') !== -1) {
                this.$set(this.items[idx], 'banner', obj.url)
                this.items[idx].screenshots[index].url = ''
              }
            })
            // filter empty imsage
            this.items[idx].screenshots = item.screenshots.filter(obj => {
              return obj.url !== ''
            })
          }
        })

        // set cache
        storage.snaps.set(section + '.' + search.substring(0, 2), this.items)
      })
    },
    /**
     *
     */
    snapFeatured (section) {
      this.featured_items = []
      if (!(section in gistIds)) {
        return
      }

      if (storage.featured.has(section)) {
        this.featured_items = storage.featured.get(section)
        return
      }

      octokit.gists.get({
        gist_id: gistIds[section]
      }).then(({data, headers, status}) => {
        //
        this.featured_items = JSON.parse(data.files[section + '.json'].content)

        // detect if has banner image
        this.featured_items.forEach((item, idx) => {
          if (this.featured_items[idx].screenshots) {
            this.featured_items[idx].screenshots.forEach((obj, index) => {
              if (String(obj.url).indexOf('/banner-') !== -1) {
                this.featured_items[idx].screenshots[index].url = ''
              }
              if (String(obj.url).indexOf('/banner_') !== -1) {
                this.$set(this.featured_items[idx], 'banner', obj.url)
                this.featured_items[idx].screenshots[index].url = ''
              }
              if (String(obj.url).indexOf('/banner.') !== -1) {
                this.$set(this.featured_items[idx], 'banner', obj.url)
                this.featured_items[idx].screenshots[index].url = ''
              }
            })
            // filter empty imsage
            this.featured_items[idx].screenshots = item.screenshots.filter(obj => {
              return obj.url !== ''
            })
          }
        })

        // set cache
        storage.featured.set(section, this.featured_items)
      })
    },
    /**
     *
     */
    snapGetChanges () {
      //
      exec('curl -sS --unix-socket /run/snapd.socket http://localhost/v2/changes', (error, stdout, stderr) => {
        this.changes = []
        if (error !== null) {
          return
        }
        let { result } = JSON.parse(stdout)
        this.changes = result
        console.log(result)
      })
    },
    snapIsInstalled (name) {
      //
      if (this.installed_items.length === 0 && !this.installed_check) {
        this.installed_check = true
        exec('curl -sS --unix-socket /run/snapd.socket http://localhost/v2/snaps', (error, stdout, stderr) => {
          if (error !== null) {
            return
          }
          this.installed_items = JSON.parse(stdout)
          console.log(this.installed_items)
        })
      }
      if (!this.installed_items.result) {
        return false
      }
      return this.installed_items.result.find(obj => {
        return obj.name === name
      }) || false
    },
    /**
     *
     */
    snapAction (name, action) {
      var sudo = require('sudo-prompt')
      var options = {
        name: 'Electron'
      }
      sudo.exec('snap ' + action + ' ' + name, options, (error, stdout, stderr) => {
        if (error) throw error
        if (stderr) throw stderr
      })
    }
  }
}
