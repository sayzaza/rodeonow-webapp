<template>

    <table class="order-table">
        <thead>
            <tr>
                <th>Additional Order Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Account Representative 1</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.rep1) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Assigned On</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.assignedOn1) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Account Representative 2</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.rep2) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Assigned On</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.assignedOn2) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Account Representative 3</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.rep3) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Assigned On</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.assignedOn3) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Accepted by Vendor</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.acceptedByVendor) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Auto Assignment Attempted</b>
                    <span class="order__details">{{ getBoolText(additionalOrderDetails.autoAssignmentAttempted) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Last Attempted On</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.lastAttemptedOn) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Order Automatic Assigned?</b>
                    <span class="order__details">{{ getBoolText(additionalOrderDetails.orderAutomaticAssigned) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Multi-Touch Order/</b>
                    <span class="order__details">{{ getBoolText(additionalOrderDetails.multiTouchOrder) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Order Complete?</b>
                    <span class="order__details">{{ getBoolText(additionalOrderDetails.orderComplete) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Completion Date</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.completionDate) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Report Sent to Borrower?</b>
                    <span class="order__details">{{ getBoolText(additionalOrderDetails.reportSentToBorrower) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Sent to Borrow On</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.sentToBorrowerOn) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Downloaded by Borrower</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.downloadedByBorrower) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Downloaded by Borrower On</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.downloadedByBorrowerDate) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Loan Closing Date</b>
                    <span class="order__details">{{ getDisplayText(additionalOrderDetails.loanClosingDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'AdditionalOrderDetailsTable',
    props: {
        additionalOrderDetails: Object,
    },
    methods: {
    }
}
</script>
