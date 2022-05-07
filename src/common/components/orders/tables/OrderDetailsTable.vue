<template>

    <table id="order-details" class="order-table">
        <thead>
            <tr>
                <th>Order Details</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Order Type</b>
                    <span class="order__details">{{ orderDetails.orderType }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Order Type Group</b>
                    <span class="order__details">{{ orderDetails.orderTypeGroup }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Appraisal Number</b>
                    <span class="order__details">{{ orderDetails.appraisalNumber }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Turn Time</b>
                    <span class="order__details">{{ orderDetails.turnTime }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO row needs to go the whole line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Status</b>
                    <span class="order__details">{{ orderDetails.status }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Payment Status</b>
                    <span class="order__details">{{ orderDetails.paymentStatus }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Billing Method</b>
                    <span class="order__details">{{ orderDetails.billingMethod }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Client Name</b>
                    <span class="order__details">{{ orderDetails.clientName }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Client Display Name</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.clientDisplayName) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO row needs to go the whole line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Client Address</b>
                    <span class="order__details">{{ orderDetails.clientAddress }}</span>
                    <a class="order__details pointer" :href="getGoogleMapsLink(orderDetails.clientAddress)" target="_blank">( Map )</a>
                    <a class="order__details pointer" :href="getZillowLink(orderDetails.clientAddress)" target="_blank">( Zillow )</a>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Client Branch Name</b>
                    <span class="order__details">{{ orderDetails.clientBranchName }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Investor Name</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.investorName) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Loan Number</b>
                    <span class="order__details">{{ orderDetails.loanNumber }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Transaction Type</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.transactionType) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Property Appraised Before</b>
                    <span class="order__details">{{ getBoolText(orderDetails.propertyDisplayedBefore) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Loan Type</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.loanType) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>FHA Case Number</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.fhaCaseNumber) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Date Needed</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.dateNeeded) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Appraiser Due Date</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.appraiserDueDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>DU Case File ID</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.duCaseFileID) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Priority</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.priority) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Est. Client Delivery Date</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.estClientDeliveryDate) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Tracking Number</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.estClientDeliveryDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Vendor File Number</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.estClientDeliveryDate) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>AMC Reg. Number</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.estClientDeliveryDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Inspection Scheduled Date</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.inspectionScheduledDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Inspection Scheduled Time</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.inspectionScheduledTime) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Inspection Completed Date</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.inspectionCompletedDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Inspection Completed Time</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.inspectionCompletedTime) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Last Updated By Staff</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.lastUpdatedByStaffOn) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Last Updated By Vendor</b>
                    <span class="order__details">{{ getDisplayText(orderDetails.lastUpdatedByVendorOn) }}</span>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'OrderDetailsTable',
    props: {
        orderDetails: Object,
    },
    methods: {
        getGoogleMapsLink(address){
            let baseUrl = "http://maps.google.com/maps?t=k&q=";
            return baseUrl + address;
        },

        getZillowLink(address){
            let baseUrl = "https://www.zillow.com/homes/";
            return baseUrl + this.formatZillowUrl(address);
        },

        formatZillowUrl(address){
            address = address.split(' ').join('+');
            return address + "_rb";
        },
    }
}
</script>



<style scoped>

.order__details{
    padding-left: 1px;
}

</style>
