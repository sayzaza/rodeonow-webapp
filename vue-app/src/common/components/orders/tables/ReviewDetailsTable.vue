<template>

    <table id="review-details" class="order-table">
        <thead>
            <tr>
                <th>Review Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Assigned to Reviewer</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.assignedToReviewer) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Assigned to Reviewer On</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.assignedToReviewerDate) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Review Fee</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.reviewFee) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Effective Date</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.effectiveDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Appraised Value</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.appraisedValue) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Property Condition</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.propertyCondition) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Quick Sale Value</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.quickSaleValue) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Report Accepted</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.reportAccepted) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Report Review Date</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.reportReviewDate) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Report Acceptable for Intended Use?</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.reportAcceptableForIntendedUse) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Business Days Turn Time/</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.businessDaysTurnTime) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Report Rating</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.reportRating) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Turn Time Rating</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.turnTimeRating) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Quality Rating</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.qualityRating) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Communication Rating</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.communicationRating) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Professionalism Rating</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.professionalismRating) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Overall Average Rating</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.overallAverageRating) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Review Comments</b>
                    <span class="order__details">{{ getDisplayText(reviewDetails.reviewComments) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'ReviewDetailsTable',
    props: {
        reviewDetails: Object,
    },
    methods: {
    }
}
</script>
