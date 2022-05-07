<template>

    <table id="appraisal-details" class="order-table">
        <thead>
            <tr>
                <th>Appraisal Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Appraisal Type</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.appraisalType) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Item Fee</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.itemFee) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>UAD XML Report Needed</b>
                    <span class="order__details">{{ getBoolText(appraisalDetails.uadReportNeeded) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Sales Tax Amount</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.salesTaxAmmount) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Total Order Fee</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.totalOrderFee) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <!-- TODO three lines -->
                <td class="order__text" VALIGN=TOP>
                    <b>Appraiser's Fee</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.appraisersFee) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Technology Fee</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.technologyFee) }}</span>
                </td>
                <!-- <td class="order__text" VALIGN=TOP>
                    <b>Appraiser's Net Fee</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.netAppraiserFee) }}</span>
                </td> -->
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Sales Price</b>
                    <span class="order__details">{{ getDisplayText(appraisalDetails.salesPrice) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'AppraisalDetailsTable',
    props: {
        appraisalDetails: Object,
    },
    methods: {
    }
}
</script>
