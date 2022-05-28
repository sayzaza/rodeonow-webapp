<template>

    <table id="vendor-info" class="order-table">
        <thead>
            <tr>
                <th>Vendor Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Assign to Vendor(s)</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.assignedToVendor) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Company Name</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.companyName) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Phone Number</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.phone) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Email</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.email) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Alt Phone Number</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.altPhone) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Cell Phone Number</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.cellPhone) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Assign Date</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.assignDate) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Fax Number</b>
                    <span class="order__details">{{ getDisplayText(vendorInfo.faxNumber) }}</span>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'VendorInfoTable',
    props: {
        vendorInfo: Object,
    },
    methods: {
    }
}
</script>
