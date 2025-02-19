<template>
  <div style="text-align: center;">
    <!-- Optionally, you can display a message like "Signing out..." -->
    Signing out...
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  name: 'SignOutComponent',
  async created() {
    try {
      await Auth.signOut()
      // If using Vue Router, you can uncomment the next line:
      // this.$router.push('/SignIn')
      // Otherwise, use window.location.href for redirection:
      window.location.href = '/SignIn'
    } catch (error) {
      console.error('Error during sign out:', error)
    }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
