<!-- EditEventModal.vue -->
<template>
    <b-modal
      v-model="isActive"
      :width="960"
      scroll="keep"
      :destroy-on-hide="false"
      @close="handleClose"
    >
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit Event</p>
          <button type="button" class="delete" @click="handleClose" />
        </header>
  
        <section class="modal-card-body">
          <div class="event-editor">
            <b-tabs v-model="activeMainTab" type="is-boxed" expanded>
              <!-- General Information Tab -->
              <b-tab-item 
                label="General Information" 
                icon="information"
                :disabled="isTabDisabled(0)"
              >
                <section class="section">
                  <div class="columns is-multiline">
                    <div class="column is-6">
                      <b-field label="Event Name">
                        <b-input v-model="formData.event_name" required></b-input>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field label="Organization Name">
                        <b-input v-model="formData.org_name"></b-input>
                      </b-field>
                    </div>
                    <div class="column is-12">
                      <b-field label="Event Details">
                        <b-input type="textarea" v-model="formData.event_details"></b-input>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field label="Contact Name">
                        <b-input v-model="formData.contact_name"></b-input>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field label="Contact Email">
                        <b-input type="email" v-model="formData.contact_email"></b-input>
                      </b-field>
                    </div>
                    <!-- URLs Section -->
                    <div class="column is-6">
                      <b-field label="Web URL">
                        <b-input v-model="formData.web_url"></b-input>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field label="Client Redirect URL">
                        <b-input v-model="formData.redirect_url.clinet_url"></b-input>
                      </b-field>
                    </div>
                    <div class="column is-6">
                      <b-field label="Webinar Redirect URL">
                        <b-input v-model="formData.redirect_url.webinar_url"></b-input>
                      </b-field>
                    </div>
                  </div>
                </section>
              </b-tab-item>
  
              <!-- Schedule Configuration Tab -->
              <b-tab-item 
                label="Schedule Configuration" 
                icon="calendar"
                :disabled="isTabDisabled(1)"
              >
                <section class="section">
                  <b-tabs v-model="activeScheduleTab">
                    <b-tab-item label="Specific Dates" icon="calendar-today">
                      <schedule-specific-dates 
                        v-if="activeScheduleTab === 0"
                        v-model="formData.schedule"
                      ></schedule-specific-dates>
                    </b-tab-item>
                    
                    <b-tab-item label="Daily" icon="calendar-clock">
                      <schedule-daily
                        v-if="activeScheduleTab === 1"
                        v-model="formData.schedule"
                      ></schedule-daily>
                    </b-tab-item>
                    
                    <b-tab-item label="Weekly" icon="calendar-week">
                      <schedule-weekly
                        v-if="activeScheduleTab === 2"
                        v-model="formData.schedule"
                      ></schedule-weekly>
                    </b-tab-item>
                  </b-tabs>
                </section>
              </b-tab-item>
  
              <!-- Video Configuration Tab -->
              <b-tab-item 
                label="Video Configuration" 
                icon="video"
                :disabled="isTabDisabled(2)"
              >
                <section class="section">
                  <video-config
                    v-model="formData.nav_panle"
                    :video-url="formData.video_url"
                    @duration-update="updateDuration"
                  ></video-config>
                </section>
              </b-tab-item>
            </b-tabs>
          </div>
        </section>
  
        <footer class="modal-card-foot">
          <div class="buttons">
            <b-button
              v-if="activeMainTab > 0"
              type="is-info"
              icon-left="chevron-left"
              @click="previousTab"
            >
              Previous
            </b-button>
            
            <b-button
              v-if="activeMainTab < 2"
              type="is-info"
              icon-right="chevron-right"
              @click="nextTab"
            >
              Next
            </b-button>
  
            <b-button
              v-if="activeMainTab === 2"
              type="is-primary"
              :loading="isSaving"
              @click="saveChanges"
            >
              Save Changes
            </b-button>
  
            <b-button @click="handleClose">
              Cancel
            </b-button>
          </div>
        </footer>
      </div>
    </b-modal>
  </template>
  
  <script>
  import ScheduleSpecificDates from './ScheduleSpecificDates.vue'
  import ScheduleDaily from './ScheduleDaily.vue'
  import ScheduleWeekly from './ScheduleWeekly.vue'
  import VideoConfig from './VideoConfig.vue'
  
  export default {
    name: 'EditEventModal',
  
    components: {
      ScheduleSpecificDates,
      ScheduleDaily,
      ScheduleWeekly,
      VideoConfig
    },
  
    props: {
      value: {
        type: Boolean,
        default: false
      },
      activeRow: {
        type: Object,
        default: () => ({})
      }
    },
  
    data() {
      return {
        isActive: false,
        isSaving: false,
        activeMainTab: 0,
        activeScheduleTab: 0,
        formData: {
          event_name: '',
          event_details: '',
          org_name: '',
          contact_name: '',
          contact_email: '',
          web_url: '',
          redirect_url: {
            clinet_url: '',
            webinar_url: ''
          },
          schedule: {
            timezone: 'UTC',
            type: 'specific',
            schedule: {
              dates: []
            }
          },
          nav_panle: {
            first: { value: 'chat', time: '' },
            second: { value: 'Notes', time: '' },
            third: { value: 'Offer', time: '' },
            four: { value: 'Poll', time: '' }
          },
          webinar_duration: 0,
          video_url: ''
        }
      }
    },
  
    methods: {
      isTabDisabled(tabIndex) {
        // Optional: Add validation logic here
        console.log('Tab index:', tabIndex)
        return false // For now, all tabs are enabled
      },
  
      nextTab() {
        if (this.activeMainTab < 2) {
          this.activeMainTab++
        }
      },
  
      previousTab() {
        if (this.activeMainTab > 0) {
          this.activeMainTab--
        }
      },
  
      initializeFormData() {
        this.formData = JSON.parse(JSON.stringify(this.activeRow))
        
        // Set active schedule tab based on schedule type
        switch (this.formData.schedule.type) {
          case 'specific':
            this.activeScheduleTab = 0
            break
          case 'daily':
            this.activeScheduleTab = 1
            break
          case 'weekly':
            this.activeScheduleTab = 2
            break
          default:
            this.activeScheduleTab = 0
        }
      },
  
      updateDuration(duration) {
        this.formData.webinar_duration = duration
      },
  
      async saveChanges() {
        this.isSaving = true
        try {
          await this.$emit('save', this.formData)
          this.$buefy.toast.open({
            message: 'Changes saved successfully!',
            type: 'is-success'
          })
          this.handleClose()
        } catch (error) {
          this.$buefy.toast.open({
            message: 'Error saving changes',
            type: 'is-danger'
          })
        } finally {
          this.isSaving = false
        }
      },
  
      handleClose() {
        this.isActive = false
      }
    },
  
    watch: {
      value(newVal) {
        this.isActive = newVal
      },
      isActive(newVal) {
        this.$emit('input', newVal)
      },
      activeRow: {
        handler(newVal) {
          if (newVal) {
            this.initializeFormData()
          }
        },
        immediate: true,
        deep: true
      }
    }
  }
  </script>
  
<!-- EditEventModal.vue -->
<style scoped>
.modal-card {
  max-width: 960px;
  margin: 0 auto;
}

.modal-card-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f5f5f5;
}

.section {
  padding: 1.25rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(10, 10, 10, 0.1);
}

/* Tab Styling */
::v-deep .tabs {
  margin-bottom: 1rem;
}

::v-deep .tabs ul {
  border-bottom-color: #dbdbdb;
}

::v-deep .tabs li {
  margin-bottom: -1px;
}

::v-deep .tab-item {
  padding: 0.5rem 1rem;
}

::v-deep .tab-content {
  padding: 1rem;
  background-color: white;
  border-radius: 0 0 4px 4px;
}

/* Button Styling */
.modal-card-foot {
  padding: 1rem;
  justify-content: flex-end;
  background-color: #f5f5f5;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.button {
  height: 2.25rem;
  padding: 0 1rem;
  font-size: 0.875rem;
}

.button .icon {
  margin-right: 0.25rem;
}

/* Form Field Styling */
.field:not(:last-child) {
  margin-bottom: 0.75rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #363636;
}

.input, .textarea {
  font-size: 0.875rem;
}
</style>
