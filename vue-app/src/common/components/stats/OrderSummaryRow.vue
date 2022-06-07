<template>

    <tr>
        <td class="order__text" VALIGN=TOP>
            <b>{{ title }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ myCount }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ allCount }}</b>
        </td>
    </tr>

</template>


<script>


export default {
    name: 'OrderSummaryRow',
    props: {
        title: String,
        myCount: Number,
        allCount: Number
    },
    data(){
        return{
        }
    },
    methods: {
    }
}
</script>
