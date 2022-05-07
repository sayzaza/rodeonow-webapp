<template>

    <div>
        <table class="results-table">
            <caption>Orders Summary</caption>
            <!-- TODO include filter with today/yesterday, this week, last week, this month, last month -->
            <thead>
                <tr>
                    <th>Summary</th>
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
    name: 'OrdersSummary',
    components: {
        OrderSummaryRow,
    },
    props: {
    },
    data(){
        return{
            ordersSummary: [
                {
                    title: "Orders Created",
                    myCount: 1,
                    allCount: 141
                },
                {
                    title: "Orders Assigned",
                    myCount: 2,
                    allCount: 4689
                },
                {
                    title: "Orders Reviewed",
                    myCount: 3,
                    allCount: 104
                },
                {
                    title: "Completed Orders",
                    myCount: 4,
                    allCount: 1904
                },
                {
                    title: "Cancelled Orders",
                    myCount: 6,
                    allCount: 353
                },
                {
                    title: "Orders Activities",
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
             return this.ordersSummary;
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
