<!-- ScheduleSpecificDates.vue -->
<template>
    <div class="schedule-specific-dates">
      <div class="mb-4">
        <time-zone-selector
          v-model="timezone"
          @input="updateSchedule"
        />
      </div>
  
      <div class="date-time-pairs">
        <div 
          v-for="(dateTime, index) in scheduleDates" 
          :key="index"
          class="date-time-pair"
        >
          <div class="columns is-vcentered">
            <div class="column is-5">
              <b-field label="Date">
                <b-datepicker
                  v-model="dateTime.dateObj"
                  :min-date="new Date()"
                  placeholder="Select date"
                  @input="updateSchedule"
                  icon="calendar-today"
                  trap-focus
                  :mobile-native="false"
                >
                </b-datepicker>
              </b-field>
            </div>
            <div class="column is-5">
              <b-field label="Time">
                <b-timepicker
                  v-model="dateTime.timeObj"
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
            <div class="column is-2 has-text-centered">
              <button 
                class="button is-danger is-small delete-btn" 
                @click="removeDateTime(index)"
              >
                <span class="icon">
                  <i class="mdi mdi-delete"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="field mt-4">
        <button 
          class="button is-primary is-small add-btn" 
          @click="addDateTime"
        >
          <span class="icon">
            <i class="mdi mdi-plus"></i>
          </span>
          <span>Add Date & Time</span>
        </button>
      </div>
  
      <!-- No dates message -->
      <div v-if="scheduleDates.length === 0" class="no-dates-message">
        <p class="has-text-grey has-text-centered">
          No dates added. Click "Add Date & Time" to start.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import moment from 'moment-timezone'
  import TimeZoneSelector from './TimeZoneSelector.vue'
  
  export default {
    name: 'ScheduleSpecificDates',
  
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
        scheduleDates: []
      }
    },
  
    methods: {
      addDateTime() {
        this.scheduleDates.push({
          dateObj: null,
          timeObj: null
        })
      },
  
      removeDateTime(index) {
        // Show confirmation dialog
        this.$buefy.dialog.confirm({
          title: 'Delete Date & Time',
          message: 'Are you sure you want to delete this date and time?',
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.scheduleDates.splice(index, 1)
            this.updateSchedule()
          }
        })
      },
  
      updateSchedule() {
        const dates = this.scheduleDates
          .filter(dt => dt.dateObj && dt.timeObj)
          .map(dt => {
            const date = moment(dt.dateObj)
            const time = moment(dt.timeObj)
            return date
              .hour(time.hour())
              .minute(time.minute())
              .format('YYYY-MM-DD HH:mm')
          })
          .sort()
  
        this.$emit('input', {
          timezone: this.timezone,
          type: 'specific',
          schedule: {
            dates
          }
        })
      },
  
      initializeSchedule() {
        if (this.value.schedule && this.value.schedule.dates) {
          this.timezone = this.value.timezone || 'UTC'
          this.scheduleDates = this.value.schedule.dates.map(dateStr => {
            const datetime = moment(dateStr)
            return {
              dateObj: datetime.toDate(),
              timeObj: datetime.toDate()
            }
          })
        }
  
        if (!this.scheduleDates.length) {
          this.scheduleDates = [{ dateObj: null, timeObj: null }]
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
  .schedule-specific-dates {
    padding: 1rem;
  }
  
  .date-time-pair {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.25rem;
    margin-bottom: 1rem;
    transition: all 0.3s ease;
  }
  
  .date-time-pair:hover {
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
    margin-top: 1.5rem;
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
  
  /* Date and Time picker styling */
  ::v-deep .datepicker, ::v-deep .timepicker {
    width: 100%;
  }
  
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
  
  /* No dates message */
  .no-dates-message {
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 1rem;
  }
  
  /* Mobile Responsiveness */
  @media screen and (max-width: 768px) {
    .date-time-pair {
      padding: 1rem;
    }
  
    .columns {
      margin: 0;
    }
  
    .column {
      padding: 0.5rem;
    }
  
    .delete-btn {
      margin-top: 0.5rem;
    }
  }
  
  /* Animation for adding/removing dates */
  .date-time-pair {
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
  