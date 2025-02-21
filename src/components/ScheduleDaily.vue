<!-- ScheduleDaily.vue -->
<template>
    <div class="schedule-daily">
      <div class="mb-4">
        <time-zone-selector
          v-model="timezone"
          @input="updateSchedule"
        />
      </div>
  
      <div class="date-range mb-4">
        <div class="columns">
          <div class="column is-6">
            <b-field label="Start Date">
              <b-datepicker
                v-model="scheduleData.startDateObj"
                :min-date="new Date()"
                placeholder="Select start date"
                @input="updateSchedule"
                icon="calendar-today"
                trap-focus
                :mobile-native="false"
              >
              </b-datepicker>
            </b-field>
          </div>
          <div class="column is-6">
            <b-field label="End Date">
              <b-datepicker
                v-model="scheduleData.endDateObj"
                :min-date="scheduleData.startDateObj || new Date()"
                placeholder="Select end date"
                @input="updateSchedule"
                icon="calendar-today"
                trap-focus
                :mobile-native="false"
              >
              </b-datepicker>
            </b-field>
          </div>
        </div>
      </div>
  
      <div class="times-container">
        <h4 class="subtitle is-5 mb-2">Daily Times</h4>
        <div 
          v-for="(time, index) in scheduleData.times" 
          :key="index"
          class="time-slot"
        >
          <div class="columns is-vcentered">
            <div class="column is-8">
              <b-field>
                <b-timepicker
                  v-model="time.timeObj"
                  placeholder="Select time"
                  hour-format="24"
                  @input="updateSchedule"
                  icon="clock-outline"
                  trap-focus
                  :mobile-native="false"
                >
                </b-timepicker>
              </b-field>
            </div>
            <div class="column is-4 has-text-centered">
              <button 
                class="button is-danger is-small delete-btn" 
                @click="removeTime(index)"
              >
                <span class="icon">
                  <i class="mdi mdi-delete"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
  
        <div class="field mt-4">
          <button 
            class="button is-primary is-small add-btn" 
            @click="addTime"
          >
            <span class="icon">
              <i class="mdi mdi-plus"></i>
            </span>
            <span>Add Time</span>
          </button>
        </div>
  
        <!-- No times message -->
        <div v-if="scheduleData.times.length === 0" class="no-times-message">
          <p class="has-text-grey has-text-centered">
            No times added. Click "Add Time" to start.
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import moment from 'moment-timezone'
  import TimeZoneSelector from './TimeZoneSelector.vue'
  
  export default {
    name: 'ScheduleDaily',
  
    components: {
      TimeZoneSelector
    },
  
    props: {
      value: {
        type: Object,
        required: true
      }
    },
  
    data() {
      return {
        timezone: this.value.timezone || 'UTC',
        scheduleData: {
          startDateObj: null,
          endDateObj: null,
          times: []
        }
      }
    },
  
    methods: {
      addTime() {
        this.scheduleData.times.push({ timeObj: null })
      },
  
      removeTime(index) {
        this.$buefy.dialog.confirm({
          title: 'Delete Time',
          message: 'Are you sure you want to delete this time?',
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.scheduleData.times.splice(index, 1)
            this.updateSchedule()
          }
        })
      },
  
      updateSchedule() {
        const times = this.scheduleData.times
          .filter(t => t.timeObj)
          .map(t => moment(t.timeObj).format('HH:mm'))
          .sort()
  
        this.$emit('input', {
          timezone: this.timezone,
          type: 'daily',
          schedule: {
            startDate: this.scheduleData.startDateObj ? 
              moment(this.scheduleData.startDateObj).format('YYYY-MM-DD') : null,
            endDate: this.scheduleData.endDateObj ? 
              moment(this.scheduleData.endDateObj).format('YYYY-MM-DD') : null,
            times
          }
        })
      },
  
      initializeSchedule() {
        if (this.value.schedule) {
          this.timezone = this.value.timezone || 'UTC'
          this.scheduleData.startDateObj = this.value.schedule.startDate ? 
            moment(this.value.schedule.startDate).toDate() : null
          this.scheduleData.endDateObj = this.value.schedule.endDate ? 
            moment(this.value.schedule.endDate).toDate() : null
          this.scheduleData.times = (this.value.schedule.times || [])
            .map(time => ({
              timeObj: moment(time, 'HH:mm').toDate()
            }))
        }
  
        if (!this.scheduleData.times.length) {
          this.scheduleData.times = [{ timeObj: null }]
        }
      }
    },
  
    created() {
      this.initializeSchedule()
    },
  
    watch: {
      value: {
        handler() {
          this.initializeSchedule()
        },
        deep: true
      }
    }
  }
  </script>
  
  <style scoped>
  .schedule-daily {
    padding: 1rem;
  }
  
  .date-range {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }
  
  .date-range:hover {
    box-shadow: 0 2px 8px rgba(10, 10, 10, 0.1);
  }
  
  .time-slot {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .time-slot:hover {
    box-shadow: 0 2px 8px rgba(10, 10, 10, 0.1);
    transform: translateY(-1px);
  }
  
  .delete-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .delete-btn:hover {
    transform: scale(1.1);
  }
  
  .delete-btn .icon {
    margin: 0;
    font-size: 1.1rem;
  }
  
  .add-btn {
    padding: 0 1rem;
    height: 2.25rem;
    transition: all 0.3s ease;
  }
  
  .add-btn:hover {
    transform: translateY(-1px);
  }
  
  .add-btn .icon {
    margin-right: 0.25rem;
  }
  
  .subtitle.is-5 {
    font-size: 1rem;
    font-weight: 600;
    color: #363636;
    margin-bottom: 1rem;
  }
  
  .no-times-message {
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 1rem;
  }
  
  /* Input styling */
  ::v-deep .input {
    height: 2.25rem;
    font-size: 0.875rem;
  }
  
  ::v-deep .field:not(:last-child) {
    margin-bottom: 0.75rem;
  }
  
  /* Label styling */
  ::v-deep .label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #363636;
    margin-bottom: 0.25rem;
  }
  
  /* Mobile Responsiveness */
  @media screen and (max-width: 768px) {
    .date-range, .time-slot {
      padding: 1rem;
    }
  
    .columns {
      margin: 0;
    }
  
    .column {
      padding: 0.5rem;
    }
  }
  
  /* Animation */
  .time-slot {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>
  