<template>

    <tr>
        <td class="order__text" VALIGN=TOP>
            <div class="col-md col-md-12">
                <div @click="onOrderClick(orderRow.orderID)" class="row pointer order_id__text">
                    <span>{{ orderRow.orderID }}</span>
                    &nbsp;
                    <img class="pointer" src="/bootstrap-icons/icons/box-arrow-up-right.svg" width="20" height="20">
                </div>
            </div>
            {{ orderRow.address }}<br/>
            <b>County: </b>{{ orderRow.county }}<br/>
            <b>Type: </b>{{ orderRow.type }}<br/>
            <b>TXN Type: </b>{{ orderRow.txnType }}<br/>
            <b>Loan #: </b>{{ orderRow.loanNum }}<br/>
            <b>Borrower(s): </b>{{ orderRow.borrower }}<br/>
        </td>
        <td class="order__text" VALIGN=TOP>
            {{ orderRow.client }}<br/>
            <b>Ordered By: </b>{{ orderRow.orderedBy }}<br/>
            <b>Branch Name: </b>{{ orderRow.branchName }}<br/>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>Vendor: </b>{{ orderRow.vendor }}<br/>
            <span v-if="orderRow.staff != ''">
                <b>Staff: </b>{{ orderRow.staff }}<br/>
            </span>
        </td>
        <td class="order__text" VALIGN=TOP>
            <b>Ordered: </b>{{ orderRow.ordered }}<br/>
            <b>Due: </b>{{ orderRow.due }}<br/>
            <b>Assigned: </b>{{ orderRow.assigned }}<br/>
            <b>Vendor Due #: </b>{{ orderRow.vendorDue }}<br/>
            <b>Insp: </b>{{ orderRow.insp }}<br/>
            <b>Reviewed On: </b>{{ orderRow.reviewedOn }}<br/>
            <b>Last Updated: </b>{{ orderRow.lastUpdated }}<br/>
            <b>Status Last Updated: </b>{{ orderRow.statusLastUpdated }}<br/>
            <b>Days Open: </b>{{ orderRow.daysOpen }}<br/>
        </td>
        <td class="order__text" VALIGN=TOP>
            {{ orderRow.items }}
        </td>
        <td class="order__text" VALIGN=TOP>
            {{ orderRow.status }}<br/>
        </td>
        <td VALIGN=TOP>
            <span v-if="orderRow.flagged" class="flag__checked">
                <img class="pointer" src="/bootstrap-icons/icons/flag-fill.svg" width="20" height="20">
            </span>
            <span v-else class="flag__unchecked">
                <img class="pointer" src="/bootstrap-icons/icons/flag.svg" width="20" height="20">
            </span>
        </td>
    </tr>

</template>


<script>

export default {
    name: 'OrdersTableRow',
    props: {
        orderRow: Object,
    },
    data(){
        return{
        }
    },
    methods: {

        /*
         * click on order
         */
        onOrderClick(orderID){
            this.$router.push({
                name: 'OrderPage',
                params: {
                    orderID: orderID,
                    orderInfo: this.orderRow
                }
            });
        },
    }
}
</script>


<style scoped>

.pre-formatted {
  white-space: pre;
}

.order_id__text{
    color: #4169E1;
    font-weight: 700;
}

.order__text{
    font-size: 12px;
    color: #5f6367;
}

.flag__checked{
    color: #D70040;
    font-size: 18px;
}

.flag__unchecked{
    color: #5f6367;
    font-size: 18px;
}

.pointer {
    cursor: pointer;
}

</style>
