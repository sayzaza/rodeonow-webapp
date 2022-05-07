<template>

    <div style="margin-top:40px">
        <h2>Manage Order {{ orderID }}</h2>
        <OrderDetailsTable :orderDetails="orderInfo.orderDetails"/>
        <BorrowerInfoTable :borrowerInfo="orderInfo.borrowerInfo"/>
        <PropertyInfoTable :propertyInfo="orderInfo.propertyInfo"/>
        <AccessInfoTable :accessInfo="orderInfo.accessInfo"/>
        <AgentInfoTable :agentInfo="orderInfo.agentInfo"/>
        <AppraisalDetailsTable :appraisalDetails='orderInfo.appraisalDetails'/>
        <AdditionalClientInfoTable :additionalClientInfo="orderInfo.additionalClientInfo"/>
        <VendorInfoTable :vendorInfo="orderInfo.vendorInfo"/>
        <AdditionalOrderDetailsTable :additionalOrderDetails="orderInfo.additionalOrderDetails"/>
        <ReviewDetailsTable :reviewDetails="orderInfo.reviewDetails"/>

        <!-- AVM order -->

        <!-- Linked Order(s) -->

        <!-- Supporting Documents -->
        <DocumentsTable/>

        <div class="my-3 d-flex justify-content-center btn-wrapper">
            <button @click="uploadDocumentModal()" class="btn btn-primary">Upload Document</button>
        </div>

        <CommentsTable/>

        <div class="my-3 d-flex justify-content-center btn-wrapper">
            <button @click="showCommentModal()" class="btn btn-primary">Create Comment</button>
        </div>

        <!-- Notes (for internal use only) -->
        <InternalNotesTable/>

        <div class="my-3 d-flex justify-content-center btn-wrapper">
            <button @click="showInternalNoteModal()" class="btn btn-primary">Create Note</button>
        </div>
    </div>

</template>


<script>

import OrderDetailsTable from './tables/OrderDetailsTable.vue'
import BorrowerInfoTable from './tables/BorrowerInfoTable.vue'
import PropertyInfoTable from './tables/PropertyInfoTable.vue'
import AccessInfoTable from './tables/AccessInfoTable.vue'
import AgentInfoTable from './tables/AgentInfoTable.vue'
import AppraisalDetailsTable from './tables/AppraisalDetailsTable.vue'
import AdditionalClientInfoTable from './tables/AdditionalClientInfoTable.vue'
import VendorInfoTable from './tables/VendorInfoTable.vue'
import AdditionalOrderDetailsTable from './tables/AdditionalOrderDetailsTable.vue'
import ReviewDetailsTable from './tables/ReviewDetailsTable.vue'
import CommentsTable from './tables/CommentsTable.vue'
import DocumentsTable from './tables/DocumentsTable.vue'
import InternalNotesTable from './tables/InternalNotesTable.vue'

export default {
    name: 'OrderTable',
    components: {
        OrderDetailsTable,
        BorrowerInfoTable,
        PropertyInfoTable,
        AccessInfoTable,
        AgentInfoTable,
        AppraisalDetailsTable,
        AdditionalClientInfoTable,
        VendorInfoTable,
        AdditionalOrderDetailsTable,
        ReviewDetailsTable,
        DocumentsTable,
        CommentsTable,
        InternalNotesTable
    },
    props: {
        orderID: String,
        orderInfo: Object,
    },
    methods: {

        showCommentModal(){
            this.$modal.show('create-comment-modal');
        },

        showInternalNoteModal(){
            this.$modal.show('create-internal-note-modal');
        },

        uploadDocumentModal(){
            this.$modal.show('upload-document-modal');
        },
    }
}
</script>

<style scoped>
.btn-wrapper .btn {
    min-width: 10rem;
}
</style>