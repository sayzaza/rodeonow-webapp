<template>

    <div>
        <table class="results-table">
            <caption>Orders with Unread Comments</caption>
            <thead>
                <tr>
                    <th>Comments Category</th>
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
    name: 'OrderUnreadComments',
    components: {
        OrderSummaryRow,
    },
    props: {
    },
    data(){
        return{
            quickStatsData: [
                {
                    title: "Client Comments (Orders)",
                    myCount: 1,
                    allCount: 141
                },
                {
                    title: "Appraiser Comments (Orders)",
                    myCount: 2,
                    allCount: 4689
                },
                {
                    title: "Reviewer Comments (Orders)",
                    myCount: 3,
                    allCount: 104
                },
                {
                    title: "Other Comments (Orders)",
                    myCount: 4,
                    allCount: 1904
                },
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
