<template>

    <tr>
        <td class="order__text" VALIGN=TOP>
            <b>{{ title }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ active }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ late }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ hold }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ followUps }}</b>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>{{ completed }}</b>
        </td>
    </tr>

</template>


<script>

export default {
    name: 'OrderStatisticsRow',
    props: {
        title: String,
        active: Number,
        late: Number,
        hold: Number,
        followUps: Number,
        completed: Number,
    },
    data(){
        return{
        }
    },
    methods: {
    }
}
</script>
