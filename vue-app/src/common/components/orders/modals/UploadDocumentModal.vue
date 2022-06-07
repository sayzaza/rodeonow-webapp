<template>

    <modal
        :draggable="true"
        :resizable="false"
        height="fit-content"
        :width="500"
        name="upload-document-modal"
        class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <h3 class="modal-title" style="text-align: center;">Upload Document</h3>
                <button @click="closeModal" type="button" class="close">&times;</button>
            </div>
            <div class="modal-body">

                <div class="mb-3">
                    <input
                        type="file"
                        class="file_input"
                        @change="previewFiles"
                        placeholder="Attachment"
                        autocomplete="off">
                </div>

                <div class="mb-3">
                    <DocumentTypeSelect :onChangeCallback="onDocumentTypeSelect"/>
                </div>

                <div class="mb-3">
                    <label>
                        <input @click="onShareWithClientChecked($event)" type="checkbox"/>
                        Share with Client
                    </label>
                </div>
                <div class="mb-3">
                    <label>
                        <input @click="onShareWithVendorChecked($event)" type="checkbox"/>
                        Share with Vendor
                    </label>
                </div>

            </div>
            <div class="modal-footer">
                <button @click="uploadDocument()" class="btn btn-primary w-100">Upload</button>
            </div>
        </div>
    </modal>

</template>


<script>

import { mapMutations } from 'vuex'

const documents = require('../../../../modules/order/documents');
const utils = require('../../../../modules/utils/time');

import DocumentTypeSelect from '../select/DocumentTypeSelect';

export default {
    name: 'UploadDocumentModal',
    components: {
        DocumentTypeSelect
    },
    props: {
    },
    data() {
        return {
            fileName: '',
            file: undefined,
            documentType: 0,
            userAccess: 0,
            r_shareWithClientChecked: false,
            r_shareWithVendorChecked: false,
        }
    },
    created(){
    },
    methods: {
        ...mapMutations([
            'addOrderDocument',
        ]),


        /*
         * selects file input from computer
         */
         previewFiles(event){
             const files = event.target.files;
             const fileReader = new FileReader()
             fileReader.addEventListener('load', () => {
                 this.imageUrl = fileReader.result
             })
             fileReader.readAsDataURL(files[0]);
             this.file = files[0];
             this.fileName = files[0].name;
         },


        /*
         * closes modal
         */
        closeModal(){
            this.$modal.hide('upload-document-modal');
            this.fileName = '';
            this.file = undefined;
            this.documentType = 0;
            this.userAccess = 0;
            this.r_shareWithClientChecked = false;
            this.r_shareWithVendorChecked = false;
        },

        /*
         * upload document
         */
        async uploadDocument(){
            if(this.documentType === 0){
                this.showWarnPopup('Please select a document type.');
                return false;
            }

            // attachment must be included
            if(this.file === undefined){
                this.showWarnPopup('Please select a file to upload.');
                return false;
            }

            let body = {
                token: this.getFirebaseToken(),
                appraisalID: this.$store.state.appraisalID,
                fileName: this.fileName,
                file: this.file,
                documentType: this.documentType,
                appraiserAccess: this.r_shareWithVendorChecked,
                clientAccess: this.r_shareWithClientChecked
            }

            this.changeLoadingState(true);
            let results = await documents.uploadDocument(body);
            this.changeLoadingState(false);
            if(results === false){
                this.showWarnPopup('Could not upload file. Please try again.');
                return false;
            }

            // add documentID and return results
            let createDocumentData = {
                doc_id: results.contents,
                appraisalID: body.appraisalID,
                file: undefined,
                doc_name: body.fileName,
                doc_type: body.documentType,
                appraiser_access: body.appraiserAccess,
                client_access: body.clientAccess,
                display_name: this.getCurrentUser().displayName,
                date_saved: utils.getNowTimeString(),
            }
            this.showSuccessPopup('File successfully uploaded.');
            this.addOrderDocument(createDocumentData);
            this.closeModal();
        },


        /*
         * selected document type
         */
        onDocumentTypeSelect(type){
            this.documentType = type.value;
        },


        /*
         * share checkboxes
         */
        onShareWithClientChecked(event){
             this.r_shareWithClientChecked = event.target.checked;
        },
        onShareWithVendorChecked(event){
             this.r_shareWithVendorChecked = event.target.checked;
        },
    }
 }

</script>


<style scoped>

.modal-dialog{
    position: fixed;
    left: 0;
    top: 100px;
}
/* MODAL STYLING */
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-header{
  padding-bottom: 10px;
  border-bottom: 2px solid #484848;
}

.modal-header button {
    position: absolute;
    right: 1rem;
}

.modal label {
  display: block;
}
.modal-body{
    margin-bottom: 2%;
}

.vm--modal {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    background-color: white;
    border-radius: 3px;
    box-shadow: 0 20px 60px -2px rgba(27, 33, 58, 0.4);
    top: 159px;
    left: 434px;
    width: 600px;
    min-width: 600px !important;
    max-width: 600px !important;
    /* height: 500px !important; */
    /* min-height: 500px !important; */
    /* max-height: 600px !important; */
}
/* overwrites modal class that blocks background */
.vm--overlay{
    position: fixed !important;
    box-sizing: border-box !important;
    left: 0 !important;
    top: 0 !important;
    width: 0% !important;
    height: 0 !important;
    background: none !important;
    opacity: 0 !important;
}
</style>
