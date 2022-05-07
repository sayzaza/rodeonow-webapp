<template>

    <div class="login">
        <div class="form-group">
            <input
                type="email"
                placeholder="From Email"
                name="email"
                v-model="fromEmail"
                autocomplete="off"
                disabled>
        </div>
        <div class="form-group">
            <EmailSelect
                selectDirection="top"
                :allEmails="allEmails"
                :onChangeCallback="onEmailSelect"/>
        </div>
        <div class="form-group">
            <input
                type="text"
                placeholder="Subject"
                autocomplete="off"
                name="pass"
                v-model="subject"
                maxlength="100">
        </div>
        <div class="form-group">
            <textarea
                style="width: 100%"
                rows="7"
                cols="70"
                v-model="message"
                placeholder="Message">
            </textarea>
        </div>
        <div>
            <input
                type="file"
                class="file_input"
                @change="previewFiles"
                placeholder="Attachment"
                autocomplete="off"
                name="pass"
                maxlength="100">
        </div>
        <button type="button" @click="sendEmail()"> Send </button>
    </div>

</template>


<script>

import http from '../../../modules/request/http_request'
import email from '../../../modules/utils/validate';

import EmailSelect from './EmailSelect';

export default {
    name: 'EmailCreator',
    components: {
        EmailSelect
    },
    data() {
        return {
            toEmails: [],
            fromEmail: this.getFirebaseUser().email,
            subject: '',
            message: '',
            file: undefined,
            allEmails: ["a@a.com", "b@b.com"] // temporary
        };
    },
    created(){
        this.changeLoadingState(true);
        this.changeLoadingState(false);
    },
    methods: {
        previewFiles(event){
            const files = event.target.files;
            //let filename = files[0].name;
            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.imageUrl = fileReader.result
            })
            fileReader.readAsDataURL(files[0])
            this.file = files[0]
        },

        /*
         * send email to backend
         */
        async sendEmail(){
            // validate emails before sending
            let valid = email.emailIsValid(this.fromEmail);
            if(valid === false){
                //this.showWarnPopup(this.fromEmail + " is not a valid email address.");
                return;
            }
            if(this.toEmails.length === 0){
                //this.showWarnPopup("Please select at least one email recipient.");
                return;
            }
            for(let i=i; i<this.toEmails.length; i++){
                let toEmail = this.toEmails[i];
                if(!email.emailIsValid(toEmail)){
                    //this.showWarnPopup(toEmail + " is not a valid email address.");
                    return;
                }
            }

            if(this.subject === ''){
                //this.showWarnPopup('Email subject cannot be empty.');
                return;
            }

            if(this.message === ''){
                //this.showWarnPopup('Email message cannot be empty.');
                return;
            }


            let body = {
                //toEmails: this.toEmails,
                fromEmail: this.fromEmail,
                subject: this.subject,
                message: this.message,
            }

            // if attachment was included
            if(this.file !== undefined){
                body.file = this.file;
            }
            body.token = this.getFirebaseToken(); // create new token

            // add data to form data
            const formData = new FormData();
            for (const item in body) {
                formData.append(item, body[item]);
            }

            this.toEmails.forEach((item, i) => {
                if(item[i] !== undefined){
                    formData.append('toEmails[]', item[i]);
                }
            });

            let rawResults = await http.postForm('/api/email/send', formData, 15000);
            if(rawResults === false){
                //this.showWarnPopup('Could not send email. Please try again.');
                return false;
            }
            let results = JSON.parse(rawResults);
            if(results.code !== 0){
                //this.showWarnPopup('Could not send email. Please try again.');
                return false;
            }

            this.showSuccessPopup('Email sent successfully.')
            return true;
        },

        /*
         * callback when selecting emails
         */
        onEmailSelect(email){
            this.toEmails.push(email);
        },
    },
}

</script>


<style scoped>

.file_input{
    border-style: none;
}

</style>
