<template>

    <multiselect
          :value="r_selectedEmails"
          :options="r_allEmails"
          :close-on-select="false"
          :clear-on-select="false"
          :hide-selected="false"
          :open-direction="selectDirection"
          :preserve-search="true"
          :multiple="true"
          :searchable="true"
          :taggable="true"
          tagPlaceholder="Add new email"
          :preselect-first="false"
          :custom-label="customLabel"
          :show-labels="false"
          selectLabel="To Emails"
          deselectLabel=""
          placeholder="To Emails"
          @select="onSelect"
          @remove="onRemove"
          @tag="addEmail">
     </multiselect>

</template>


<script>

import email from '../../../modules/utils/validate';

import Multiselect from 'vue-multiselect'

export default {
    name: 'EmailSelect',
    components: {
        Multiselect
    },
    props: {
        selectDirection: { // bottom or top
            type: String,
            default: 'bottom',
        },
        allEmails: { // all emails
            type: Array,
            default: () => []
        },
        selectedEmails: { // selected emails
            type: Array,
            default: () => []
        },
        onChangeCallback: Function,
    },
    data() {
        return {
            r_allEmails: this.allEmails, // all emails in dropdown
            r_selectedEmails: this.selectedEmails, // selected emails
        };
    },
    mounted(){
    },
    methods: {
        /*
         * create a custom label to display
         */
         customLabel(option) {
             return option
         },

         onSelect(option){
             this.r_selectedEmails.push(option);
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedEmails);
             }
         },

         onRemove(option){
             for(let i=0; i < this.r_selectedEmails.length; i++){
                 let email = this.r_selectedEmails[i];
                 if(email === option){
                     this.r_selectedEmails.splice(i, 1);
                 }
             }
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedEmails);
             }
         },

         /*
          * add email
          */
         addEmail(newEmail) {
             let valid = email.emailIsValid(newEmail);
             if(valid === false){
                 this.showWarnPopup("Please enter a valid email.");
                 return;
             }
             this.r_allEmails.push(newEmail);
             this.r_selectedEmails.push(newEmail);

             // if callback if registered
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedEmails);
             }
         },
    },
}
</script>
