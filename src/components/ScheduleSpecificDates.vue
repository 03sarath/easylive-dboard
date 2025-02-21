<template>
    <div class="schedule-specific-dates">
      <div class="mb-4">
        <time-zone-selector
          v-model="timezone"
          @input="handleTimezoneChange"
        />
      </div>
  
      <div class="date-time-pairs">
        <div 
        v-for="(dateTime, index) in scheduleDates" 
        :key="'datetime-' + index"
        class="date-time-pair mb-4"
        >

          <div class="columns is-vcentered">
            <div class="column is-5">
              <b-field label="Date">
                <b-datepicker
                  v-model="dateTime.dateObj"
                  :min-date="new Date()"
                  placeholder="Select date"
                  @change="handleDateChange($event, index)"
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
                  @change="handleTimeChange($event, index)"
                  icon="clock-outline"
                  trap-focus
                  :mobile-native="false"
                >
                </b-timepicker>
              </b-field>
            </div>
            <div class="column is-2 has-text-centered">
              <button 
                class="button is-danger is-small" 
                @click="removeDateTime(index)"
                :disabled="scheduleDates.length === 1"
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
            class="button is-primary is-small" 
            @click.prevent="addDateTime"
        >
            <span class="icon">
                <i class="mdi mdi-plus"></i>
            </span>
            <span>Add Date & Time</span>
        </button>

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
        required: true,
        default: () => ({
          schedule: {
            dates: []
          },
          timezone: 'UTC',
          type: 'specific'
        })
      }
    },
  
    data() {
        return {
            timezone: 'UTC',
            scheduleDates: [{
            dateObj: null,
            timeObj: null
            }]
        }
        },
  
        created() {
        if (!this.scheduleDates.length) {
            this.scheduleDates = [{
            dateObj: null,
            timeObj: null
            }];
        }
        this.initializeSchedule();
        },

  
    methods: {
      handleDateChange(value, index) {
        console.log('Date changed:', value, 'at index:', index)
        this.scheduleDates[index].dateObj = value
        this.updateSchedule()
      },
  
      handleTimeChange(value, index) {
            console.log('Time changed:', value, 'at index:', index)
            console.log('Before update - scheduleDates:', JSON.stringify(this.scheduleDates))
            
            // Update the timeObj
            this.scheduleDates[index].timeObj = value
            
            console.log('After update - scheduleDates:', JSON.stringify(this.scheduleDates))
            this.updateSchedule()
        },
  
      handleTimezoneChange(value) {
        console.log('Timezone changed:', value)
        this.timezone = value
        this.updateSchedule()
      },
  
      addDateTime() {
            console.log('Current scheduleDates:', JSON.stringify(this.scheduleDates));
            this.scheduleDates.push({
                dateObj: null,
                timeObj: null
            });
            console.log('Updated scheduleDates:', JSON.stringify(this.scheduleDates));
            this.updateSchedule();
        },
      removeDateTime(index) {
        if (this.scheduleDates.length === 1) {
          return
        }
  
        this.$buefy.dialog.confirm({
          title: 'Delete Date & Time',
          message: 'Are you sure you want to delete this date and time?',
          confirmText: 'Delete',
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => {
            this.scheduleDates.splice(index, 1)
            this.updateSchedule()
            console.log('Removed date time at index:', index)
          }
        })
      },
  
      initializeSchedule() {
        console.log('Initializing schedule with value:', this.value)
        
        this.timezone = this.value.timezone || 'UTC'
        
        if (this.value.schedule?.dates?.length > 0) {
          this.scheduleDates = this.value.schedule.dates.map(dateTime => {
            const dateTimeStr = `${dateTime.date} ${dateTime.time}`
            const datetime = moment.tz(dateTimeStr, 'YYYY-MM-DD HH:mm', this.timezone)
            
            return {
              dateObj: datetime.toDate(),
              timeObj: datetime.toDate()
            }
          })
          console.log('Schedule initialized with dates:', this.scheduleDates)
        } else {
          this.scheduleDates = [{ dateObj: null, timeObj: null }]
          console.log('Schedule initialized with empty date slot')
        }
      },
  
      updateSchedule() {
            console.log('Starting updateSchedule with scheduleDates:', JSON.stringify(this.scheduleDates))
            
            // Filter out incomplete entries
            const completeDates = this.scheduleDates
            .filter(dt => {
                const hasDate = !!dt.dateObj
                const hasTime = !!dt.timeObj
                console.log('Entry validation:', { hasDate, hasTime, entry: dt })
                return hasDate && hasTime
            })
            .map(dt => {
                const time = moment(dt.timeObj)
                console.log('Processing time:', time.format('HH:mm'))
                
                // Combine date and time
                const combinedDateTime = moment(dt.dateObj)
                .hour(time.hour())
                .minute(time.minute())
                .tz(this.timezone)
                
                const formatted = {
                date: combinedDateTime.format('YYYY-MM-DD'),
                time: combinedDateTime.format('HH:mm')
                }
                console.log('Formatted datetime:', formatted)
                return formatted
            })
            .sort((a, b) => {
                return moment(`${a.date} ${a.time}`).diff(moment(`${b.date} ${b.time}`))
            })

            console.log('Processed completeDates:', completeDates)

            // Create the payload with the correct structure
            const payload = {
            schedule: {
                schedule: {  // Note the nested schedule structure
                dates: completeDates
                },
                timezone: this.timezone,
                type: 'specific'
            }
            }

            console.log('Emitting payload:', JSON.stringify(payload))
            this.$emit('input', payload)
        },

    },
    watch: {
            scheduleDates: {
                handler() {
                    console.log('Watch triggered for scheduleDates:', JSON.stringify(this.scheduleDates));
                    this.updateSchedule();
                },
                deep: true
            }
        }


  }
  </script>
  
  <style scoped>
  .schedule-specific-dates {
    margin-bottom: 1.5rem;
  }
  
  .date-time-pair {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.25rem;
  }
  
  .date-time-pair:hover {
    box-shadow: 0 2px 8px rgba(10, 10, 10, 0.1);
  }
  </style>
  