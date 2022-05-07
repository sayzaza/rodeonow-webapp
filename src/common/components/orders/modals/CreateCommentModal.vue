<template>

    <modal
        :draggable="true"
        :resizable="false"
        height="fit-content"
        :width="500"
        :name="modalName"
        class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header flex justify-content-center">
                <h3 class="modal-title" style="text-align: center;">{{ headerText }}</h3>
                <button @click="closeModal" type="button" class="close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <textarea
                        v-model="r_commentText"
                        class="form-control"
                        autocomplete="off"
                        placeholder="Message"
                        rows="4"
                    >
                    </textarea>
                </div>

                <div class="mb-3">
                    <CommentLabelSelect/>
                </div>

                <button @click="createComment()" class="btn btn-primary w-100">Create</button>
            </div>
        </div>
    </modal>

</template>


<script>

import { mapMutations } from 'vuex'

const comment = require('../../../../modules/order/comment');
const utils = require('../../../../modules/utils/time');

import CommentLabelSelect from '../select/CommentLabelSelect.vue';

export default {
    name: 'CreateCommentModal',
    components: {
        CommentLabelSelect
    },
    props: {
        headerText: String,
        modalName: String,
        isComment: Boolean, // comment vs internal note
    },
    data() {
        return {
            r_commentText: '',
            r_labelID: 1,
            r_clientAccess: true,
            r_appraiserAccess: true,
            r_isRead: true,
        }
    },
    created(){
    },
    methods: {
        ...mapMutations([
            'addComment',
            'addInternalNote',
        ]),

        /*
         * closes modal
         */
        closeModal(){
            this.$modal.hide(this.modalName);
            this.r_commentText = '';
            this.r_labelID = 0;
            this.r_clientAccess = false;
            this.r_appraiserAccess = false;
            this.r_isRead = false;
        },

        /*
         * save comment in database
         */
        async createComment(){
            if(!this.isComment){
                return this.saveInternalNote();
            }

            let commentInfo = {
                appraisalID: this.$store.state.appraisalID,
                commentText: this.r_commentText,
                labelID: this.r_labelID,
                clientAccess: this.r_clientAccess,
                appraiserAccess: this.r_appraiserAccess,
                isRead: this.r_isRead,
                token: this.getFirebaseToken()
            }

            this.changeLoadingState(true);
            let results = await comment.createComment(commentInfo);
            this.changeLoadingState(false);
            if(results.valid === false){ // frontend formatting error
                //this.showWarnPopup(results.message);
                return false;
            }

            // request error
            if(results === false){
                //this.showWarnPopup("Could not create new comment. Please try again.");
                return false;
            }

            let resultsJson = JSON.parse(results);
            if(resultsJson.code === 0){
                // add commentID and return results
                let createCommentData = {
                    comment_id: resultsJson.contents,
                    appraisalID: commentInfo.appraisalID,
                    comment_text: commentInfo.commentText,
                    label_id: commentInfo.labelID,
                    client_access: commentInfo.clientAccess,
                    appraiser_access: commentInfo.appraiserAccess,
                    is_read: commentInfo.isRead,
                    display_name: this.getCurrentUser().displayName,
                    date_created: utils.getNowTimeString(),
                }
                this.showSuccessPopup("Successfully created new comment.");
                this.addComment(createCommentData);
                this.closeModal();
            } else {
                //this.showWarnPopup("Could not create new comment. Please try again.");
                return false;
            }
        },


        /*
         * svae as internal note
         */
        async saveInternalNote(){
            let noteInfo = {
                appraisalID: this.$store.state.appraisalID,
                noteText: this.r_commentText,
                labelID: this.r_labelID,
                token: this.getFirebaseToken(),
            }

            this.changeLoadingState(true);
            let results = await comment.createInternalNote(noteInfo);
            this.changeLoadingState(false);
            if(results.valid === false){ // frontend formatting error
                //this.showWarnPopup(results.message);
                return false;
            }

            // request error
            if(results === false){
                //this.showWarnPopup("Could not create new internal note. Please try again.");
                return false;
            }

            let resultsJson = JSON.parse(results);
            if(resultsJson.code === 0){
                // add noteID and return results
                let createInternalNoteData = {
                    note_id: resultsJson.contents,
                    appraisalID: noteInfo.appraisalID,
                    note_text: noteInfo.noteText,
                    label_id: noteInfo.labelID,
                    user_type: 1, // amc user
                    display_name: this.getCurrentUser().displayName,
                    date_created: utils.getNowTimeString(), // TODO match the 24h format from sql
                }
                this.showSuccessPopup("Successfully created new internal note.");
                this.addInternalNote(createInternalNoteData);
                this.closeModal();
            } else {
                //this.showWarnPopup("Could not create new internal note. Please try again.");
                return false;
            }
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
    height: 500px !important;
    min-height: 500px !important;
    max-height: 600px !important;
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
