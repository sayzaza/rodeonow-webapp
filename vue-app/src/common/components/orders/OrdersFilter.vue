<template>

    <div>
        <div class="col-md col-md-12">
            <div class="row">
                <div class="col-md col-md-3">
                    Keyword
                    <input
                        v-model="r_keyword"
                        @change="onKeywordChange"
                        placeholder="Keyword"
                        type="text"
                        class="form-control">
                </div>
                <div class="col-md col-md-3">
                    Order Type Group
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Order Type
                    <select @change="onOrderTypeSelect($event)" class="form-control">
                        <option selected="selected" value="-1">All</option>
                        <option value="1">Residential Appraisal</option>
                        <option value="2">Commercial Appraisal</option>
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Priority
                    <select @change="onPrioritySelect($event)" class="form-control">
                        <option selected="selected" value="-1">All</option>
                        <option value="1">Normal</option>
                        <option value="2">Rush</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md col-md-3">
                    State
                    <StateSelect :onChangeCallback="onStateChange"/>
                </div>
                <div class="col-md col-md-3">
                    Client
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Branch
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Wholesale Lendor
                    <select class="form-control">
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md col-md-3">
                    Vendor
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Reviewer
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Staff User
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Product
                    <select class="form-control">
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md col-md-3">
                    Order Status
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Transaction Type
                    <select class="form-control">
                    </select>
                </div>
                <div class="col-md col-md-3">
                    Created Date From
                    <input
                        type="text"
                        class="form-control">
                </div>
                <div class="col-md col-md-3">
                    Created Date To
                    <input
                        type="text"
                        class="form-control">
                </div>
            </div>
            <div class="row">
                <div class="col-md col-md-3">
                    Client Due Date From
                    <input
                        type="text"
                        class="form-control">
                </div>
                <div class="col-md col-md-3">
                    Client Due Date To
                    <input
                        type="text"
                        class="form-control">
                </div>
                <div class="col-md col-md-3">
                    Vendor Due Date From
                    <input
                        type="text"
                        class="form-control">
                </div>
                <div class="col-md col-md-3">
                    Vendor Due Date To
                    <input
                        type="text"
                        class="form-control">
                </div>
            </div>
            <div class="row">
                <div class="col-md col-md-3">
                    <input @click="onClickInternalRequests($event)" type="checkbox">
                    Only Show Internal Requests
                </div>
                <div class="col-md col-md-3">
                    <input @click="onClickClientRequests($event)" type="checkbox">
                    Only Show Client Requests
                </div>
                <div class="col-md col-md-3">
                    <input @click="onClickFlaggedItems($event)" type="checkbox">
                    Only Show Flagged Items
                </div>
                <div class="col-md col-md-3">
                    <input @click="onClickEscalatedOrders($event)" type="checkbox">
                    Only Show Escalated Orders
                </div>
            </div>
            <div class="row">
                <div class="col-md col-md-2">
                    _
                    <button
                        @click="filterOrders()"
                        class="form-control">
                        Filter Orders
                    </button>
                </div>
                <div class="col-md col-md-2">
                    _
                    <button
                        @click="resetFilter()"
                        class="form-control">
                        Reset Filter
                    </button>
                </div>
                <div class="col-md col-md-2">
                    Records per Page
                    <select @change="onChangeRecordsPerPage($event)" class="form-control">
                        <option selected="selected" value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

</template>


<script>

import StateSelect from './select/StateSelect.vue'

export default {
    name: 'OrderFilter',
    components: {
        StateSelect,
    },
    props: {
    },
    data(){
        return{
            r_internalRequestsChecked: false,
            r_clientRequestsChecked: false,
            r_flaggedItemsChecked: false,
            r_escalatedOrdersChecked: false,

            r_keyword: "",
            r_orderType: "",
            r_priority: "",
            r_state: "",
        }
    },
    created(){
        // this.onCreate();
    },
    destroyed(){
        // this.unsubscribe();
    },
    methods: {

        /*
         * checkboxes for filtering
         */
        onClickInternalRequests(event){
            this.r_internalRequestsChecked = event.target.checked;
        },
        onClickClientRequests(event){
            this.r_clientRequestsChecked = event.target.checked;
        },
        onClickFlaggedItems(event){
            this.r_flaggedItemsChecked = event.target.checked;
        },
        onClickEscalatedOrders(event){
            this.r_escalatedOrdersChecked = event.target.checked;
        },

        /* number of records to show per pagination */
        onChangeRecordsPerPage(event){
            this.r_recordsPerPage = event.target.value;
            console.log(this.r_recordsPerPage)
        },


        onKeywordChange(event){
            this.r_keyword = event.target.value;
        },

        onOrderTypeSelect(event){
            this.r_orderType = event.target.value;
        },

        onPrioritySelect(event){
            this.r_prioritySelect = event.target.value;
        },

        onStateChange(option){
            this.r_state = option.value;
        },


        /*
         * apply filters and return orders
         */
        filterOrders(){

        },


        /*
         * reset filter back to empty
         */
        resetFilter(){

        },
    }
}
</script>


<style scoped>

</style>
