<template>

    <div>
        <table class="results-table">
            <caption>Quick Stats</caption>
            <thead>
                <tr>
                    <th>Stats</th>
                    <th>My</th>
                    <th>All</th>
                </tr>
            </thead>
            <tbody>
                <OrderSummaryRow
                    v-for="(summaryRow, index) in filterData"
                    :key="index"
                    :title="summaryRow.title"
                    :myCount="summaryRow.myCount"
                    :allCount="summaryRow.allCount"/>

            </tbody>
        </table>
    </div>

</template>


<script>

import OrderSummaryRow from './OrderSummaryRow.vue'

export default {
    name: 'OrderSummary',
    components: {
        OrderSummaryRow,
    },
    props: {
    },
    data(){
        return{
            quickStatsData: [
                {
                    title: "Open Orders",
                    myCount: 1,
                    allCount: 141
                },
                {
                    title: "Due Today To Clients",
                    myCount: 2,
                    allCount: 4689
                },
                {
                    title: "Due Today From Appraisers",
                    myCount: 3,
                    allCount: 104
                },
                {
                    title: "Past Due - Client Due Date",
                    myCount: 4,
                    allCount: 1904
                },
                {
                    title: "Past Due - Appraiser Due Date",
                    myCount: 6,
                    allCount: 353
                },
                {
                    title: "Rush Orders",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Active Revision Requests - Internal",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Active Revision Requests - Client",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Open Quote Request",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Flagged Orders",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Escalated Orders",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Follow Up Orders",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Active Reminders",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Pending Payment Orders",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Orders with paused Turn-time",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "UCDP - High Risk Orders",
                    myCount: 8,
                    allCount: 952
                }
            ]
        }
    },
    computed: {
        /*
         * filtered orders based upon sorting
         */
         filterData: function(){
             return this.quickStatsData;
         },
    },
    created(){
        // this.onCreate();
    },
    destroyed(){
        // this.unsubscribe();
    },
    methods: {
        /*
         * function to handle on create handling
         */
        async onCreate(){
        },


        /*
         * change in sorting
         */
        onListChange(){

        },
    }
}
</script>
