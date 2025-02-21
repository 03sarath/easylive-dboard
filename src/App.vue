<template>
  <div id="app">

    <amplify-authenticator>
    <div>
      <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->
    <!-- <el-menu
  :default-active="activeIndex2"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  

  <el-menu-item index="0" style="padding: 0">
    <img 
      src="https://psitron.s3.ap-southeast-1.amazonaws.com/Psitron-website/psitron_logo_wit_small.png"
      alt="Logo"
      style="height: 50px; padding: 5px; margin-right: 20px;"
    >
  </el-menu-item>

  <el-menu-item index="1">Events</el-menu-item>
  <el-submenu index="2">
    <template slot="title">Workspace</template>
    <el-menu-item index="2-1">item one</el-menu-item>
    <el-menu-item index="2-2">item two</el-menu-item>
    <el-menu-item index="2-3">item three</el-menu-item>
    <el-submenu index="2-4">
      <template slot="title">item four</template>
      <el-menu-item index="2-4-1">item one</el-menu-item>
      <el-menu-item index="2-4-2">item two</el-menu-item>
      <el-menu-item index="2-4-3">item three</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-menu-item index="3" disabled>Info</el-menu-item>
  <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">Orders</a></el-menu-item>
  
  <el-menu-item index="5" style="float: right">
    <i class="el-icon-switch-button" style="color: white;"></i>
  </el-menu-item>
  <el-menu-item index="6" style="float: right;" >
    <i class="el-icon-user-solid" style="color: white;"></i>
  </el-menu-item>
</el-menu> -->

<b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="https://d502jbuhuh9wk.cloudfront.net/logos/62dad9eb0cf244c802890de3.png?v=1"
          alt="Logo"
        >
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/' }" exact-active-class="is-active">
        Home
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/events' }" exact-active-class="is-active" href="#">
        Events
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/documentation' }" exact-active-class="is-active">
        Documentation
      </b-navbar-item>
      <b-navbar-dropdown label="Info">
        <b-navbar-item tag="router-link" :to="{ path: '/about' }" exact-active-class="is-active">
          About
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/contact' }" exact-active-class="is-active">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary" v-if="authState !== 'signedin'">
            <strong>Sign up</strong>
          </a>
          <a class="button is-primary">
            <i class="el-icon-user-solid" style="color: white;"></i>
          </a>
          <a class="button is-light" v-if="authState !== 'signedin'">
            Log in
          </a>
          <a class="button is-light" @click="handleSelect(5)">
            Log out
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>



    <router-view/>
      <!-- <amplify-sign-out></amplify-sign-out> -->
    </div>
  </amplify-authenticator>

<!-- 
  <amplify-authenticator >
            <amplify-sign-in slot="sign-in" :hide-sign-up="true">
              <div slot="federated-buttons">

              </div>
            </amplify-sign-in>
  </amplify-authenticator> -->

  </div>
</template>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
//import { Auth } from 'aws-amplify'

export default {
  components: {

  },
  name: 'AuthStateApp',
  mounted() {
    // this.$notify({
    //   component: NotificationSample,
    //   icon: 'nc-icon nc-app'
    // })
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
      unsubscribeAuth: undefined,
      // currentYear: '',
      logIn_status: false,
      // Trail_days: '',
      // Status: '',
      // Expired_Message: 'Trail is Expired!! Please Upgrade',
      // Traildays_Message: 'Please Upgrade',
      email: '',
      accessToken: '',
      username: '',
      activeIndex: '1',
      activeIndex2: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
        console.log("this" + key, keyPath);
        if(key == 5){
          this.$router.push('/logout').catch(() => {})
        }
        else if(key == 1){
          this.$router.push('/Events').catch(() => {})
        }
      }
  },
  created() {
    // this.currentYear = new Date().getFullYear()

    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      console.log('authState', authState)
      console.log('authData', authData)
      this.authState = authState
      this.user = authData
      if (authState == 'signedin') {
        // let loadingInstance = Loading.service({ fullscreen: true })

        this.email = authData.attributes.email
        this.accessToken = authData.signInUserSession.accessToken.jwtToken
        this.username = authData.username
        console.log(this.email)
        console.log(this.accessToken)
        console.log(this.username)
        this.$router.push('/Events').catch(() => {})
        
        // if (!('custom:OrgID' in authData.attributes)) {
        //   window.location.href = 'https://psitrontech.com/contactAdmin'
        // }

        // var data = {
        //   mode: 'subscription_status_update'
        // }

        // post_ZOHO_API(data).then(dataAWS => {
        //   if (authData.attributes.identities) {
        //     // JSON.parse(authData.attributes.identities)[0].providerType

        //     this.providerType = JSON.parse(
        //       authData.attributes.identities
        //     )[0].providerType
        //     if (this.providerType === 'SAML') {
        //       if (
        //         dataAWS.data.plan_code === '101' ||
        //         dataAWS.data.plan_code === '102' ||
        //         dataAWS.data.plan_code === '201' ||
        //         dataAWS.data.plan_code === '202'
        //       ) {
        //         window.location.href = 'https://psitrontech.com/Userconsole'
        //         return
        //       }
        //     }
        //   }

        //   this.$store.commit('set_Subscription_status', dataAWS.data)
        //   this.Status = dataAWS.data.status
        //   if (this.Status === 'cancelled') {
        //     loadingInstance.close()
        //     window.location.href = 'https://psitrontech.com/Userconsole'
        //     return
        //   } else if (this.Status === 'expired') {
        //     loadingInstance.close()
        //     window.location.href = 'https://psitrontech.com/Userconsole'
        //     return
        //   } else if (this.Status === 'unpaid') {
        //     loadingInstance.close()
        //     window.location.href = 'https://psitrontech.com/Userconsole'
        //     return
        //   } else if (this.Status === 'trial_expired') {
        //     loadingInstance.close()
        //     this.$store.commit('setUpgrade_message', this.Expired_Message)
        //     window.location.href = 'https://psitrontech.com/Userconsole'
        //     return
        //   } else {
        //     this.$nextTick(() => {
        //       if (
        //         this.Status === 'live' ||
        //         this.Status === 'trial' ||
        //         this.Status === 'non_renewing'
        //       ) {
        //         loadingInstance.close()
        //       }
        //     })
        //     if (authData.attributes.email_verified === false) {
        //       this.$router.push('/profile/user').catch(() => {})
        //       return
        //     }
        //     // this.$router.push('/dashboard/overview').catch(() => {})
        //   }
        // })

        this.logIn_status = true
      } else {
        this.logIn_status = false
        this.$router.push('/SignIn').catch(() => {})
      }
    })
  },
  beforeDestroy() {
    this.unsubscribeAuth()
  }
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
