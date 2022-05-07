<template>
  <nav class="navbar nav-bar fixed-top">
    <div class="col-sm-12">
      <div class="">
        <div class="order-header__col">
          <h5 class="order-header__text">
            Order History
          </h5>
        </div>
        <div class="order-header-split__col">
          <h5 class="order-header__split">|</h5>
        </div>
        <router-link to="/portal/order/view#order-details">
          <div class="order-header__col">
            <h5 class="order-header__text">
              Order Details
            </h5>
          </div>
        </router-link>
        <router-link to="/portal/order/view#borrower-info">
          <div class="order-header__col">
            <h5 class="order-header__text">Borrower</h5>
          </div>
        </router-link>
        <router-link to="/portal/order/view#property-info">
          <div class="order-header__col">
            <h5 class="order-header__text">Property</h5>
          </div>
        </router-link>
        <router-link to="/portal/order/view#appraisal-details">
          <div class="order-header__col">
            <h5 class="order-header__text">
              Appraisal
            </h5>
          </div>
        </router-link>
        <router-link to="/portal/order/view#vendor-info">
          <div class="order-header__col">
            <h5 class="order-header__text">Vendor</h5>
          </div>
        </router-link>
        <router-link to="/portal/order/view#review-details">
          <div class="order-header__col">
            <h5 class="order-header__text">Review</h5>
          </div>
        </router-link>
        <!-- <div class="order-header__col">
          <h5 class="order-header__text">Reports</h5>
        </div>
        <div class="order-header__col">
          <h5 class="order-header__text">AVMs</h5>
        </div>
        <div class="order-header__col">
          <h5 class="order-header__text">
            Linked Orders
          </h5>
        </div> -->
        <router-link to="/portal/order/view#documents">
            <div class="order-header__col">
              <h5 class="order-header__text">Documents</h5>
            </div>
        </router-link>
        <router-link to="/portal/order/view#comments">
            <div class="order-header__col">
              <h5 class="order-header__text">Comments</h5>
            </div>
        </router-link>
        <router-link to="/portal/order/view#notes">
            <div class="order-header__col">
              <h5 class="order-header__text">Notes</h5>
            </div>
        </router-link>
      </div>
    </div>
  </nav>
</template>


<script>
export default {
  name: "OrderNavBar",
  props: {},
  methods: {
  },
};
</script>


<style scoped>
.nav-bar {
  background-color: #2c3346;
  border-color: #e7e7e7;
  margin-left: 160px;
  min-height: 30px;
  z-index: 1 !important;
  padding: 0px 25px;
}

.order-header__col {
  float: left;
  position: relative;
  min-height: 1px;
  display: inline-block;
  padding-right: 15px;
  padding-left: 15px;
}

.order-header__text {
  color: #fff;
  cursor: pointer;
  font-size: 12px;
}

.order-header__col:hover {
  background-color: #818589;
}

.order-header__split {
  color: #fff;
  font-size: 12px;
}

.order-header-split__col {
  float: left;
  position: relative;
  min-height: 1px;
  padding-right: 2px;
  padding-left: 2px;
}
</style>
