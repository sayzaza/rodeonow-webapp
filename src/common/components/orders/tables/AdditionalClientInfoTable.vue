<template>

    <table class="order-table">
        <thead>
            <tr>
                <th>Additional Client Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Ordered By</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.orderedBy) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Ordered On</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.orderedOn) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Ordered by Phone</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.orderedByPhone) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Ordered by Email</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.orderedByEmail) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Loan Processor</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.loanProcessor) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Loan Process Contact Details</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.loanProcessorContact) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Additional Processor/Assistant</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.add1LoanProcessor) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Additional Processor/Assistant Contact Details</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.add1LoanProcessorContact) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Additional Processor/Assistant</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.add2LoanProcessor) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Additional Processor/Assistant Contact Details</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.add2LoanProcessorContact) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Additional Client Email(s)</b>
                    <span class="order__details">{{ getDisplayText(additionalClientInfo.addClientEmails) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'AdditionalClientInfoTable',
    props: {
        additionalClientInfo: Object,
    },
    methods: {

    }
}
</script>
