// import { createStore } from "vuex";

// const orders = new Array(56).fill('a').map((_, index) => ({
//   orderID: `${index + 1}`,
//   address: '110 N. Grand Ave Miami FL 33132',
//   county: 'Miami-FL',
//   type: 'Residential Appraisal',
//   txnType: 'Purchase',
//   loanNum: '32395704506360',
//   borrower: 'Jake Smith & Nancy Smith',

//   client: 'Nations Lending Corporation*',
//   orderedBy: 'AMC Appraisals',
//   branchName: 'Nations Lending Corporation (3232)',

//   vendor: '',
//   staff: '',

//   ordered: '6/9/2021 12:32:02 PM',
//   due: '8/6/2021',
//   assigned: 'N/A',
//   vendorDue: '8/4/2021',
//   insp: 'N/A',
//   reviewedOn: 'N/A',
//   lastUpdated: '7/28/2021 9:01:13 AM',
//   statusLastUpdated: '7/26/2021 1:21:15 AM',
//   daysOpen: '35.0',

//   items: '1004C-MFH FHA 1 to 4.99 acres',

//   status: 'Unassigned-Vedran',

//   flagged: false
// }))

// // https://medium.com/codingthesmartway-com-blog/vue-js-2-state-management-with-vuex-introduction-db26cb495113

// const state = {
//     appIsLoaded: false, // indicator for first time app is loaded
//     startTime: 0, // begin time to get data for chart
//     endTime: 0, // end time to get data for chart
//     isLoading: true, // pageload indicator is active
//     activePage: 5, // current app page that is showing
//     isSidebarCollapsed: true, // if sidebar is minimized

//   fullName: '',
//   organizationName: '',

//     orders:[],
//     appraisalID: 0,
//     orderComments: [],
//     orderInternalNotes: [],
//     orderDocuments: [],
//     activeUsersOnOrder: []
// }

// const getters = {
//     startTime: state => state.startTime,
//     endTime: state => state.endTime,
//     isLoading: state => state.isLoading,
//     isSidebarCollapsed: state => state.isSidebarCollapsed,

//   fullName: state => state.fullName,
//   organizationName: state => state.organizationName,

//   appraisalID: state => state.appraisalID,
//   orderComments: state => state.orderComments,
//   orderInternalNotes: state => state.orderInternalNotes,
//   orderDocuments: state => state.orderDocuments
// }

// const mutations = {
//     /*
//      * update timestamps
//      */
//      updateDate(state, dates){
//          let startTime = dates.StartDate;
//          let endTime = dates.EndDate;
//          if(startTime === undefined)
//             state.startTime = 0;
//          else
//             state.startTime = startTime;

//         if(endTime !== undefined)
//            state.endTime = endTime;
//      },

//     /*
//      * update the loading indicator state
//      */
//     updateLoadingState(state, isLoading){
//         state.isLoading = isLoading;
//     },

//     /*
//      * update status indicating that app has loaded
//      */
//     setAppIsLoaded(){
//         state.appIsLoaded = true;
//     },

//     /* sets status of if sidebar is collapsed or not */
//     setSidebarCollapseStatus(state, collapsed){
//         state.isSidebarCollapsed = collapsed;
//     },

//     /*
//      * updates the active page we're on
//      */
//     updateActivePage(state, activePage){
//         state.activePage = activePage;
//     },

//     /* used to open edit user modal w/ new user info*/
//     showEditUserModal(){},

//     /* set appraisalID */
//     setAppraisalID(state, appraisalID){
//         state.appraisalID = appraisalID;
//     },

//     /* adds comment to the array order comments */
//     addComment(state, comment){
//         state.orderComments.unshift(comment);
//     },
//     /* clears comments array */
//     emptyComments(state){
//         state.orderComments.clear();
//     },
//     /* sets new value (usually when loading all comments) */
//     setComments(state, comments){
//         state.orderComments = comments;
//     },

//     /* adds internal note to the array order internal notes */
//     addInternalNote(state, internalNote){
//         state.orderInternalNotes.unshift(internalNote);
//     },
//     /* clears internal notes array */
//     emptyInternalNotes(state){
//         state.orderInternalNotes.clear();
//     },
//     /* sets new value (usually when loading all internal notes) */
//     setInternalNotes(state, internalNotes){
//         state.orderInternalNotes = internalNotes;
//     },

//     /* adds order documents to the array order documents */
//     addOrderDocument(state, documents){
//         state.orderDocuments.unshift(documents);
//     },
//     /* clears order documents array */
//     emptyOrderDocuments(state){
//         state.orderDocuments.clear();
//     },
//     /* sets new value (usually when loading all order documents) */
//     setOrderDocuments(state, documents){
//         state.orderDocuments = documents;
//     },
//     /* set active users on order */
//     setActiveUsersOnOrder(state, users) {
//         state.activeUsersOnOrder = users
//     }
// }

// const actions = {
//   async fetchOrders (_, { offset, limit }) {
//     // return orders.slice(offset, offset + limit)
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(orders.slice(offset, offset + limit))
//       }, 3000)
//     })
//   }
// }

// export default createStore({
//   state,
//   getters,
//   mutations,
//   actions
// });

import { createStore } from "vuex";

import { SpinnerGetters } from "./spinner/getters";
import { SpinnerMutations } from "./spinner/mutations";
import { SpinnerActions } from "./spinner/actions";

import { AlertGetters } from "./alert/getters";
import {AlertMutations } from "./alert/mutations";
import { AlertActions } from "./alert/actions";

const store = createStore({
  state: {
    showSpinner:false,
    showAlert:false,
    alertText:"",
    alertType:""
  },
  getters: {
    ...SpinnerGetters,
    ...AlertGetters,
  },
  mutations: {
    ...SpinnerMutations,
    ...AlertMutations,
  },
  actions: {
    ...SpinnerActions,
    ...AlertActions,
  },
});

export default store;

