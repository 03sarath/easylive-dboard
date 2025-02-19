<template>
  <div id="app">

    <amplify-authenticator>
    <div>
      <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->
    <router-view/>
      <amplify-sign-out></amplify-sign-out>
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
    }
  },
  methods: {
    // go_back() {
    //   this.sso_state = false
    // },
    // sso_auth() {
    //   this.sso_state = true
    // },
    // sso_auth_client() {
    //   this.$refs.sso_validate.validate().then(success => {
    //     if (!success) {
    //       return
    //     }
    //     Auth.federatedSignIn({
    //       provider: this.client_sso_id
    //     })
    //   })
    // }
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
