<template>
  <div class="">
    <nav class="sidebar" :class="{ 'sidebar--full': isSidebarCollapsed }">
      <!-- <UserDropdown/> -->
      <SearchBar class="navbar-search" />
      <!-- TODO: try to use loop(v-for) -->
      <ul class="sidebar__list nav navbar-nav side-bar-left-ul">
        <LeftSideBarItem
            ref="order"
            text="Create Order"
            routerPath="/portal/order/new"
            :isActive="false"
            :index="1"
            :isSidebarCollapsed="isSidebarCollapsed"
            iconPath="plus-circle.svg"
            class="button-base"
        />
        <LeftSideBarItem
          ref="home"
          text="Home"
          routerPath="/portal/home"
          :isActive="false"
          :index="3"
          :isSidebarCollapsed="isSidebarCollapsed"
          iconPath="table.svg"
        />
        <LeftSideBarItem
          ref="orders"
          text="Orders"
          routerPath="/portal/orders/list"
          :isActive="false"
          :index="4"
          :isSidebarCollapsed="isSidebarCollapsed"
          iconPath="list-check.svg"
        />
        <LeftSideBarItem
          ref="reports"
          text="Reports"
          routerPath="/portal/reports"
          :index="0"
          :isSidebarCollapsed="isSidebarCollapsed"
          iconPath="card-list.svg"
        />
        <LeftSideBarItem
          ref="billing"
          text="Billing"
          routerPath="/portal/billing"
          :index="0"
          :isSidebarCollapsed="isSidebarCollapsed"
          iconPath="credit-card.svg"
        />
      </ul>
      <img
          class="sidebar__image"
          src="../../../assets/images/rodeonow-logo-white.png"
          alt="Logo Image">
      <img
        v-if="isSidebarCollapsed"
        @click="toggleSidebar"
        src="/bootstrap-icons/icons/chevron-left.svg" width="20" height="20"
          class="sidebar-link__icon"
          :class="[
            isSidebarCollapsed
              ? 'sidebar-link__icon--show'
              : 'sidebar-link__icon--hide',
          ]">
        <img
            v-else
            @click="toggleSidebar"
            src="/bootstrap-icons/icons/chevron-right.svg" width="20" height="20"
            class="sidebar-link__icon"
            :class="[
              isSidebarCollapsed
                ? 'sidebar-link__icon--show'
                : 'sidebar-link__icon--hide',
            ]">
    </nav>
  </div>
</template>

<script>

import { mapMutations, mapState } from 'vuex'

import LeftSideBarItem from "./LeftSideBarItem.vue";
import SearchBar from './SearchBar.vue'
// import UserDropdown from './UserDropdown.vue'

export default {
  name: "LeftSideBarComponents",
  components: {
    LeftSideBarItem,
    SearchBar,
    // UserDropdown
  },
  props: {
    showMenu: Boolean,
  },
  data() {
    return {
      r_showMenu: this.showMenu,
    };
  },
  computed: {
    ...mapState([
      'isSidebarCollapsed'
    ])
  },
  mounted() {
    // highlight which side bar item is active
    this.setActiveItem();
  },
  methods: {
      ...mapMutations([
          'setSidebarCollapseStatus',
      ]),

    showOptions() {
      this.r_showMenu = true;
    },

    setActiveItem() {
      let currentRoute = this.$router.currentRoute.name;

      switch (currentRoute) {
        case "PortalHome": {
          this.$refs.home.r_isActive = true;
          break;
        }
        case "OrdersList": {
          this.$refs.orders.r_isActive = true;
          break;
        }
        case "Reports": {
          this.$refs.reports.r_isActive = true;
          break;
        }
        case "Settings": {
          this.$refs.settings.r_isActive = true;
          break;
        }
      }
    },

    toggleSidebar() {
      this.setSidebarCollapseStatus(!this.isSidebarCollapsed);
    },
  },
};
</script>

<style scoped>

.sidebar {
  position: fixed;
  /* top is header height */
  top: 43px;
  left: 0;
  bottom: 0;
  width: 60px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f5f5f5;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.14), 2px 4px 8px rgba(0, 0, 0, 0.28);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar--full {
  width: 160px;
}

.sidebar__list {
  flex-grow: 1;
  float: none;
  width: 100%;
}

.sidebar-toggle {
  display: flex;
  border: none;
  background: none;
  width: 100%;
  text-align: right;
  padding: 15px 20px;
  min-width: 60px;
  outline: none;
  border-top: 1px solid #e2e2e2;
}

.sidebar-toggle--end {
  justify-content: flex-end;
}
.sidebar-toggle--start {
  justify-content: flex-start;
}

.sidebar-toggle__icon {
  color: #847f7f;
}

.sidebar__image{
    width: 90%;
    margin: auto;
    display: block;
}

/* #sidebar ul .help-menu-item {
  position: absolute;
  bottom: 20px;
}

.help-menu-item span{
    color: #555555;
}

.help-menu-item > a {
  color: #847f7f;
  width: 160px;
  border-bottom: 1px solid #e2e2e2;
  margin-top: 3%;
  padding-bottom: 4%;
  padding: 5px 10px;
}

.help-menu-item a:hover,
.help-menu-item a:focus {
  background-color: #dfdfdfbf;
}

#help-link{
  border-bottom-style: none !important;
} */
</style>
