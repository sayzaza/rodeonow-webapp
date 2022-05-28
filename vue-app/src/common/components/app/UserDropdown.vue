<template>

    <!-- name/settings dropdown -->
    <ul class="nav navbar-nav header-dropdown-right">
        <li class="dropdown" >
            <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                <span v-if="$store.state.isSidebarCollapsed" :class="[
                  $store.state.isSidebarCollapsed
                    ? 'sidebar-link__icon--show'
                    : 'sidebar-link__icon--hide',]">
                    <label class="dropdown-label"> {{ r_name }} </label>
                    <span class="caret"></span>
                </span>
                <span v-else :class="{ 'sidebar--full': $store.state.isSidebarCollapsed }">
                    <span class="caret"></span>
                </span>
            </a>

            <ul class="dropdown-menu">
              <li>
                  <a @click="editAccount" class="dropdown-item" href="#">
                      <img src="/bootstrap-icons/icons/person.svg" width="16" height="16">
                      Change Password
                  </a>
              </li>
              <li v-if="r_accountType !== 6">
                  <a @click="viewOrganization" class="dropdown-item" href="#">
                      <img src="/bootstrap-icons/icons/people.svg" width="16" height="16">
                      All Users
                  </a>
              </li>
              <li id="logout">
                  <a @click="logout" class="dropdown-item" href="#">
                      <img src="/bootstrap-icons/icons/box-arrow-left.svg" width="16" height="16">
                      Logout
                  </a>
              </li>
            </ul>
        </li>
    </ul>

</template>


<script>

import { getAuth, signOut } from "firebase/auth";
import router from '../../../router/index';

export default {
    name: 'UserDropdown',
    data() {
        return{
            r_name: this.getFirebaseUser().displayName,
            r_organizationName: 12, // need to get this info during login
            r_accountType: 2
        }
    },
    created(){
    },
    methods: {
        editAccount(){
            this.$router.push({
                name: 'EditAccount',
            });
        },
        viewOrganization(){
            this.$router.push({
                name: 'ViewUsers',
            });
        },
        async logout(){
            const auth = getAuth();
            signOut(auth).then(() => {
                router.push('/login');
            }).catch(() => {
              this.showWarnPopup('Could not logout. Please try again.');
            });
        }
    },
}

</script>


<style scoped>
/* TODO: change classnaming */

.header-rodeonow-logo{
    /* height: 10%;
    position: relative;
    float: left;
    bottom: -5px;
    width: 70%;
    margin-left: 15%; */

    /* for images try to use fixed height/width(read about aspect ration, vector and raster graphics) */
    width: 120px;
    height: 30px;
    float: left;
}

.nav a {
    color: white;
    font-size: 14px;
    padding: 4px 10px;
    /* text-transform: uppercase; */
    text-decoration: none;
}

.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-menu {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

.dropdown-menu a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown-menu a:hover {
    background-color: #f1f1f1;
}

.dropdown:hover .dropdown-menu {
    display: block;
}


.nav-bar {
    background-color: #2c3346;
    border-color: #E7E7E7;
    width: 100%;
    min-height: 35px;
    /* max-height: 43px; */
    z-index: 1 !important;
    padding: 5px 10px;
}

.navbar-fixed-top__inner {
    display: flex;
    align-items: center;
}

.navbar-right a{
    color: #fff;
}

nav ul {
    position: relative;
    /* top: 15px; */
}

nav li a:hover,
nav li a:focus {
    background-color: #dfdfdfbf !important;
    color: #1b505f !important;
    font-weight: 700 !important;
}

nav li a {
    font-size: 12px !important;
}

.header-dropdown-right{
    /* margin-right: auto; */
}

.dropdown-menu {
    width: 100% !important;
}

.dropdown-label {
    margin-bottom: 0;
    text-transform: uppercase;
}

::v-deep .navbar-search {
    min-height: auto;
    margin-left: 6%;
}

::v-deep .navbar-search .multiselect__select {
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    padding: 0;
    width: 30px;
    height: 100%;
}

::v-deep .navbar-search .multiselect__tags {
    font-size: 16px;
    min-height: auto;
    height: 32px;
    padding: 4px 6px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
}

::v-deep .navbar-search .multiselect__placeholder {
    font-size: 16px;
}

::v-deep .navbar-search .multiselect__input,
::v-deep .navbar-search .multiselect__placeholder,
::v-deep .navbar-search .multiselect__single {
    margin-bottom: 0;
    padding-top: 0;
    padding-left: 0;
    line-height: 1.3;
}
</style>
