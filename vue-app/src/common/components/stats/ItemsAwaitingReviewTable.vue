<template>

    <div>
        <table class="results-table">
            <caption>Items Awaiting Review</caption>
            <thead>
                <tr>
                    <!-- <th>Items Awaiting Review</th> -->
                </tr>
            </thead>
            <tbody>
                <ItemsAwaitingReviewRow
                    v-for="(row, index) in filterData"
                    :key="index"
                    :title="row.title"
                    :count="row.count"/>

            </tbody>
        </table>
    </div>

</template>


<script>

import ItemsAwaitingReviewRow from './ItemsAwaitingReviewRow.vue'

export default {
    name: 'ItemsAwaitingReviewTable',
    components: {
        ItemsAwaitingReviewRow,
    },
    props: {
    },
    data(){
        return{
            itemsAwaitingReviewData: [
                {
                    title: "Waiting for payment",
                    count: 1,
                },
                {
                    title: "Fee variance requested",
                    count: 2,
                },
                {
                    title: "Declined by Vendor",
                    count: 3,
                },
                {
                    title: "Accepted by Vendor with Conditions",
                    count: 4,
                },
            ]
        }
    },
    computed: {
        /*
         * items awaiting review data based upon sorting
         */
         filterData: function(){
             return this.itemsAwaitingReviewData;
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
