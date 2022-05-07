<template>

    <div>
        <table class="results-table">
            <caption>Orders in Preferred Statuses</caption>
            <thead>
                <tr>
                    <th>Statuses</th>
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
    name: 'OrderPreferredStatusTable',
    components: {
        OrderSummaryRow,
    },
    props: {
    },
    data(){
        return{
            preferredStatusData: [
                {
                    title: "Waiting for payment",
                    myCount: 1,
                    allCount: 141
                },
                {
                    title: "Fee variance requested",
                    myCount: 2,
                    allCount: 4689
                },
                {
                    title: "Declined by Vendor",
                    myCount: 3,
                    allCount: 104
                },
                {
                    title: "Accepted by Vendor with Conditions",
                    myCount: 4,
                    allCount: 1904
                },
                {
                    title: "Unassigned",
                    myCount: 6,
                    allCount: 353
                },
                {
                    title: "Unassigned-LP",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Unassigned-Sebastian",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Unassigned-Nathan",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Unassigned-Vedran",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Unassigned-Matt",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Unassigned-Nicole",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Automatic Assignment Failed",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Assigned To Vendor",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Accepted By Vendor",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "On Hold",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Status Requested from Appraiser",
                    myCount: 8,
                    allCount: 952
                },
                {
                    title: "Cancellation Pending",
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
             return this.preferredStatusData;
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
