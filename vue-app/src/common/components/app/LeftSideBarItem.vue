<template>
  <li class="sidebar__item" :class="{ active: r_isActive }" ref="el">
    <router-link class="sidebar-link" :to="routerPath">
        <img :src="getIconPath()" width="20" height="20"
        class="sidebar-link__icon"
        :class="[
          isSidebarCollapsed
            ? 'sidebar-link__icon--show'
            : 'sidebar-link__icon--hide',
        ]">
      <span :src="getIconPath()" width="20" height="20"
        class="sidebar-link__text"
        :class="[
          isSidebarCollapsed
            ? 'sidebar-link__text--show'
            : 'sidebar-link__text--hide',
        ]"
        >{{ text }}</span>
  </router-link>
    <!-- <div v-show="r_addModel == true" class="hover-text">
            Labeled <br/>
            Models
        </div> -->
  </li>
</template>

<script>

export default {
  // Try to name components without sides/colors etc.
  name: "LeftSideBarItem",
  // Try to write props more detailed like isSidebarCollapsed
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      required: true,
    },
    text: String,
    isActive: Boolean,
    index: Number,
    routerPath: String,
    iconPath: String,
  },
  data() {
    return {
      r_isActive: this.isActive,
    };
  },
  methods: {
      getIconPath(){
          return '/bootstrap-icons/icons/' + this.iconPath;
      }
  },
};
</script>

<style scoped>


.sidebar__item {
  width: 100%;
  float: none;
  color: #5f6367;
}

.sidebar__item + .sidebar__item {
  border-top: 1px solid #e2e2e2;
}

.sidebar-link {
  display: flex;
  align-items: center;

  color: inherit;
  text-decoration: none;
  transition: background-color 0.15s ease;
  padding: 8px 20px;
  width: 100%;
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  /* text-transform: uppercase; */
}

.sidebar-link__icon {
  transition: margin 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-link__icon--show {
  margin-right: 10px;
}

.sidebar-link__icon--hide {
  margin-right: 0;
}

.sidebar-link__text {
  opacity: 1;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.sidebar-link__text--show {
  opacity: 1;
  width: fit-content;
  max-width: 100px;
}

.sidebar-link__text--hide {
  opacity: 0;
  max-width: 0;
}

.active > .sidebar-link,
.sidebar-link:hover,
.sidebar-link:focus {
  background-color: #dfdfdfbf;
}
/*
.side-bar-text{
  font-size: 11px;
  padding-top: 4%;
}


.link {
  color: #847f7f;
  width: 150px;
  border-bottom: 1px solid #e2e2e2;
  margin-top: 3%;
  padding-bottom: 4%;
  padding: 5px 10px;
}


.link:hover,
.link:focus {
  background-color: #dfdfdfbf;
}

.side-bar-left span{
    color: #555555;
}

.link {
    font-size: 14px;
    text-transform: uppercase;
} */
</style>
