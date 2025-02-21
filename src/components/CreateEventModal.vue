<!-- src/components/CreateEventModal.vue -->
<template>
    <b-modal
      v-model="isModalActive"
      :width="960"
      scroll="keep">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Create Event
          </p>
        </header>
        <div class="card-content">
          <!-- Add your form fields here, similar to EditEventModal -->
          <!-- This is just an example, match it with your edit modal fields -->
          <b-field label="Event Name">
            <b-input v-model="formData.event_name"></b-input>
          </b-field>
          <!-- Add other fields as needed -->
        </div>
        <footer class="card-footer">
          <div class="card-footer-item">
            <b-button
              type="is-primary"
              @click="handleSave"
              :loading="isSaving">
              Create
            </b-button>
            <b-button
              type="is-light"
              @click="closeModal"
              :disabled="isSaving">
              Cancel
            </b-button>
          </div>
        </footer>
      </div>
    </b-modal>
  </template>
  
  <script>
  export default {
    name: 'CreateEventModal',
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formData: {
          event_name: '',
          // Add other fields as needed
        },
        isSaving: false
      }
    },
    computed: {
      isModalActive: {
        get() {
          return this.value
        },
        set(value) {
          this.$emit('input', value)
        }
      }
    },
    methods: {
      handleSave() {
        this.$emit('save', this.formData)
      },
      closeModal() {
        this.isModalActive = false
      }
    }
  }
  </script>
  