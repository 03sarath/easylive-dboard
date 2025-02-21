<!-- TimeZoneSelector.vue -->
<template>
    <b-field label="Time Zone">
      <b-select
        v-model="selectedTimezone"
        expanded
        @input="$emit('input', $event)"
      >
        <option v-for="tz in timezones" :key="tz" :value="tz">
          {{ formatTimezone(tz) }}
        </option>
      </b-select>
    </b-field>
  </template>
  
  <script>
  import moment from 'moment-timezone'
  
  export default {
    name: 'TimeZoneSelector',
  
    props: {
      value: {
        type: String,
        default: 'UTC'
      }
    },
  
    data() {
      return {
        selectedTimezone: this.value,
        timezones: moment.tz.names()
      }
    },
  
    methods: {
      formatTimezone(tz) {
        const offset = moment.tz(tz).format('Z')
        return `(GMT${offset}) ${tz}`
      }
    },
  
    watch: {
      value(newVal) {
        this.selectedTimezone = newVal
      }
    }
  }
  </script>
  