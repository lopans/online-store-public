<template>
  <v-app>
    <div v-if="loaded">
      <v-navigation-drawer :clipped="true" v-model="drawer" fixed app>
        <v-list>
          <v-list-tile router to="/">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-group prepend-icon="category">
            <v-list-tile router to="/store" slot="activator">
              <v-list-tile-title>Categories</v-list-tile-title>
            </v-list-tile>
            <v-list-group sub-group v-for="(item, i) in categoryItems" :key="i">
              <v-list-tile slot="activator">
                <v-list-tile-title>{{item.title}}</v-list-tile-title>
                <v-list-tile-action>
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile router :to="nest.to" v-for="(nest, i) in item.nested" :key="i">
                <v-list-tile-content class="nest-entry-wrap">
                  <v-list-tile-title class="nest-entry" v-text="nest.Title"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon v-html="nest.Icon"></v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list-group>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar fixed app clipped-left>
        <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
        <img width="32" src="~/static/logo.svg">

        <v-toolbar-title v-text="title"></v-toolbar-title>
        <v-spacer></v-spacer>
        <div>
          <span style="cursor:pointer" v-if="!authData.authenticated" @click="showAuth = true">
            <v-btn icon>
              <v-icon>account_circle</v-icon>
            </v-btn>Log in
          </span>

          <span v-if="authData.authenticated">
            {{authData.username}}
            <v-btn icon @click="logout" v-if="authData.authenticated">
              <v-icon>exit_to_app</v-icon>
            </v-btn>
          </span>

          <auth-form :show="showAuth" v-on:close="showAuth = false"/>
        </div>
      </v-toolbar>
      <v-content>
        <v-container>
          <nuxt/>
        </v-container>
      </v-content>
      <!-- <v-navigation-drawer temporary :right="right" v-model="rightDrawer" fixed>
        <v-list>
          <v-list-tile @click.native="right = !right">
            <v-list-tile-action>
              <v-icon light>compare_arrows</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>-->
      <v-snackbar
        v-model="snackbar.show"
        :bottom="true"
        :multi-line="snackbar.multiline"
        :timeout="snackbar.timeout"
      >
        {{ snackbar.message }}
        <v-btn :color="snackbar.btnColor" flat @click="hideSnackbar">Close</v-btn>
      </v-snackbar>
      <v-footer :fixed="fixed" app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
      </v-footer>
    </div>
    <v-container d-flex justify-center v-else>
      <v-progress-circular class="app-preloader" align-center :size="50" indeterminate></v-progress-circular>
    </v-container>
  </v-app>
</template>

<script>
import AuthForm from '~/Components/AuthForm'
export default {
  components: {
    AuthForm,
  },
  computed: {
    snackbar: function() {
      return this.$store.state.snackbar
    },
    authData: function() {
      return this.$store.state.account
    },
    serviceItems: function() {
      let authed = this.$store.state.account.authenticated
      let arr = []
      if (authed)
        arr.push({
          icon: 'account_circle',
          title: 'Permissions',
          to: '/permissions',
        })
      return arr
    },
  },
  methods: {
    hideSnackbar: function() {
      this.$store.commit('snackbar/close')
    },
    logout: function() {
      this.$store.dispatch('account/logOut')
    },
    initMenu() {
      let menuItems = this.$store.state.menu.items
      menuItems.forEach(category => {
        var item = {
          title: category.Title,
          icon: category.Icon,
          to: `/store/${category.ID}`,
          nested: category.SubItems.map(item => ({
            Title: item.Title,
            to: `/store/${category.Link}/${item.Link}`,
            Icon: item.Icon,
          })),
        }
        item.nested.unshift({
          Title: 'All',
          to: `/store/${category.Link}`,
        })
        this.categoryItems.push(item)
      })
      console.log('categoryItems', this.categoryItems)
    },
  },
  data() {
    return {
      showAuth: false,
      clipped: false,
      loaded: false,
      drawer: true,
      fixed: false,
      categoryItems: [],
      items: [
        { icon: 'home', title: 'Welcome', to: '/' },
        { icon: 'category', title: 'Categories', to: '/store/category' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Leoneed's",
    }
  },
  async mounted() {
    await this.$store.dispatch('account/authByRefresh')
    await this.$store.dispatch('menu/getMenu')
    this.initMenu()
    this.loaded = true
    // this.$store.commit('signalr/startConnection')

    // this.$store.commit("snackbar/show", {
    //   message: "test snackbar",
    //   btnColor: "pink",
    //   timeout: 5000
    // });
  },
}
</script>
<style lang="scss">
html {
  overflow-y: auto;
}
.nest-entry-wrap {
  padding-left: 5.2rem;
}
.app-preloader {
  align-self: center;
}
.container {
  min-width: 100%;
  padding: 0.8rem;
}
</style>
