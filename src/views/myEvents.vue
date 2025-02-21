<template>
  <section>
    <b-table
      :data="displayedData"
      :paginated="true"
      :per-page="pageSize"
      :current-page.sync="currentPage"
      :pagination-position="'bottom'"
      :loading="isLoading"
      detailed
      :selected.sync="selected"
      selected-row-class="is-selected"
      focusable
      @select="handleSelect"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">

      <b-table-column field="event_name" label="Event Name" v-slot="props">
        {{ props.row.event_name }}
      </b-table-column>

      <b-table-column field="event_id" label="Event ID" v-slot="props">
        {{ props.row.event_id }}
      </b-table-column>

      <b-table-column field="contact_name" label="Contact Name" v-slot="props">
        {{ props.row.contact_name }}
      </b-table-column>

      <b-table-column field="contact_email" label="Email" v-slot="props">
        {{ props.row.contact_email }}
      </b-table-column>

      <b-table-column field="webinar_duration" label="Duration" centered v-slot="props">
        {{ props.row.webinar_duration }}
      </b-table-column>

      <b-table-column field="time_zone" label="Time Zone" centered v-slot="props">
        {{ props.row.time_zone }}
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">No events found</div>
      </template>

      <template #pagination>
        <b-pagination
          :total="event_data.length"
          :per-page="pageSize"
          v-model="currentPage"
          :rounded="true"
          order="is-centered">
          
          <template #previous>
            <b-button 
              :disabled="currentPage === 1"
              @click="previousPage">
              <b-icon icon="chevron-left"></b-icon>
              Previous
            </b-button>
          </template>

          <template #next>
            <b-button 
              :disabled="!hasMorePages"
              @click="nextPage">
              Next
              <b-icon icon="chevron-right"></b-icon>
            </b-button>
          </template>
        </b-pagination>
      </template>

      <template #footer v-if="next_token">
        <div class="has-text-right p-2">
          <b-button 
            @click="loadMoreData" 
            :loading="isLoadingMore"
            type="is-primary"
            :disabled="isLoadingMore">
            Load More
          </b-button>
        </div>
      </template>
    </b-table>

    <!-- Modal -->
    <!-- <b-modal
      v-model="isModalActive"
      has-modal-card
      full-screen
      :can-cancel="false">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">Event Details</p>
        </header>
        <section class="modal-card-body">
        
          <p>Modal Content</p>
        </section>
        <footer class="modal-card-foot">
          <b-button
            label="Close"
            @click="closeModal" />
        </footer>
      </div>
    </b-modal> -->

     <!-- Add the edit modal -->
     <edit-event-modal
      v-model="isEditModalActive"
      :active-row="active_row"
      @save="handleSave"
    />

  </section>
</template>

<script>
import EditEventModal from '@/components/EditEventModal.vue'

export default {
  components: {
    EditEventModal
  },
  name: 'MyEvents',
  data() {
    return {
      selected: null,
      event_data: [],
      pageSize: 10,
      currentPage: 1,
      next_token: null,
      isLoading: false,
      isLoadingMore: false,
      customer_id: 'abcdefg-hijklmo-opqrs',
      isModalActive: false,
      active_row:null,
      isEditModalActive: false,
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.event_data.length / this.pageSize)
    },
    
    displayedData() {
      return this.event_data
    },

    hasMorePages() {
      return this.currentPage < this.totalPages || this.next_token !== null
    }
  },

  methods: {
    async handleSave(updatedData) {
      try {
        console.log('Saving event:', updatedData)
        // Implement your save logic here
        // For example:
        // await this.updateEvent(updatedData)
        // Refresh your table data if needed
      } catch (error) {
        console.error('Error saving event:', error)
      }
    },
    async getCustomer_id() {
          try {
            const data = {
                    "mode": "getCustomer_id"
                  }
      
            const result = await this.$post_AWS_API(data)
            console.log(result)
            
            // Update the data properties
            this.customer_id = result.data.body.customer_id
      
          } catch (error) {
            console.error('Error fetching work orders:', error)
            // You might want to handle the error appropriately here
            // For example, show a notification to the user
          }
        },
    handleSelect(row) {
      console.log(row)
      this.active_row=row
      if (row) {
        this.isModalActive = true
        this.isEditModalActive = true
      }
    },

    closeModal() {
      this.isModalActive = false
    },

    async fetchEventsCreated(token = null) {
      try {
        this.isLoading = !token
        this.isLoadingMore = !!token

        const data = {
          "mode": "get_events",
          "customer_id": this.customer_id,
          "page_size": this.pageSize
        }

        if (token) {
          data.next_token = token
        }

        const result = await this.$post_AWS_API(data)
        
        let responseData
        if (typeof result.data.body === 'string') {
          responseData = JSON.parse(result.data.body)
        } else {
          responseData = result.data.body
        }

        this.next_token = responseData.next_token || null

        if (token) {
          this.event_data = [...this.event_data, ...responseData.items]
        } else {
          this.event_data = responseData.items || []
        }

      } catch (error) {
        console.error('Error fetching events:', error)
        this.$buefy.toast.open({
          message: 'Error loading events. Please try again.',
          type: 'is-danger',
          duration: 3000
        })
      } finally {
        this.isLoading = false
        this.isLoadingMore = false
      }
    },

    async loadMoreData() {
      if (this.next_token && !this.isLoadingMore) {
        await this.fetchEventsCreated(this.next_token)
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.hasMorePages) {
        if (this.currentPage === this.totalPages && this.next_token) {
          this.loadMoreData()
        }
        this.currentPage++
      }
    }
  },

  watch: {
    currentPage: {
      handler(newPage) {
        if (newPage === this.totalPages && this.next_token) {
          this.loadMoreData()
        }
      }
    }
  },

  async created() {
    await this.getCustomer_id()
    await this.fetchEventsCreated()
  }
}
</script>

<style scoped>
.table-container {
  margin: 20px;
}

.p-2 {
  padding: 0.5rem;
}

/* Make table responsive */
@media screen and (max-width: 768px) {
  ::v-deep .table-wrapper {
    overflow-x: auto;
  }
}

/* Style pagination buttons */
::v-deep .pagination-previous,
::v-deep .pagination-next {
  padding: 0.5em 1em;
  margin: 0 0.25em;
}

::v-deep .pagination {
  margin-top: 1rem;
}

::v-deep .pagination-link.is-current {
  background-color: #3273dc;
  border-color: #3273dc;
  color: #fff;
}

/* Selected row styling */
::v-deep .table tbody tr.is-selected {
  background-color: #7957d5 !important;
  color: #fff;
}

::v-deep .table tbody tr.is-selected:hover {
  background-color: #7957d5 !important;
  color: #fff;
}
</style>
