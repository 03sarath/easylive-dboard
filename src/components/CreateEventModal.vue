<!-- CreateEventModal.vue -->
<template>
    <b-modal
      v-model="isModalActive"
      :width="960"
      scroll="keep"
      :destroy-on-hide="false"
      aria-role="dialog"
      aria-label="Create Event Modal"
      class="create-event-modal">
      
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            Create Event
          </p>
        </header>
  
        <div class="card-content">
          <b-tabs v-model="activeTab" type="is-boxed">
            <!-- General Information Tab -->
            <b-tab-item label="General Information">
              <div class="general-info-form">
                <b-field label="Event Name *" 
                  :type="{ 'is-danger': errors.has('event_name') }"
                  :message="errors.first('event_name')">
                  <b-input
                    v-model="formData.event_name"
                    v-validate="'required'"
                    :class="{'is-danger': errors.has('event_name')}"
                    name="event_name"
                    placeholder="Enter event name">
                  </b-input>
                </b-field>
  
                <b-field label="Organization Name *"
                  :type="{ 'is-danger': errors.has('org_name') }"
                  :message="errors.first('org_name')">
                  <b-input
                    v-model="formData.org_name"
                    v-validate="'required'"
                    :class="{'is-danger': errors.has('org_name')}"
                    name="org_name"
                    placeholder="Enter organization name">
                  </b-input>
                </b-field>
  
                <b-field label="Event Details *"
                  :type="{ 'is-danger': errors.has('event_details') }"
                  :message="errors.first('event_details')">
                  <b-input
                    v-model="formData.event_details"
                    type="textarea"
                    v-validate="'required'"
                    :class="{'is-danger': errors.has('event_details')}"
                    name="event_details"
                    placeholder="Enter event details">
                  </b-input>
                </b-field>
  
                <b-field label="Contact Name *"
                  :type="{ 'is-danger': errors.has('contact_name') }"
                  :message="errors.first('contact_name')">
                  <b-input
                    v-model="formData.contact_name"
                    v-validate="'required'"
                    :class="{'is-danger': errors.has('contact_name')}"
                    name="contact_name"
                    placeholder="Enter contact name">
                  </b-input>
                </b-field>
  
                <b-field label="Contact Email *"
                  :type="{ 'is-danger': errors.has('contact_email') }"
                  :message="errors.first('contact_email')">
                  <b-input
                    v-model="formData.contact_email"
                    v-validate="'required|email'"
                    :class="{'is-danger': errors.has('contact_email')}"
                    name="contact_email"
                    placeholder="Enter contact email">
                  </b-input>
                </b-field>
  
                <b-field label="Client URL *"
                  :type="{ 'is-danger': errors.has('client_url') }"
                  :message="errors.first('client_url')">
                  <b-input
                    v-model="formData.redirect_url.clinet_url"
                    v-validate="'required|url'"
                    :class="{'is-danger': errors.has('client_url')}"
                    name="client_url"
                    placeholder="Enter client URL">
                  </b-input>
                </b-field>
  
                <b-field label="Webinar URL *"
                  :type="{ 'is-danger': errors.has('webinar_url') }"
                  :message="errors.first('webinar_url')">
                  <b-input
                    v-model="formData.redirect_url.webinar_url"
                    v-validate="'required|url'"
                    :class="{'is-danger': errors.has('webinar_url')}"
                    name="webinar_url"
                    placeholder="Enter webinar URL">
                  </b-input>
                </b-field>
  
                <b-field label="Web URL *"
                  :type="{ 'is-danger': errors.has('web_url') }"
                  :message="errors.first('web_url')">
                  <b-input
                    v-model="formData.web_url"
                    v-validate="'required|url'"
                    :class="{'is-danger': errors.has('web_url')}"
                    name="web_url"
                    placeholder="Enter web URL">
                  </b-input>
                </b-field>
              </div>
            </b-tab-item>
  
            <!-- Schedule Configuration Tab -->
            <b-tab-item label="Schedule Configuration">
              <div class="schedule-config">
                <b-field label="Schedule Type">
                  <b-select v-model="selectedScheduleType" expanded>
                    <option value="specific">Specific Dates</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </b-select>
                </b-field>
  
                <component
                  :is="currentScheduleComponent"
                  v-model="scheduleData"
                  @input="updateSchedule"
                />
              </div>
            </b-tab-item>
  
            <!-- Video Configuration Tab -->
            <b-tab-item label="Video Configuration">
              <div class="video-config">
                <b-field label="Video URL *"
                  :type="{ 'is-danger': errors.has('video_url') }"
                  :message="errors.first('video_url')">
                  <b-input
                    v-model="videoData.video_url"
                    v-validate="'required|url'"
                    :class="{'is-danger': errors.has('video_url')}"
                    name="video_url"
                    placeholder="Enter Vimeo video URL"
                    @input="handleVideoUrlChange">
                  </b-input>
                </b-field>
  
                <!-- Video Preview with Controls -->
                <div v-if="videoData.video_url" class="video-preview">
                  <iframe
                    ref="vimeoPlayer"
                    :src="`${videoData.video_url}?api=1`"
                    width="100%"
                    height="360"
                    frameborder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowfullscreen>
                  </iframe>
  
                  <!-- Custom Video Controls -->
                  <div class="video-controls">
                    <div class="seek-bar-container">
                      <input
                        type="range"
                        class="seek-bar"
                        :value="currentTime"
                        :max="duration"
                        @input="handleSeek"
                        @mousedown="onSeekStart"
                        @mouseup="onSeekEnd"
                        @touchstart="onSeekStart"
                        @touchend="onSeekEnd">
                      <div class="time-display">
                        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                      </div>
                    </div>
                  </div>
                </div>
  
                <!-- Navigation Panel Configuration -->
                <div class="nav-panel-config" v-if="duration > 0">
                  <h4 class="subtitle is-6">Navigation Panel Configuration</h4>
                  <div v-for="(item, key) in videoData.nav_panle" :key="key"
                    class="nav-panel-item">
                    <b-field 
                      :label="capitalizeFirst(key)" 
                      class="nav-panel-field"
                      :type="{ 'is-danger': hasNavPanelError(key) }"
                      :message="getNavPanelError(key)">
                      <b-select v-model="item.value" expanded>
                        <option value="chat">Chat</option>
                        <option value="notes">Notes</option>
                        <option value="offers">Offers</option>
                        <option value="polls">Polls</option>
                      </b-select>
                      <b-input
                        type="number"
                        v-model.number="item.time"
                        min="0"
                        :max="duration"
                        placeholder="Time in seconds"
                        expanded
                        @input="validateNavPanelTime(key)">
                      </b-input>
                      <b-button
                        type="is-primary"
                        @click="setNavPanelTime(key)"
                        :disabled="!isValidTime(currentTime)">
                        Set Current
                      </b-button>
                    </b-field>
                  </div>
                </div>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
  
        <footer class="card-footer">
          <div class="card-footer-item">
            <b-button
              type="is-primary"
              @click="handleSave"
              :loading="isSaving"
              :disabled="!isFormValid || !isVideoConfigValid">
              Create Event
            </b-button>
            <b-button
              type="is-light"
              @click="closeModal"
              :disabled="isSaving"
              class="ml-2">
              Cancel
            </b-button>
          </div>
        </footer>
      </div>
    </b-modal>
  </template>
  <script>
  import Player from '@vimeo/player'
  import ScheduleSpecificDates from './ScheduleSpecificDates.vue'
  import ScheduleDaily from './ScheduleDaily.vue'
  import ScheduleWeekly from './ScheduleWeekly.vue'
  
  export default {
    name: 'CreateEventModal',
    
    $_veeValidate: {
      validator: 'new'
    },
  
    components: {
      ScheduleSpecificDates,
      ScheduleDaily,
      ScheduleWeekly
    },
  
    inject: ['$validator'],
  
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
  
    data() {
      return {
        activeTab: 0,
        isSaving: false,
        selectedScheduleType: 'specific',
        currentTime: 0,
        duration: 0,
        isSeeking: false,
        player: null,
        navPanelErrors: {},
        formData: {
          event_name: '',
          org_name: '',
          event_details: '',
          contact_name: '',
          contact_email: '',
          redirect_url: {
            clinet_url: '',
            webinar_url: ''
          },
          web_url: ''
        },
        scheduleData: {
          timezone: 'UTC',
          type: 'specific',
          schedule: {}
        },
        videoData: {
          video_url: '',
          webinar_duration: 0,
          nav_panle: {
            first: { time: 0, value: 'chat' },
            second: { time: 0, value: 'notes' },
            third: { time: 0, value: 'offers' },
            four: { time: 0, value: 'polls' }
          }
        }
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
      },
  
      currentScheduleComponent() {
        const componentMap = {
          specific: 'schedule-specific-dates',
          daily: 'schedule-daily',
          weekly: 'schedule-weekly'
        }
        return componentMap[this.selectedScheduleType]
      },
  
      isFormValid() {
        return this.formData.event_name && 
               this.formData.org_name && 
               this.formData.event_details &&
               this.formData.contact_name &&
               this.formData.contact_email &&
               this.formData.redirect_url.clinet_url &&
               this.formData.redirect_url.webinar_url &&
               this.formData.web_url &&
               this.videoData.video_url
      },
  
      isVideoConfigValid() {
        if (!this.duration) return false;
        
        // Check if all nav panel times are valid
        return Object.keys(this.videoData.nav_panle).every(key => {
          const time = this.videoData.nav_panle[key].time;
          return this.isValidTime(time);
        });
      }
    },
  
    watch: {
      'videoData.video_url': {
        handler(newUrl) {
          if (newUrl) {
            this.$nextTick(() => {
              this.initializePlayer();
            });
          }
        }
      }
    },
  
    methods: {
      capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
      },
  
      async initializePlayer() {
        if (this.$refs.vimeoPlayer) {
          try {
            const iframe = this.$refs.vimeoPlayer;
            this.player = new Player(iframe);
  
            // Set up event listeners
            this.player.on('timeupdate', ({ seconds }) => {
              if (!this.isSeeking) {
                this.currentTime = Math.floor(seconds);
              }
            });
  
            this.player.on('loaded', async () => {
              this.duration = await this.player.getDuration();
              this.videoData.webinar_duration = this.duration;
            });
  
            // Get initial duration
            this.duration = await this.player.getDuration();
            this.videoData.webinar_duration = this.duration;
          } catch (error) {
            console.error('Error initializing player:', error);
          }
        }
      },
  
      formatTime(seconds) {
        if (!seconds) return '00:00';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        const parts = [];
        if (hours > 0) parts.push(String(hours).padStart(2, '0'));
        parts.push(String(minutes).padStart(2, '0'));
        parts.push(String(remainingSeconds).padStart(2, '0'));
        
        return parts.join(':');
      },
  
      isValidTime(time) {
        return typeof time === 'number' && time >= 0 && time <= this.duration;
      },
  
      hasNavPanelError(key) {
        return this.navPanelErrors[key] !== undefined;
      },
  
      getNavPanelError(key) {
        return this.navPanelErrors[key];
      },
  
      validateNavPanelTime(key) {
        const time = this.videoData.nav_panle[key].time;
        
        if (!this.isValidTime(time)) {
          this.$set(this.navPanelErrors, key, `Time must be between 0 and ${this.duration} seconds`);
          return false;
        }
  
        this.$delete(this.navPanelErrors, key);
        return true;
      },
  
      onSeekStart() {
        this.isSeeking = true;
      },
  
      async onSeekEnd(event) {
        this.isSeeking = false;
        if (this.player) {
          const time = Number(event.target.value);
          await this.player.setCurrentTime(time);
          this.currentTime = time;
        }
      },
  
      async handleSeek(event) {
        if (this.player) {
          try {
            const time = Number(event.target.value);
            if (!this.isSeeking) {
              await this.player.setCurrentTime(time);
              this.currentTime = time;
            }
          } catch (error) {
            console.error('Error seeking:', error);
          }
        }
      },
  
      async setNavPanelTime(key) {
        if (this.videoData.nav_panle[key] && this.isValidTime(this.currentTime)) {
          this.videoData.nav_panle[key].time = this.currentTime;
          this.validateNavPanelTime(key);
        }
      },
  
      handleVideoUrlChange(url) {
        this.videoData.video_url = url;
        try {
          const vimeoUrl = new URL(url);
          const pathSegments = vimeoUrl.pathname.split('/');
          const videoId = pathSegments[pathSegments.indexOf('video') + 1];
          
          if (videoId) {
            console.log('Vimeo video ID:', videoId);
            // Reset player state
            this.currentTime = 0;
            this.duration = 0;
            this.navPanelErrors = {};
            
            // Initialize player after DOM update
            this.$nextTick(() => {
              this.initializePlayer();
            });
          }
        } catch (error) {
          console.error('Invalid video URL:', error);
        }
      },
  
      updateSchedule(data) {
        this.scheduleData = {
          ...this.scheduleData,
          ...data,
          type: this.selectedScheduleType
        }
      },
  
      async handleSave() {
        try {
          this.isSaving = true;
          
          const result = await this.$validator.validateAll();
          if (!result) {
            throw new Error('Please fill in all required fields correctly');
          }
  
          // Validate nav panel times
          const navPanelValid = Object.keys(this.videoData.nav_panle).every(key => 
            this.validateNavPanelTime(key)
          );
  
          if (!navPanelValid) {
            throw new Error('Please correct the navigation panel time errors');
          }
  
          const payload = {
            customer_id: 'abcdefg-hijklmo-opqrs',
            ...this.formData,
            schedule: this.scheduleData,
            ...this.videoData,
            schedule_type: this.selectedScheduleType,
            mode: 'create_event'
          };
  
          this.$emit('save', payload);
          this.closeModal();
        } catch (error) {
          this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger'
          });
        } finally {
          this.isSaving = false;
        }
      },
  
      closeModal() {
        this.isModalActive = false;
        this.resetForm();
      },
  
      resetForm() {
        this.$validator.reset();
        this.activeTab = 0;
        this.currentTime = 0;
        this.duration = 0;
        this.player = null;
        this.navPanelErrors = {};
        this.formData = {
          event_name: '',
          org_name: '',
          event_details: '',
          contact_name: '',
          contact_email: '',
          redirect_url: {
            clinet_url: '',
            webinar_url: ''
          },
          web_url: ''
        };
        this.scheduleData = {
          timezone: 'UTC',
          type: 'specific',
          schedule: {}
        };
        this.videoData = {
          video_url: '',
          webinar_duration: 0,
          nav_panle: {
            first: { time: 0, value: 'chat' },
            second: { time: 0, value: 'notes' },
            third: { time: 0, value: 'offers' },
            four: { time: 0, value: 'polls' }
          }
        };
      }
    }
  }
  </script>
  
  <style scoped>
  .create-event-modal {
    max-height: 90vh;
  }
  
  .card-content {
    max-height: calc(90vh - 200px);
    overflow-y: auto;
  }
  
  .general-info-form,
  .schedule-config,
  .video-config {
    padding: 1rem;
  }
  
  .nav-panel-item {
    margin-bottom: 1rem;
  }
  
  .video-preview {
    margin: 1rem 0;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .video-controls {
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 4px;
    margin-top: 1rem;
  }
  
  .seek-bar-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .seek-bar {
    flex: 1;
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    background: #ddd;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
  }
  
  .seek-bar::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #3273dc;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .seek-bar::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #3273dc;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  .time-display {
    min-width: 100px;
    text-align: right;
    font-family: monospace;
  }
  
  .nav-panel-field {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .schedule-component {
    margin-top: 1rem;
  }
  
  .card-footer {
    padding: 1rem;
    justify-content: flex-end;
  }
  
  .card-footer-item {
    justify-content: flex-end;
  }
  
  .b-tabs .tab-content {
    padding: 1rem;
  }
  </style>
  