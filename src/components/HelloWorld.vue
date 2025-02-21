<template>
  <div class="event-editor">
    <!-- General Information Section -->
    <section class="section">
      <h3 class="title is-4">General Information</h3>
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
      </div>

      <!-- URLs Section -->
      <div class="columns is-multiline">
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

    <!-- Schedule Section -->
    <section class="section">
      <h3 class="title is-4">Schedule Configuration</h3>
      <b-tabs v-model="activeTab">
        <b-tab-item label="Specific Dates" icon="calendar">
          <schedule-specific-dates 
            v-if="activeTab === 0"
            v-model="formData.schedule"
            :timezone="formData.schedule.time_zone"
            @update:timezone="updateTimezone">
          </schedule-specific-dates>
        </b-tab-item>
        
        <b-tab-item label="Daily" icon="repeat">
          <schedule-daily
            v-if="activeTab === 1"
            v-model="formData.schedule"
            :timezone="formData.schedule.time_zone"
            @update:timezone="updateTimezone">
          </schedule-daily>
        </b-tab-item>
        
        <b-tab-item label="Weekly" icon="calendar-week">
          <schedule-weekly
            v-if="activeTab === 2"
            v-model="formData.schedule"
            :timezone="formData.schedule.time_zone"
            @update:timezone="updateTimezone">
          </schedule-weekly>
        </b-tab-item>
      </b-tabs>
    </section>

    <!-- Video Configuration Section -->
    <section class="section">
      <h3 class="title is-4">Video Configuration</h3>
      <video-config
        v-model="formData.nav_panle"
        :video-url="formData.video_url"
        @duration-update="updateDuration">
      </video-config>
    </section>

    <!-- Action Buttons -->
    <div class="section">
      <div class="buttons is-right">
        <b-button type="is-light" @click="resetForm">Reset</b-button>
        <b-button type="is-primary" @click="saveForm" :loading="isSaving">
          Save Changes
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleSpecificDates from './ScheduleSpecificDates.vue'
import ScheduleDaily from './ScheduleDaily.vue'
import ScheduleWeekly from './ScheduleWeekly.vue'
import VideoConfig from './VideoConfig.vue'

export default {
  name: 'EventEditor',
  
  components: {
    ScheduleSpecificDates,
    ScheduleDaily,
    ScheduleWeekly,
    VideoConfig
  },

  data() {
    return {
      activeTab: 0,
      isSaving: false,
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
          time_zone: 'UTC',
          schedule_type: 'specific_dates',
          specific_dates: [],
          daily: [],
          weekly: {
            day: [],
            time: []
          }
        },
        nav_panle: {
          first: { value: 'chat', time: '' },
          second: { value: 'Notes', time: '' },
          third: { value: 'Offer', time: '' },
          fourth: { value: 'Poll', time: '' }
        },
        webinar_duration: 0,
        video_url: ''
      }
    }
  },

  methods: {
    updateTimezone(timezone) {
      this.formData.schedule.time_zone = timezone
    },

    updateDuration(duration) {
      this.formData.webinar_duration = duration
    },

    async saveForm() {
      this.isSaving = true
      try {
        // Implement your save logic here
        await this.$emit('save', this.formData)
        this.$buefy.toast.open({
          message: 'Changes saved successfully!',
          type: 'is-success'
        })
      } catch (error) {
        this.$buefy.toast.open({
          message: 'Error saving changes',
          type: 'is-danger'
        })
      } finally {
        this.isSaving = false
      }
    },

    resetForm() {
      // Implement reset logic
      this.$buefy.dialog.confirm({
        message: 'Are you sure you want to reset all changes?',
        onConfirm: () => {
          // Reset form data
          this.initializeForm()
        }
      })
    },

    initializeForm(data) {
      if (data) {
        this.formData = JSON.parse(JSON.stringify(data))
        // Set active tab based on schedule_type
        switch (data.schedule_type) {
          case 'specific_dates':
            this.activeTab = 0
            break
          case 'daily':
            this.activeTab = 1
            break
          case 'weekly':
            this.activeTab = 2
            break
        }
      }
    }
  },

  created() {
    // If editing existing event, initialize with provided data
    if (this.$props.initialData) {
      this.initializeForm(this.$props.initialData)
    }
  }
}
</script>

<style scoped>
.event-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.section {
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
}

.title.is-4 {
  margin-bottom: 1.5rem;
}
</style>
