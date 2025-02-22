<!-- CreateEventModal.vue -->
<template>
      <b-modal
        v-model="isModalActive"
        :width="960"
        scroll="keep"
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Create Event Modal"
        class="create-event-modal"
        :can-cancel="['escape']"
        :active.sync="isModalActive"
        has-modal-card
        full-screen>
      
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
                  <p class="help is-info mb-4">
                    Set times in ascending order: Chat → Notes → Offers → Polls
                  </p>
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
  
                  <div v-if="!hasAllRequiredTimes" class="notification is-warning is-light mt-4">
                    Please set times for all navigation panel items
                  </div>
                  <div v-if="!hasValidNavPanelSequence" class="notification is-danger is-light mt-4">
                    Times must be in ascending order
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
  /* eslint-disable vue/no-dupe-keys */
  /* eslint-disable no-dupe-keys */
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
        isPlaying: false,
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
        return Object.keys(this.videoData.nav_panle).every(key => {
          const time = this.videoData.nav_panle[key].time;
          return this.isValidTime(time);
        });
      },
  
      orderedNavPanelItems() {
        return Object.entries(this.videoData.nav_panle)
          .sort((a, b) => a[1].time - b[1].time);
      },
  
      hasValidNavPanelSequence() {
        let lastTime = -1;
        return Object.entries(this.videoData.nav_panle)
          .every(([, item]) => {
            if (item.time === 0) return true;
            if (item.time <= lastTime) return false;
            lastTime = item.time;
            return true;
          });
      },
  
      hasAllRequiredTimes() {
        return Object.values(this.videoData.nav_panle)
          .every(item => item.time > 0 && item.time <= this.duration);
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
  
            this.player.on('play', () => {
              this.isPlaying = true;
            });
  
            this.player.on('pause', () => {
              this.isPlaying = false;
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
        return typeof time === 'number' && 
               !isNaN(time) && 
               time >= 0 && 
               time <= this.duration;
      },
  
      hasNavPanelError(key) {
        return this.navPanelErrors[key] !== undefined;
      },
  
      getNavPanelError(key) {
        return this.navPanelErrors[key];
      },
  
      validateNavPanelTime(key) {
        const currentItem = this.videoData.nav_panle[key];
        const time = currentItem.time;
  
        // Clear previous error
        this.$delete(this.navPanelErrors, key);
  
        // Basic time validation
        if (!this.isValidTime(time)) {
          this.$set(this.navPanelErrors, key, 
            `Time must be between 0 and ${this.duration} seconds`);
          return false;
        }
  
        // Check sequence validation
        const items = Object.entries(this.videoData.nav_panle);
        const currentIndex = items.findIndex(([k]) => k === key);
        
        // Check against previous items
        for (let i = 0; i < currentIndex; i++) {
          const [prevKey, prevItem] = items[i];
          if (prevItem.time > 0 && time <= prevItem.time) {
            this.$set(this.navPanelErrors, key,
              `Time must be greater than ${prevKey} (${prevItem.time}s)`);
            return false;
          }
        }
  
        // Check against next items
        for (let i = currentIndex + 1; i < items.length; i++) {
          const [nextKey, nextItem] = items[i];
          if (nextItem.time > 0 && time >= nextItem.time) {
            this.$set(this.navPanelErrors, key,
              `Time must be less than ${nextKey} (${nextItem.time}s)`);
            return false;
          }
        }
  
        return true;
      },
  
      validateAllNavPanelTimes() {
        let isValid = true;
        Object.keys(this.videoData.nav_panle).forEach(key => {
          if (!this.validateNavPanelTime(key)) {
            isValid = false;
          }
        });
        return isValid;
      },
  
      onSeekStart() {
        this.isSeeking = true;
        if (this.isPlaying) {
          this.player.pause();
        }
      },
  
      async onSeekEnd(event) {
        const time = Number(event.target.value);
        try {
          await this.player.setCurrentTime(time);
          this.currentTime = time;
          if (this.isPlaying) {
            await this.player.play();
          }
        } catch (error) {
          console.error('Error setting time:', error);
        } finally {
          this.isSeeking = false;
        }
      },
  
      async handleSeek(event) {
        if (this.player) {
          const time = Number(event.target.value);
          this.currentTime = time; // Update current time immediately for smooth UI
          if (!this.isSeeking) {
            try {
              await this.player.setCurrentTime(time);
            } catch (error) {
              console.error('Error seeking:', error);
            }
          }
        }
      },
  
      async setNavPanelTime(key) {
        if (!this.videoData.nav_panle[key] || !this.isValidTime(this.currentTime)) {
          return;
        }
  
        try {
          // Ensure the current time is accurate
          const actualTime = await this.player.getCurrentTime();
          this.currentTime = Math.floor(actualTime);
          
          // Set the nav panel time
          this.videoData.nav_panle[key].time = this.currentTime;
          
          // Validate the new time
          if (this.validateNavPanelTime(key)) {
            this.$buefy.toast.open({
              message: `Time set successfully for ${this.capitalizeFirst(key)}`,
              type: 'is-success',
              duration: 2000
            });
          }
        } catch (error) {
          console.error('Error setting nav panel time:', error);
          this.$buefy.toast.open({
            message: 'Error setting time. Please try again.',
            type: 'is-danger',
            duration: 2000
          });
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
        //   type: this.selectedScheduleType
        }
      },
  
      async handleSave() {
        try {
            this.isSaving = true;
            
            const result = await this.$validator.validateAll();
            if (!result) {
            throw new Error('Please fill in all required fields correctly');
            }

            if (!this.hasAllRequiredTimes) {
            throw new Error('Please set times for all navigation panel items');
            }

            if (!this.hasValidNavPanelSequence) {
            throw new Error('Navigation panel times must be in ascending order');
            }

            if (!this.validateAllNavPanelTimes()) {
            throw new Error('Please correct the navigation panel time errors');
            }

            let payload;

            // Different payload structure based on schedule type
            if (this.selectedScheduleType === 'specific') {
            payload = {
                // customer_id: 'abcdefg-hijklmo-opqrs',
                ...this.formData,
                ...this.scheduleData,
                ...this.videoData,
                schedule_type: this.selectedScheduleType,
                mode: 'create_event'
            };
            } else {
            // For daily and weekly schedules
            payload = {
                // customer_id: 'abcdefg-hijklmo-opqrs',
                ...this.formData,
                schedule: this.scheduleData,
                ...this.videoData,
                schedule_type: this.selectedScheduleType,
                mode: 'create_event'
            };
            }

            this.$emit('save', payload);
            this.closeModal();
        } catch (error) {
            this.$buefy.toast.open({
            message: error.message,
            type: 'is-danger',
            duration: 3000
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
  
  <style lang="scss" scoped>
  // Modal and Overlay styles
  ::v-deep .modal {
    z-index: 1000;
    
    .modal-background {
      background-color: rgba(10, 10, 10, 0.86);
    }
  
    .modal-content {
      max-height: 90vh;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
    }
  
    .modal-card {
      max-height: 90vh;
      width: 960px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
    }
  }
  
  // Card styles
  .card {
    border-radius: 8px;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      
      .card-header-title {
        font-size: 1.25rem;
        color: #2c3e50;
        padding: 1.25rem;
      }
    }
  
    .card-content {
      flex: 1;
      padding: 0;
      overflow-y: auto;
      
      &::-webkit-scrollbar {
        width: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
        
        &:hover {
          background: #a8a8a8;
        }
      }
    }
  
    .card-footer {
      background-color: #f8f9fa;
      border-top: 1px solid #e9ecef;
      padding: 1rem;
      
      .card-footer-item {
        justify-content: flex-end;
        gap: 0.75rem;
      }
    }
  }
  
  // Tabs styling
  ::v-deep .b-tabs {
    .tabs {
      padding: 0 1rem;
      margin-bottom: 0;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      
      ul {
        border-bottom: none;
        
        li {
          &.is-active {
            a {
              border-bottom-color: #3273dc;
              color: #3273dc;
            }
          }
          
          a {
            padding: 1rem 1.5rem;
            margin-bottom: -1px;
            border-bottom: 2px solid transparent;
            transition: all 0.2s ease;
            
            &:hover {
              border-bottom-color: #dbdbdb;
            }
          }
        }
      }
    }
  
    .tab-content {
      padding: 1.5rem;
    }
  }
  
  // Form styling
  .general-info-form,
  .schedule-config,
  .video-config {
    padding: 1.5rem;
    
    .field {
      margin-bottom: 1.5rem;
      
      label {
        font-weight: 500;
        color: #363636;
        margin-bottom: 0.5rem;
      }
      
      .control {
        .input,
        .textarea,
        .select select {
          border-radius: 4px;
          border: 1px solid #dbdbdb;
          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
          transition: border-color 0.15s ease;
          
          &:focus {
            border-color: #3273dc;
            box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
          }
          
          &.is-danger {
            border-color: #ff3860;
            
            &:focus {
              box-shadow: 0 0 0 0.125em rgba(255, 56, 96, 0.25);
            }
          }
        }
      }
    }
  }
  
  // Video preview section
  .video-preview {
    margin: 1.5rem 0;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    position: relative;
    
    iframe {
      display: block;
      width: 100%;
      height: 360px;
    }
  }
  
  // Video controls
  .video-controls {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 1rem;
    
    .seek-bar-container {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .seek-bar {
        flex: 1;
        height: 8px;
        -webkit-appearance: none;
        background: #e9ecef;
        border-radius: 4px;
        outline: none;
        cursor: pointer;
        transition: background 0.2s ease;
        
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #3273dc;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.1s ease;
          
          &:hover {
            transform: scale(1.1);
          }
        }
        
        &::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #3273dc;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          transition: transform 0.1s ease;
          
          &:hover {
            transform: scale(1.1);
          }
        }
      }
      
      .time-display {
        min-width: 120px;
        text-align: right;
        font-family: monospace;
        font-size: 0.875rem;
        color: #4a4a4a;
      }
    }
  }
  
  // Navigation panel configuration
  .nav-panel-config {
    margin-top: 2rem;
    
    .subtitle {
      color: #363636;
      margin-bottom: 0.75rem;
    }
    
    .nav-panel-item {
      margin-bottom: 1.5rem;
      
      .nav-panel-field {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        
        .button {
          margin-top: 1.75rem;
        }
      }
    }
  }
  
  // Notifications
  .notification {
    border-radius: 4px;
    padding: 1.25rem;
    position: relative;
    
    &.is-warning {
      background-color: #fffbeb;
      color: #92400e;
    }
    
    &.is-danger {
      background-color: #fef2f2;
      color: #991b1b;
    }
  }
  
  // Buttons
  ::v-deep .button {
    height: 2.5rem;
    padding: 0 1.25rem;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &.is-primary {
      background-color: #3273dc;
      border-color: transparent;
      color: #fff;
      
      &:hover {
        background-color: #2366d1;
      }
      
      &:focus {
        box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
      }
    }
    
    &.is-light {
      background-color: #f5f5f5;
      border-color: transparent;
      color: #363636;
      
      &:hover {
        background-color: #e8e8e8;
      }
    }
  }
  
  // Responsive adjustments
  @media screen and (max-width: 1023px) {
    ::v-deep .modal-card {
      width: calc(100% - 40px);
      margin: 20px;
    }
    
    .video-preview iframe {
      height: 240px;
    }
  }
  
  @media screen and (max-width: 768px) {
    .nav-panel-field {
      flex-direction: column;
      gap: 0.5rem;
      
      .button {
        width: 100%;
        margin-top: 0.5rem !important;
      }
    }
    
    .card-footer-item {
      flex-direction: column;
      
      .button {
        width: 100%;
        margin: 0.25rem 0;
      }
    }
  }
  </style>
  
  