<template>

    <!-- <nav class="navbar nav-bar fixed-top"> -->
    <nav class="sidebar navbar nav-bar fixed-top" :class="{ 'sidebar--full': $store.state.isSidebarCollapsed }">
        <div class="navbar-fixed-top__inner">
            <!-- name/settings dropdown -->
            <UserDropdown/>
        </div>
        <MOPopup/>
        <LoadingIndicator/>
    </nav>

</template>


<script>
import MOPopup from './MOPopup.vue'
import UserDropdown from './UserDropdown.vue'
import LoadingIndicator from './LoadingIndicator.vue';

export default {
    name: 'HeaderNavBar',
    components:{
        MOPopup,
        UserDropdown,
        LoadingIndicator
    },
}

</script>


<style  scoped>
/* TODO: change classnaming */

.header-rodeonow-logo{
    /* height: 10%;
    position: relative;
    float: left;
    bottom: -5px;
    width: 70%;
    margin-left: 15%; */

    /* for images try to use fixed height/width(read about aspect ration, vector and raster graphics) */
    width: 33px;
    /* height: 30px; */
    float: left;
}

.nav a {
    color: white;
    font-size: 14px;
    padding: 4px 10px;
    text-transform: uppercase;
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
    width: 60px;
    min-height: 42px;
    /* max-height: 43px; */
    z-index: 1 !important;
    padding: 5px 5px;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar--full {
    width: 160px;
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
    /* margin-left: auto; */
}

.dropdown-menu {
    width: 100% !important;
}

.dropdown-label {
    margin-bottom: 0;
}

:deep .navbar-search {
    min-height: auto;
    margin-left: 6%;
}

:deep .navbar-search .multiselect__select {
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    padding: 0;
    width: 30px;
    height: 100%;
}

:deep .navbar-search .multiselect__tags {
    font-size: 16px;
    min-height: auto;
    height: 32px;
    padding: 4px 6px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
}

:deep .navbar-search .multiselect__placeholder {
    font-size: 16px;
}

:deep .navbar-search .multiselect__input,
:deep .navbar-search .multiselect__placeholder,
:deep .navbar-search .multiselect__single {
    margin-bottom: 0;
    padding-top: 0;
    padding-left: 0;
    line-height: 1.3;
}
</style>
