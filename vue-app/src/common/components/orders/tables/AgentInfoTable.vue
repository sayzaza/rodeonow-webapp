<template>

    <table class="order-table">
        <thead>
            <tr>
                <th>Agent Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Agent Name</b>
                    <span class="order__details">{{ getDisplayText(agentInfo.name) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Agent Email</b>
                    <span class="order__details">{{ getDisplayText(agentInfo.email) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Agent Phone</b>
                    <span class="order__details">{{ getDisplayText(agentInfo.phone) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Agent Work Phone</b>
                    <span class="order__details">{{ getDisplayText(agentInfo.workPhone) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Agent Cell Phone</b>
                    <span class="order__details">{{ getDisplayText(agentInfo.cellPhone) }}</span>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'AgentInfoTable',
    props: {
        agentInfo: Object,
    },
    methods: {
    }
}
</script>
