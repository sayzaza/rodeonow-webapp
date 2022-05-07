<template>

    <div class="login">
        <div>
            <input
                type="file"
                class="file_input"
                @change="previewFiles"
                placeholder="Attachment"
                autocomplete="off"
                maxlength="100">
        </div>
        <button type="button" @click="uploadFile()"> Upload </button>
    </div>

</template>


<script>

import http from '../../../modules/request/http_request';

export default {
    name: 'FileUploader',
    data() {
        return {
            name: '',
            file: undefined,
        };
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
         * uploads file
         */
        async uploadFile(){
            // attachment must be included
            if(this.file === undefined){
                //this.showWarnPopup('Please select a file to upload.');
                return false;
            }

            let body = {
                token: this.getFirebaseToken(),
                name: this.name,
                file: this.file
            }

            this.changeLoadingState(true);
            let rawResults = await http.postForm('/api/docs/upload', body, 30000);
            this.changeLoadingState(true);
            if(rawResults === false){
                //this.showWarnPopup('Could not upload file. Please try again.');
                return false;
            }
            let results = JSON.parse(rawResults);
            if(results.code !== 0){
                //this.showWarnPopup('Could not upload file. Please try again.');
                return false;
            }

            this.showSuccessPopup('File successfully uploaded.')
            return true;
        },
    },
}

</script>


<style scoped>

.file_input{
    border-style: none;
}

</style>
