<template>

    <div>
        <table class="results-table">
            <caption>Order Statistics</caption>
            <thead>
                <tr>
                    <th>Clients/Branches</th>
                    <th>Active</th>
                    <th>Late</th>
                    <th>Hold</th>
                    <th>Follow Ups</th>
                    <th>Completed</th>
                </tr>
            </thead>
            <tbody>
                <OrderStatisticsRow
                    v-for="(summaryRow, index) in filterData"
                    :key="index"
                    :title="summaryRow.title"
                    :active="summaryRow.active"
                    :late="summaryRow.late"
                    :hold="summaryRow.hold"
                    :followUps="summaryRow.followUps"
                    :completed="summaryRow.completed"/>

            </tbody>
        </table>
    </div>

</template>


<script>

import OrderStatisticsRow from './OrderStatisticsRow.vue'

export default {
    name: 'OrderStatisticsTable',
    components: {
        OrderStatisticsRow,
    },
    props: {
    },
    data(){
        return{
            orderStatsData: [
                {
                    title: "Branch 3",
                    active: 93829,
                    late: 235,
                    hold: 52,
                    followUps: 14,
                    completed: 149892,
                },
                {
                    title: "Branch 1",
                    active: 1,
                    late: 141,
                    hold: 824,
                    followUps: 53,
                    completed: 142,
                },
                {
                    title: "Branch 2",
                    active: 3,
                    late: 24,
                    hold: 47,
                    followUps: 3,
                    completed: 98,
                }
            ]
        }
    },
    computed: {
        /*
         * filtered orders based upon sorting
         */
         filterData: function(){
             return this.orderStatsData;
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
