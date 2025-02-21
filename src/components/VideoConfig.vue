<template>
    <div class="video-config">
      <!-- Video Player -->
      <div class="video-container mb-4">
        <div class="video-wrapper">
          <div v-if="isLoading" class="loading-overlay">
            <b-loading :is-full-page="false" :active="isLoading"></b-loading>
          </div>
          <iframe
            v-if="videoId"
            :src="`https://player.vimeo.com/video/${videoId}`"
            width="100%"
            height="100%"
            frameborder="0"
            allow="autoplay; fullscreen"
            allowfullscreen
            ref="vimeoIframe"
          ></iframe>
          <div v-else class="video-placeholder">
            <p>No video URL provided</p>
          </div>
        </div>
      </div>
  
      <!-- Video Controls -->
      <div class="video-controls mb-4">
        <div class="buttons has-addons is-centered">
          <b-button 
            icon-left="play"
            @click="playVideo"
            :disabled="!videoId"
          >
            Play
          </b-button>
          <b-button 
            icon-left="pause"
            @click="pauseVideo"
            :disabled="!videoId"
          >
            Pause
          </b-button>
          <b-button 
            icon-left="restart"
            @click="restartVideo"
            :disabled="!videoId"
          >
            Restart
          </b-button>
        </div>
      </div>
  
      <!-- Seek Bar -->
      <div class="seek-bar-container mb-4">
        <b-field>
          <b-slider
            v-model="currentTime"
            :max="videoDuration"
            :step="1"
            @input="handleSeek"
            :disabled="!videoId"
            tooltip
            :custom-formatter="formatTime"
          >
          </b-slider>
        </b-field>
        <div class="time-display has-text-centered">
          {{ formatTime(currentTime) }} / {{ formatTime(videoDuration) }}
        </div>
      </div>
  
      <!-- Navigation Panel Configuration -->
      <div class="navigation-panel">
        <h4 class="title is-5 mb-3">Navigation Panel Configuration</h4>
        <div class="panel-options">
          <div v-for="(option, key) in navConfig" :key="key" class="option-item mb-4">
            <div class="columns is-vcentered">
              <div class="column is-4">
                <b-field 
                  :label="`${capitalize(key)} Option`"
                  :type="errors[key] ? 'is-danger' : ''"
                  :message="errors[key]"
                >
                  <b-select
                    v-model="navConfig[key].value"
                    expanded
                    @input="validateAndUpdate"
                  >
                    <option value="">Select option</option>
                    <option 
                      v-for="opt in availableOptions(key)"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-4">
                <b-field 
                  label="Time (seconds)"
                  :type="errors[key] ? 'is-danger' : ''"
                >
                  <b-input
                    type="number"
                    v-model.number="navConfig[key].time"
                    min="0"
                    :max="videoDuration"
                    :disabled="!navConfig[key].value"
                    @input="validateAndUpdate"
                  ></b-input>
                </b-field>
              </div>
              <div class="column is-4">
                <b-button
                  type="is-info"
                  size="is-small"
                  icon-left="clock"
                  :disabled="!navConfig[key].value"
                  @click="setCurrentTimeToOption(key)"
                >
                  Set Current Time
                </b-button>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Save Button -->
        <!-- <div class="field mt-4">
          <b-button
            type="is-primary"
            :disabled="!isValidConfiguration"
            :loading="isSaving"
            @click="saveChanges"
          >
            Save Changes
          </b-button>
        </div> -->
  
        <!-- Validation Summary -->
        <div v-if="hasValidationErrors" class="validation-summary mt-4">
          <b-message type="is-danger">
            <ul>
              <li v-for="error in activeErrors" :key="error.key">
                {{ capitalize(error.key) }}: {{ error.message }}
              </li>
            </ul>
          </b-message>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Player from '@vimeo/player'
  
  export default {
    name: 'VideoConfig',
  
    props: {
      value: {
        type: [Object, String],
        default: () => ({})
      },
      videoUrl: {
        type: String,
        default: ''
      }
    },
  
    data() {
      return {
        isLoading: true,
        isSaving: false,
        player: null,
        currentTime: 0,
        videoDuration: 0,
        isSeekingFromCustomBar: false,
        navConfig: {
          first: { value: '', time: 0 },
          second: { value: '', time: 0 },
          third: { value: '', time: 0 },
          fourth: { value: '', time: 0 }
        },
        optionsList: [
          { value: 'chat', label: 'Chat' },
          { value: 'notes', label: 'Notes' },
          { value: 'offers', label: 'Offers' },
          { value: 'polls', label: 'Polls' }
        ],
        valueMap: {
          'chat': 'chat',
          'Chat': 'chat',
          'notes': 'notes',
          'Notes': 'notes',
          'offer': 'offers',
          'Offer': 'offers',
          'offers': 'offers',
          'Offers': 'offers',
          'poll': 'polls',
          'Poll': 'polls',
          'polls': 'polls',
          'Polls': 'polls'
        },
        errors: {
          first: null,
          second: null,
          third: null,
          fourth: null
        }
      }
    },
    computed: {
    videoId() {
      if (!this.videoUrl) return null;
      const match = this.videoUrl.match(/(?:vimeo.com\/|video\/)(\d+)/);
      return match ? match[1] : null;
    },

    hasValidationErrors() {
      return Object.values(this.errors).some(error => error !== null);
    },

    activeErrors() {
      return Object.entries(this.errors)
        .filter(([, error]) => error !== null)
        .map(([key, error]) => ({
          key,
          message: error
        }));
    },

    isValidConfiguration() {
      const hasValidOptions = Object.values(this.navConfig)
        .some(opt => opt.value !== '' && opt.time > 0);
      
      const allTimesValid = Object.values(this.navConfig)
        .every(opt => !opt.value || (opt.value && opt.time > 0));
      
      return !this.hasValidationErrors && hasValidOptions && allTimesValid;
    }
  },

  methods: {
    async initializeConfig() {
      try {
        console.log('Initializing with value:', this.value);

        // Wait for video duration to be available
        if (this.player && !this.videoDuration) {
          try {
            this.videoDuration = await this.player.getDuration();
          } catch (e) {
            console.warn('Error getting video duration:', e);
          }
        }

        // Initialize with default empty config
        const defaultConfig = {
          first: { value: '', time: 0 },
          second: { value: '', time: 0 },
          third: { value: '', time: 0 },
          fourth: { value: '', time: 0 }
        };

        let incomingConfig = null;

        // Handle different input formats
        if (this.value) {
          if (typeof this.value === 'string') {
            try {
              incomingConfig = JSON.parse(this.value);
            } catch (e) {
              console.warn('Error parsing nav_panel string:', e);
            }
          } else if (typeof this.value === 'object') {
            incomingConfig = this.value;
          }
        }

        // Handle nav_panle typo in payload
        if (this.value && this.value.nav_panle) {
          incomingConfig = this.value.nav_panle;
          console.log('Using nav_panle config:', incomingConfig);
        }

        if (incomingConfig) {
          // Map the incoming values to our config structure
          Object.keys(defaultConfig).forEach(key => {
            const incomingKey = key === 'fourth' ? 'four' : key;
            if (incomingConfig[incomingKey]) {
              const timeValue = incomingConfig[incomingKey].time;
              defaultConfig[key] = {
                value: this.normalizeOptionValue(incomingConfig[incomingKey].value),
                time: timeValue === '' || timeValue === null ? 0 : parseInt(timeValue) || 0
              };
            }
          });
        }

        console.log('Setting navConfig with:', defaultConfig);
        this.navConfig = { ...defaultConfig };
        
        // Force a reactive update
        this.$nextTick(() => {
          this.navConfig = { ...this.navConfig };
          this.validateConfig();
        });
      } catch (error) {
        console.error('Error in initializeConfig:', error);
      }
    },

    normalizeOptionValue(value) {
      if (!value) return '';
      return this.valueMap[value] || value;
    },

    async initializePlayer() {
      if (this.videoId && this.$refs.vimeoIframe) {
        this.isLoading = true;
        this.player = new Player(this.$refs.vimeoIframe);

        try {
          const duration = await this.player.getDuration();
          this.videoDuration = duration;
          this.$emit('duration-update', duration);
          await this.initializeConfig(); // Initialize config after getting duration
          this.isLoading = false;
        } catch (error) {
          console.error('Error getting video duration:', error);
          this.isLoading = false;
          this.$buefy.toast.open({
            message: 'Error loading video',
            type: 'is-danger'
          });
        }

        this.player.on('timeupdate', ({ seconds }) => {
          if (!this.isSeekingFromCustomBar) {
            this.currentTime = seconds;
          }
        });

        this.player.on('loaded', () => {
          this.isLoading = false;
        });

        this.player.on('error', () => {
          this.isLoading = false;
          this.$buefy.toast.open({
            message: 'Error playing video',
            type: 'is-danger'
          });
        });
      }
    },

    playVideo() {
      if (this.player) this.player.play();
    },

    pauseVideo() {
      if (this.player) this.player.pause();
    },

    restartVideo() {
      if (this.player) {
        this.player.setCurrentTime(0);
        this.player.play();
      }
    },

    handleSeek(value) {
      if (!this.player) return;

      this.isSeekingFromCustomBar = true;
      this.currentTime = value;

      this.player.setCurrentTime(value)
        .then(() => {
          setTimeout(() => {
            this.isSeekingFromCustomBar = false;
          }, 100);
        })
        .catch((error) => {
          console.error('Error seeking video:', error);
          this.isSeekingFromCustomBar = false;
          this.$buefy.toast.open({
            message: 'Error seeking video',
            type: 'is-warning'
          });
        });
    },

    formatTime(seconds) {
      if (!seconds) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    availableOptions(currentKey) {
      const usedValues = Object.entries(this.navConfig)
        .filter(([key]) => key !== currentKey)
        .map(([, opt]) => opt.value)
        .filter(Boolean);

      return this.optionsList.filter(opt => !usedValues.includes(opt.value));
    },

    validateConfig() {
      console.log('Validating config:', this.navConfig);
      const order = ['first', 'second', 'third', 'fourth'];
      let lastTime = 0;
      let hasError = false;
      let selectedOptions = 0;
      let filledTimes = 0;

      // Reset errors
      Object.keys(this.errors).forEach(key => {
        this.errors[key] = null;
      });

      // Validate each option
      order.forEach(key => {
        const option = this.navConfig[key];
        
        if (option.value) {
          selectedOptions++;
          
          if (option.time === null || option.time === '') {
            option.time = 0;
          }

          if (parseInt(option.time) <= 0) {
            this.errors[key] = 'Time must be provided for selected option';
            hasError = true;
          } else if (parseInt(option.time) <= lastTime) {
            this.errors[key] = `Time must be greater than ${this.formatTime(lastTime)}`;
            hasError = true;
          } else if (this.videoDuration && parseInt(option.time) > this.videoDuration) {
            this.errors[key] = `Time cannot exceed video duration (${this.formatTime(this.videoDuration)})`;
            option.time = this.videoDuration;
            hasError = true;
          }

          if (parseInt(option.time) > 0) {
            filledTimes++;
          }
          
          lastTime = parseInt(option.time);
        }
      });

      if (selectedOptions > 0 && selectedOptions !== filledTimes) {
        console.log('Validation failed:', { selectedOptions, filledTimes });
        this.$buefy.toast.open({
          message: 'All selected options must have a time value',
          type: 'is-danger',
          duration: 3000
        });
        hasError = true;
      }

      console.log('Validation result:', { hasError, selectedOptions, filledTimes });
      return !hasError;
    },

    validateAndUpdate() {
      this.validateConfig();
      this.emitUpdate();
    },

    setCurrentTimeToOption(key) {
      if (this.navConfig[key].value) {
        const prevKey = this.getPreviousKey(key);
        const prevTime = prevKey ? this.navConfig[prevKey].time : 0;

        if (this.currentTime <= prevTime) {
          this.$buefy.toast.open({
            message: `Time must be greater than ${this.formatTime(prevTime)}`,
            type: 'is-warning'
          });
          return;
        }

        this.navConfig[key].time = Math.floor(this.currentTime);
        this.validateAndUpdate();
      }
    },

    getPreviousKey(currentKey) {
      const order = ['first', 'second', 'third', 'fourth'];
      const currentIndex = order.indexOf(currentKey);
      if (currentIndex <= 0) return null;

      for (let i = currentIndex - 1; i >= 0; i--) {
        if (this.navConfig[order[i]].value) {
          return order[i];
        }
      }
      return null;
    },

    emitUpdate() {
      try {
        const output = {};
        Object.entries(this.navConfig).forEach(([key, value]) => {
          if (key === 'fourth') {
            output.four = value;
          } else {
            output[key] = value;
          }
        });

        this.$emit('input', output);
        console.log('Emitted nav panel config:', output);
      } catch (error) {
        console.error('Error emitting update:', error);
      }
    },

    saveChanges() {
      if (this.validateConfig()) {
        this.isSaving = true;
        try {
          this.emitUpdate();
          this.$buefy.toast.open({
            message: 'Navigation panel configuration saved',
            type: 'is-success'
          });
        } catch (error) {
          console.error('Error saving changes:', error);
          this.$buefy.toast.open({
            message: 'Error saving changes',
            type: 'is-danger'
          });
        } finally {
          this.isSaving = false;
        }
      }
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        console.log('Value changed:', newVal);
        if (newVal && Object.keys(newVal).length > 0) {
          this.initializeConfig();
        }
      }
    },
    videoUrl: {
      immediate: true,
      handler(newVal) {
        console.log('Video URL changed:', newVal);
        if (newVal) {
          this.$nextTick(async () => {
            await this.initializePlayer();
          });
        }
      }
    }
  },

  async mounted() {
    console.log('Component mounted');
    if (this.videoUrl) {
      await this.initializePlayer();
    }
  }
}
</script>

<style scoped>
.video-config {
  padding: 1rem;
}

.video-container {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.video-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  color: white;
}

.seek-bar-container {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.time-display {
  margin-top: 0.5rem;
  font-family: monospace;
}

.navigation-panel {
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.option-item {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1);
}
</style>
