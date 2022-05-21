<template>

    <tr>
        <!-- <td @click="downloadDocument" class="order__text pointer" VALIGN=TOP> -->
        <td class="order__text pointer" VALIGN=TOP>
            <a :href="getLink()" download="download">
                {{ documentInfo.doc_name }}
            </a>
        </td>
        <td class="order__text" VALIGN=TOP>
            {{ getDocumentType(documentInfo.doc_type) }}
        </td>
        <td class="order__text" VALIGN=TOP>
            <span v-if="documentInfo.display_name !== undefined">
                {{ "Uploaded by " + documentInfo.display_name + " on " + documentInfo.date_saved }}
            </span>
            <span v-else>
                {{ "Uploaded by " + documentInfo.first_name + ' ' + documentInfo.last_name + " on " + documentInfo.date_saved }}
            </span>
        </td>
        <td class="order__text" VALIGN=TOP>
            <label>
                <input
                    type="checkbox"
                    :checked="documentInfo.client_access"
                    @click="onShareWithClientChecked($event)"/>
                Share with Client
            </label>
            <br/>
            <label>
                <input
                    type="checkbox"
                    :checked="documentInfo.appraiser_access"
                    @click="onShareWithVendorChecked($event)"/>
                Share with Vendor
            </label>
        </td>
        <td class="order__text" VALIGN=TOP>
            View
        </td>
    </tr>

</template>


<script>

const document = require('../../../../modules/order/documents');

export default {
    name: 'DocumentRow',
    props: {
        documentInfo: Object,
    },
    data(){
        return{
        }
    },
    methods: {

        /*
         * TODO need to handle checked buttons
         */
        onShareWithClientChecked(){

        },

        onShareWithVendorChecked(){

        },


        async downloadDocument(){
            let token = this.getFirebaseToken();
            this.changeLoadingState(true);
            let results = await document.downloadDocument(token, this.documentInfo.doc_id);
            this.changeLoadingState(false);
            if(results === false){
                this.showWarnPopup('Could not download this file. Please try again.');
                return false;
            }
            this.downloadPDF(results);
        },

        /*
         * saves csv to local computer
         */
        downloadPDF(contents) {
              let csvContent = "application/pdf";
              csvContent += contents;

              const data = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", data);
              link.setAttribute("download", this.documentInfo.doc_name);
              link.click();
        },


        getLink(){
            let body = {
                docID: this.documentInfo.doc_id,
                token: this.getFirebaseToken()
            }
            let query = this.objectToQuery(body);
            //let query = "docID=" + body.docID + "&token=" & body.token;
            // console.log(window.location.protocol + "//" + window.location.host)
            return "http://localhost:3080/api/order/document/download?" + query;
        },

        objectToQuery(object){
            return Object.keys(object).map(key => key + '=' + encodeURIComponent(object[key])).join('&');
        },


        /*
         * returns text from documentType
         */
        getDocumentType(docType){
            switch (docType) {
                case 1:
                    return 'ACI Auto Upload';
                case 2:
                    return 'AIR Certification';
                case 3:
                    return 'Appraisal Report';
                case 4:
                    return 'Attached Invoice';
                case 5:
                    return 'Auto Assignment Failure Log';
                case 6:
                    return 'Borrower Acknowledgment';
                case 7:
                    return 'Borrower Delivery Report';
                case 8:
                    return 'Cashed Check';
                case 9:
                    return 'Compliance Cert';
                case 10:
                    return 'Condo/HOA Cert';
                case 11:
                    return 'Construction Budget';
                case 12:
                    return 'Construction Plans/Specs';
                case 13:
                    return 'CrossCheck Report';
                case 14:
                    return 'EAD SSR';
                case 15:
                    return 'ENV';
                case 16:
                    return 'Fannie Mae SSR';
                case 17:
                    return 'FHASSR';
                case 18:
                    return 'Flood Certificate';
                case 19:
                    return 'FNM SSR';
                case 20:
                    return 'FRE SSR';
                case 21:
                    return 'Freddie Mac SSR';
                case 22:
                    return 'Hazard Disclosure';
                case 23:
                    return 'Inspection Document';
                case 24:
                    return 'Lease';
                case 25:
                    return 'Legal Description';
                case 26:
                    return 'Non-Photo Evidence';
                case 27:
                    return 'Other';
                case 28:
                    return 'Payment';
                case 29:
                    return 'Photo Evidence';
                case 30:
                    return 'Preliminary Title Report';
                case 31:
                    return 'Property Data';
                case 32:
                    return 'Questionnaire';
                case 33:
                    return 'RealEC Readiness Check Results';
                case 34:
                    return 'RealView Report';
                case 35:
                    return 'Review Certification';
                case 36:
                    return 'Review Checklist';
                case 37:
                    return 'Sales Contract';
                case 38:
                    return 'Sky Review Report';
                case 40:
                    return 'Special Instructions';
                case 41:
                    return 'Statement of Engagement';
                case 42:
                    return 'Value Reconsideration';
                default:
                    return 'N/A';
            }
        },
    }
}
</script>
