<template>

    <tr>
        <td class="order__text" VALIGN=TOP>
            <b>{{ title }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ count }}</b>
        </td>
    </tr>

</template>


<script>


export default {
    name: 'ItemsAwaitingReviewRow',
    props: {
        title: String,
        count: Number,
    },
    data(){
        return{
        }
    },
    methods: {
    }
}
</script>
