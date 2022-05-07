<template>
  <div>
    <h2>Order List</h2>
    <button @click="exportCsv()">Download CSV</button>
    <div class="col col-md-12">
      <br />
      <div class="row">
        <div class="col-md col-md-2">Search Filter(s):</div>
        <div class="col-md col-md-2">
          <!-- filter multiselect -->
        </div>
        <div class="col-md col-md-2">
          <div v-if="r_showFilter">
            <button @click="r_showFilter = false" class="form-control">
              Hide Filter
            </button>
          </div>
          <div v-else>
            <button @click="r_showFilter = true" class="form-control">
              Show Filter
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="r_showFilter">
      <OrdersFilter />
    </div>
    <div class="col col-md-12">
      <br />
      <div class="row">
        <div class="col-md col-md-2">Sort By:</div>
        <div class="col-md col-md-2">
          <select @change="onListChange" class="form-control">
            <option selected="selected" value="1">Order Date</option>
            <option value="2">Due Date</option>
            <option value="3">Vendor Due Date</option>
            <option value="4">Inspection Date</option>
            <option value="5">Submission Date</option>
            <option value="6">Completion Date</option>
            <option value="7">Order Number</option>
            <option value="8">State</option>
            <option value="9">County</option>
            <option value="10">Appraiser Name</option>
            <option value="11">Client Name</option>
            <option value="12">Borrower Name</option>
            <option value="13">Product</option>
            <option value="14">Order Status</option>
            <option value="15">Last Updated By Staff</option>
            <option value="16">Status Last Updated On</option>
            <option value="17">Date Assigned</option>
            <option value="18">File Reviewed On</option>
            <option value="19">Ordered By</option>
          </select>
        </div>
        <div class="col col-md-2">
          <select @change="onAscendingChange" class="form-control">
            <option selected="selected" value="1">Ascending</option>
            <option value="2">Descending</option>
          </select>
        </div>
      </div>
    </div>
    <table class="results-table">
      <thead>
        <tr>
          <th>Order Info</th>
          <th>Client</th>
          <th>Assigned To</th>
          <th>Dates</th>
          <th>Item(s)</th>
          <th>Status</th>
          <th>Flag</th>
        </tr>
      </thead>
      <tbody>
        <OrdersTableRow
          v-for="orderRow in filterOrders"
          :key="orderRow.orderID"
          :orderRow="orderRow"
        />
      </tbody>
    </table>
    <div class="mt-3">
      <!-- <div v-if="fetching">fetching...</div> -->
      <pagination
        v-model="page"
        :per-page="perPage"
        :records="totalCount"
        @paginate="fetchOrders"
      />
      <select @change="onResultsPerPageChange">
          <option selected value="10">10</option>
          <option value="25">25</option>
          <option value="100">100</option>
          <option values="250">250</option>
      </select>
    </div>
  </div>
</template>


<script>
const utils = require("../../../modules/utils/time");

import OrdersFilter from "./OrdersFilter.vue";
import OrdersTableRow from "./OrdersTableRow.vue";
import Pagination from "vue-pagination-2";

export default {
  name: "OrderListTable",
  components: {
    OrdersFilter,
    OrdersTableRow,
    Pagination,
  },
  props: {
    showFilter: Boolean,
  },
  data() {
    return {
      r_showFilter: this.showFilter,

      orders: [],
      page: 1,
      perPage: 10,
    };
  },
  computed: {
    /*
     * filtered orders based upon sorting
     */
    filterOrders: function () {
      return this.orders;
    },
    totalCount() {
      return this.$store.state.orders.length;
    },
  },
  mounted() {
    // this.onCreate();
    this.fetchOrders();
  },
  destroyed() {
    // this.unsubscribe();
  },
  methods: {
    async fetchOrders() {
      this.changeLoadingState(true);
      this.orders = await this.$store.dispatch("fetchOrders", {
        offset: (this.page - 1) * this.perPage,
        limit: this.perPage,
      });
      this.changeLoadingState(false);
    },

    onResultsPerPageChange(event){
        this.perPage = +event.target.value;
        this.fetchOrders();
    },

    /*
     * formats csv to save
     */
    getCsvContent(orders) {
      let csvData =
        `"Appraisal Number","Address","County","City","State Code","Property Zip","Order Type Name","Transaction Type","Loan Number","Borrower Name","Client","Lender on Report","Branch Name","Ordered By Name","Appraiser Name","Staff Member 1","Staff Member 2","Staff Member 3","Appraisal Type 1","Appraisal Type2 Name","Appraisal Type3 Name","Appraisal Type4 Name","Order Priority Type Name","Created On","Date Needed","Appraiser Due Date","Inspection Date","Tracking Number","Vendor File Number","Last Updated By Staff","Date Assigned","File Reviewed On","Status","Flagged","Escalated Order","Payment Pending","Is Reconsideration Request","Accepted By Appraiser On","Appraiser Turntime (Bus. Days)","Client Turntime (Bus. Days)","Client Turntime (Cal. Days)",` +
        "\n";

      orders.forEach((item) => {
        csvData += item.client + ",\n";
      });
      return csvData;
    },

    /*
     * saves csv to local computer
     */
    exportCsv() {
      let csvContent = "data:text/csv;charset=utf-8,";
      let csvData = this.getCsvContent(this.orders);
      csvContent += csvData;

      let fileName = "Orders_Report_" + utils.getNowTimeMinString();
      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", fileName);
      link.click();
    },

    /*
     * change in sorting
     */
    onListChange() {},

    onAscendingChange() {},
  },
};
</script>
