<template>

    <table class="order-table">
        <thead>
            <tr>
                <th>Access Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Contact Person</b>
                    <span class="order__details">{{ getDisplayText(accessInfo.contactPerson) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Property Access Instructions</b>
                    <span class="order__details">{{ getDisplayText(accessInfo.accessInstructions) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'AccessInfoTable',
    props: {
        accessInfo: Object,
    },
    methods: {
    }
}
</script>
