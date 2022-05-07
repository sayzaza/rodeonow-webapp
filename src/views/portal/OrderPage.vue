<template>

    <div>
        <HeaderNavBar/>
        <!-- show navbar for an order -->
        <OrderNavBar/>
        <div>
            <LeftSideBar
                :show="true"
                :firstLoad="false"
                :active="5"/>
            <div class="main-body animated bounce">
                <div>
                    <OrderTable
                        :orderID="orderID"
                        :orderInfo="orderInfo"/>
                </div>
            </div>

            <!-- active users on order -->
        </div>
        <UploadDocumentModal/>
        <CreateCommentModal
            modalName="create-comment-modal"
            headerText="Create Comment"
            :isComment="true"/>
        <CreateCommentModal
            modalName="create-internal-note-modal"
            headerText="Create Note"
            :isComment="false"/>

        <active-users />
    </div>

</template>


<script>

import { mapMutations } from 'vuex'
import { socket, startSocketIO } from '../../modules/socket-io/client'

const comment = require('../../modules/order/comment');

import HeaderNavBar from '../../common/components/app/HeaderNavBar.vue'
import LeftSideBar from '../../common/components/app/LeftSideBar.vue'
import OrderNavBar from '../../common/components/orders/OrderNavBar.vue'

import OrderTable from '../../common/components/orders/OrderTable.vue'
import UploadDocumentModal from '../../common/components/orders/modals/UploadDocumentModal.vue'
import CreateCommentModal from '../../common/components/orders/modals/CreateCommentModal.vue'

import ActiveUsers from './ActiveUsers.vue'

export default {
    name: 'OrderPage',
    components: {
        HeaderNavBar,
        LeftSideBar,
        OrderNavBar,
        OrderTable,
        UploadDocumentModal,
        CreateCommentModal,
        ActiveUsers,
    },
    props: {
        //appraisalID: Number,
        orderID: String,
        //orderInfo: Object,
    },
    data(){
        return{
            comments: [],
            internalNotes: [],
            documents: [],

            orderInfo: {
                orderDetails : {
                    orderType: 'Residential Appraisal',
                    orderTypeGroup: 'Appraisal',
                    appraisalNumber: '216-09641131',
                    turnTime: 'Active',
                    status: 'Fee variance requested',
                    paymentStatus: 'Partial Payment',
                    billingMethod: 'Invoice',
                    clientName: 'Client Name',
                    clientDisplayName: '',
                    clientAddress: '14601 Dominick Michael DR. Louisville KY 40299',
                    clientBranchName: 'Client Name (4024)',
                    investorName: '',
                    loanNumber: '24208423042',
                    transactionType: 'Refinance',
                    propertyAppraisedBefore: false,
                    loanType: 'Conventional',
                    fhaCaseNumber: '',
                    dateNeeded: '8/16/2021',
                    appraiserDueDate: '8/16/2021',
                    duCaseFileID: '',
                    priority: 'Normal',
                    estClientDeliveryDate: '',
                    trackingNumber: '',
                    amcRegNumber: 'TX 234242',
                    vendorFileNumber: '',
                    inspectionScheduledDate: '',
                    inspectionScheduledTime: '',
                    inspectionCompletedDate: '',
                    inspectionCompletedTime: '',
                    lastUpdatedByStaffOn: '8/3/2021 7:16:54 PM',
                    lastUpdatedByVendorOn: '',
                },
                borrowerInfo: {
                    name: 'Adam Roth',
                    email: 'aroth425@gmail.com',
                    phone: '123-456-7890',
                    workPhone: '',
                    cellPhone: '',
                },
                propertyInfo: {
                    propertyType: 'Manufactured Home',
                    propertyAddress: '1234 Goss Ave Louisville, KY 40204',
                    propertyCounty: 'Jefferson',
                    countyClassification: 'RUCC: 6 (Suburban - Population of 2,500 to 19,999, adjacent to a metro area)',
                    legalDescription: '',
                    occupancyType: 'Owner Occupied',
                },
                accessInfo: {
                    contactPerson: 'Borrower',
                    accessInstructions: ''
                },
                agentInfo: {
                    name: '',
                    email: '',
                    phone: '',
                    workPhone: '',
                    cellPhone: '',
                },
                appraisalDetails: {
                    appraisalType: '1004-MFH',
                    itemFee: '$1,200.00',
                    uadReportNeeded: true,
                    salesTaxAmmount: '$0.00',
                    totalOrderFee: '$1,200.00',
                    appraisersFee: '$0.00',
                    technologyFee: '$0.00',
                    netAppraiserFee: '$0.00',
                    salesPrice: '',
                },
                additionalClientInfo: {
                    orderedBy: 'AMC Appraisals',
                    orderedOn: '6/29/2021 12:58:39 PM',
                    orderedByPhone: '',
                    orderedByEmail: 'a@j.com',
                    loanProcessor: '',
                    loanProcessorContact: '',
                    add1LoanProcessor: '',
                    add1LoanProcessorContact: '',
                    add2LoanProcessor: '',
                    add2LoanProcessorContact: '',
                    addClientEmails: ''
                },
                vendorInfo: {
                    assignedToVendor: '',
                    companyName: '',
                    phone: '',
                    email: '',
                    altPhone: '',
                    cellPhone: '',
                    assignDate: '',
                    faxNumber: '',
                },
                additionalOrderDetails: {
                    rep1: '',
                    assignedOn1: '',
                    rep2: '',
                    assignedOn2: '',
                    rep3: '',
                    assignedOn3: '',
                    acceptedByVendor: '',
                    autoAssignmentAttempted: false,
                    lastAttemptedOn: '',
                    orderAutomaticAssigned: false,
                    multiTouchOrder: false,
                    orderComplete: false,
                    completionDate: '',
                    reportSentToBorrower: '',
                    sentToBorrowerOn: '',
                    downloadedByBorrower: '',
                    downloadedByBorrowerDate: '',
                    loanClosingDate: '',
                },
                reviewDetails: {
                    assignedToReviewer: '',
                    assignedToReviewerDate: '',
                    reviewFee: '',
                    effectiveDate: '',
                    appraisedValue: '',
                    propertyCondition: '',
                    quickSaleValue: '',
                    reportAccepted: '',
                    reportReviewDate: '',
                    reportAcceptableForIntendedUse: '',
                    businessDaysTurnTime: '',
                    reportRating: '',
                    turnTimeRating: '',
                    qualityRating: '',
                    communicationRating: '',
                    professionalismRating: '',
                    overallAverageRating: '',
                    reviewComments: '',
                },
            }
        }
    },
    created(){
        let appraisalID = 1; // TODO replace with real value
        this.setAppraisalID(appraisalID);
    },
    mounted(){
        this.onMount();
    },
    destroyed () {
        socket.disconnect()
        this.$store.commit('setActiveUsersOnOrder', [])
    },
    methods: {
        ...mapMutations([
            'setAppraisalID',
            'setComments',
            'setInternalNotes',
            'setOrderDocuments',
            'setActiveUsersOnOrder'
        ]),

        async onMount(){
            console.log('OrderPage onMount()')
            startSocketIO()
            this.changeLoadingState(true);
            await this.getData();
            this.changeLoadingState(false);
        },


        /* retrieves appraisal data */
        async getData(){
            let token = this.getFirebaseToken();
            let data = await comment.getAllAppraisalData(this.$store.state.appraisalID, token);
            if(data !== false){
                this.setComments(data.comments);
                this.setInternalNotes(data.internalNotes);
                this.setOrderDocuments(data.documents);
                return;
            }
        },

    }
}

</script>
