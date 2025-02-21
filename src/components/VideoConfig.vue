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
            :src="`https://player.vimeo.com/video/${videoId}?api=1`"
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
        <div class="field mt-4">
          <b-button
            type="is-primary"
            :disabled="!isValidConfiguration"
            :loading="isSaving"
            @click="saveChanges"
          >
            Save Changes
          </b-button>
        </div>
  
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
      type: Object,
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
      if (!this.videoUrl) return null
      const match = this.videoUrl.match(/(?:vimeo.com\/|video\/)(\d+)/)
      return match ? match[1] : null
    },

    hasValidationErrors() {
      return Object.values(this.errors).some(error => error !== null)
    },

    activeErrors() {
      return Object.entries(this.errors)
        .filter(([, error]) => error !== null)
        .map(([key, error]) => ({
          key,
          message: error
        }))
    },

    hasSelectedOptions() {
      return Object.values(this.navConfig)
        .some(opt => opt.value !== '')
    },

    isValidConfiguration() {
    const hasValidOptions = Object.values(this.navConfig)
      .some(opt => opt.value !== '' && opt.time > 0)
    
    const allTimesValid = Object.values(this.navConfig)
      .every(opt => !opt.value || (opt.value && opt.time > 0))
    
    return !this.hasValidationErrors && hasValidOptions && allTimesValid
  }
  },

  methods: {
    initializeConfig() {
      try {
        // Initialize with default empty config
        const defaultConfig = {
          first: { value: '', time: 0 },
          second: { value: '', time: 0 },
          third: { value: '', time: 0 },
          fourth: { value: '', time: 0 }
        }

        // If we have incoming value, use it
        if (this.value && Object.keys(this.value).length > 0) {
          const incomingConfig = { ...this.value }
          
          // Handle four/fourth conversion
          if (incomingConfig.four) {
            incomingConfig.fourth = incomingConfig.four
            delete incomingConfig.four
          }

          // Map values to correct format
          Object.keys(defaultConfig).forEach(key => {
            if (incomingConfig[key]) {
              defaultConfig[key] = {
                value: this.normalizeOptionValue(incomingConfig[key].value),
                time: parseInt(incomingConfig[key].time) || 0
              }
            }
          })
        }

        this.navConfig = defaultConfig
        this.validateConfig()
      } catch (error) {
        console.error('Error initializing config:', error)
        this.$buefy.toast.open({
          message: 'Error initializing configuration',
          type: 'is-danger'
        })
      }
    },

    normalizeOptionValue(value) {
      if (!value) return ''
      return this.valueMap[value] || value
    },

    initializePlayer() {
      if (this.videoId && this.$refs.vimeoIframe) {
        this.isLoading = true
        this.player = new Player(this.$refs.vimeoIframe)

        this.player.getDuration().then(duration => {
          this.videoDuration = duration
          this.$emit('duration-update', duration)
          this.isLoading = false
        }).catch(error => {
          console.error('Error getting video duration:', error)
          this.isLoading = false
          this.$buefy.toast.open({
            message: 'Error loading video',
            type: 'is-danger'
          })
        })

        this.player.on('timeupdate', ({ seconds }) => {
          if (!this.isSeekingFromCustomBar) {
            this.currentTime = seconds
          }
        })

        this.player.on('loaded', () => {
          this.isLoading = false
        })

        this.player.on('error', () => {
          this.isLoading = false
          this.$buefy.toast.open({
            message: 'Error playing video',
            type: 'is-danger'
          })
        })
      }
    },

    playVideo() {
      if (this.player) this.player.play()
    },

    pauseVideo() {
      if (this.player) this.player.pause()
    },

    restartVideo() {
      if (this.player) {
        this.player.setCurrentTime(0)
        this.player.play()
      }
    },

    handleSeek(value) {
      if (!this.player) return

      this.isSeekingFromCustomBar = true
      this.currentTime = value

      this.player.setCurrentTime(value)
        .then(() => {
          setTimeout(() => {
            this.isSeekingFromCustomBar = false
          }, 100)
        })
        .catch((error) => {
          console.error('Error seeking video:', error)
          this.isSeekingFromCustomBar = false
          this.$buefy.toast.open({
            message: 'Error seeking video',
            type: 'is-warning'
          })
        })
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },

    availableOptions(currentKey) {
      const usedValues = Object.entries(this.navConfig)
        .filter(([key]) => key !== currentKey)
        .map(([, opt]) => opt.value)
        .filter(Boolean)

      return this.optionsList.filter(opt => !usedValues.includes(opt.value))
    },

    validateConfig() {
        const order = ['first', 'second', 'third', 'fourth']
        let lastTime = 0
        let hasError = false
        let selectedOptions = 0
        let filledTimes = 0

        // Reset errors
        Object.keys(this.errors).forEach(key => {
            this.errors[key] = null
        })

        // Validate each option
        order.forEach(key => {
            const option = this.navConfig[key]
            
            if (option.value) {
            selectedOptions++
            
            if (option.time <= 0) {
                this.errors[key] = 'Time must be provided for selected option'
                hasError = true
            } else if (option.time <= lastTime) {
                this.errors[key] = `Time must be greater than ${lastTime} seconds`
                hasError = true
            } else if (option.time > this.videoDuration) {
                this.errors[key] = `Time cannot exceed video duration (${this.formatTime(this.videoDuration)})`
                option.time = this.videoDuration
                hasError = true
            }

            if (option.time > 0) {
                filledTimes++
            }
            
            lastTime = option.time
            }
        })

        // Validate that all selected options have times
        if (selectedOptions > 0 && selectedOptions !== filledTimes) {
            this.$buefy.toast.open({
            message: 'All selected options must have a time value',
            type: 'is-danger',
            duration: 3000
            })
            hasError = true
        }

        // Validate minimum required options
        if (selectedOptions === 0) {
            this.$buefy.toast.open({
            message: 'At least one option must be selected',
            type: 'is-warning',
            duration: 3000
            })
            hasError = true
        }

        return !hasError
        },

    validateAndUpdate() {
      this.validateConfig()
      this.emitUpdate()
    },

    setCurrentTimeToOption(key) {
      if (this.navConfig[key].value) {
        const prevKey = this.getPreviousKey(key)
        const prevTime = prevKey ? this.navConfig[prevKey].time : 0

        if (this.currentTime <= prevTime) {
          this.$buefy.toast.open({
            message: `Time must be greater than ${prevTime} seconds`,
            type: 'is-warning'
          })
          return
        }

        this.navConfig[key].time = Math.floor(this.currentTime)
        this.validateAndUpdate()
      }
    },

    getPreviousKey(currentKey) {
      const order = ['first', 'second', 'third', 'fourth']
      const currentIndex = order.indexOf(currentKey)
      if (currentIndex <= 0) return null

      for (let i = currentIndex - 1; i >= 0; i--) {
        if (this.navConfig[order[i]].value) {
          return order[i]
        }
      }
      return null
    },

    emitUpdate() {
      const output = { ...this.navConfig }
      
      // Convert fourth to four if needed
      if (this.value && 'four' in this.value) {
        output.four = output.fourth
        delete output.fourth
      }

      this.$emit('input', output)
    },

    saveChanges() {
      if (this.validateConfig()) {
        this.emitUpdate()
        this.$buefy.toast.open({
          message: 'Changes saved successfully',
          type: 'is-success'
        })
      }
    }
  },

  mounted() {
    this.initializeConfig()
    this.initializePlayer()
  },

  beforeDestroy() {
    if (this.player) {
      this.player.destroy()
    }
  },

  watch: {
    value: {
      handler(newVal) {
        if (newVal && Object.keys(newVal).length > 0) {
          this.initializeConfig()
        }
      },
      deep: true
    },

    videoUrl: {
      handler() {
        this.$nextTick(() => {
          this.initializePlayer()
        })
      },
      immediate: true
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
  
  .validation-summary {
    margin-top: 1rem;
  }
  
  .validation-summary ul {
    margin-left: 1.5rem;
    list-style-type: disc;
  }
  </style>
  