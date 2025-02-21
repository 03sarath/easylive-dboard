<template>
  <section class="events-container">
    <b-table
      :data="displayedData"
      :paginated="true"
      :per-page="pageSize"
      :current-page.sync="currentPage"
      :pagination-position="'bottom'"
      :loading="isLoading"
      :selected.sync="selected"
      selected-row-class="is-selected"
      focusable
      @select="handleSelect"
      :sort-icon="sortIcon"
      :sort-icon-size="sortIconSize"
      :default-sort="[sortField, sortOrder]"
      :default-sort-direction="defaultSortOrder"
      @sort="onSort"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">

      <b-table-column 
        field="event_name" 
        label="Event Name" 
        v-slot="props"
        sortable>
        {{ props.row.event_name }}
      </b-table-column>

      <b-table-column 
        field="event_id" 
        label="Event ID" 
        v-slot="props"
        sortable>
        {{ props.row.event_id }}
      </b-table-column>

      <!-- <b-table-column 
        field="webinar_duration" 
        label="Duration" 
        centered 
        v-slot="props"
        sortable
        :custom-sort="sortDuration">
        {{ formatDuration(props.row.webinar_duration) }}
      </b-table-column> -->

      <b-table-column 
        field="schedule.type" 
        label="Schedule Type" 
        centered 
        v-slot="props"
        sortable>
        {{ formatScheduleType(props.row.schedule?.type) }}
      </b-table-column>

      <b-table-column 
        field="event_details" 
        label="Event Details" 
        centered 
        v-slot="props">
        <b-button 
          size="is-small"
          type="is-info"
          @click.stop="viewDetails(props.row)">
          View Details
        </b-button>
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
              @click="previousPage"
              class="pagination-button">
              <b-icon icon="chevron-left"></b-icon>
              <span>Previous</span>
            </b-button>
          </template>

          <template #next>
            <b-button 
              :disabled="!hasMorePages"
              @click="nextPage"
              class="pagination-button">
              <span>Next</span>
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
      active_row: null,
      isEditModalActive: false,
      // Add sorting related data
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',
      sortField: 'event_name',
      sortOrder: 'asc',
      defaultSortOrder: 'asc'
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
    // Add sorting methods
    onSort(field, order) {
      this.sortField = field
      this.sortOrder = order
    },

    sortDuration(a, b, isAsc) {
      const durationA = a.webinar_duration || 0
      const durationB = b.webinar_duration || 0
      return isAsc ? durationA - durationB : durationB - durationA
    },

    // Existing methods
    formatDuration(duration) {
      if (!duration) return '00:00:00';
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = duration % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    formatScheduleType(type) {
      if (!type) return 'N/A';
      return type.charAt(0).toUpperCase() + type.slice(1);
    },

    viewDetails(row) {
      this.active_row = row;
      this.isEditModalActive = true;
    },

    handleSelect(row) {
      console.log(row)
      this.active_row = row
      if (row) {
        this.isModalActive = true
        this.isEditModalActive = true
      }
    },

    async handleSave(updatedData) {
      try {
        // Add mode to the updatedData
        const data = {
          ...updatedData,
          "mode": "update_event"
        }

        // Make API call
        const result = await this.$post_AWS_API(data)
        console.log('Update event result:', result)

        // Show success message using Buefy toast
        this.$buefy.toast.open({
          message: 'Event updated successfully',
          type: 'is-success',
          duration: 3000
        })

      } catch (error) {
        console.error('Error updating event:', error)
        // Show error message using Buefy toast
        this.$buefy.toast.open({
          message: 'Error updating event. Please try again.',
          type: 'is-danger',
          duration: 3000
        })
      } finally {
        // Close the modal after save attempt (successful or not)
        this.isEditModalActive = false
      }
    },


    async getCustomer_id() {
      try {
        const data = {
          "mode": "getCustomer_id"
        }
        const result = await this.$post_AWS_API(data)
        console.log(result)
        this.customer_id = result.data.body.customer_id
      } catch (error) {
        console.error('Error fetching customer ID:', error)
      }
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
.events-container {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Table styles */
::v-deep .table-wrapper {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow-x: auto;
}

/* Sorting styles */
::v-deep .table th.is-sortable {
  cursor: pointer;
}

::v-deep .table th.is-sortable:hover {
  background-color: #f5f5f5;
}

::v-deep .table th.is-sortable .icon {
  margin-left: 0.5rem;
}

/* Pagination button alignment */
.pagination-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

::v-deep .pagination-previous,
::v-deep .pagination-next {
  display: inline-flex;
  align-items: center;
}

::v-deep .pagination-previous .icon,
::v-deep .pagination-next .icon {
  margin: 0;
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

/* Table cell alignment and spacing */
::v-deep .table td {
  vertical-align: middle;
}

::v-deep .table th {
  font-weight: 600;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .events-container {
    padding: 0.5rem;
  }
  
  ::v-deep .table-wrapper {
    border-radius: 0;
  }
}

.p-2 {
  padding: 0.5rem;
}
</style>
