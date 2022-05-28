<template>

    <div>
        <button type="button" @click="renderPDF(path)"> Show PDF </button>
        <div ref="pdf_viewer"></div>
    </div>

</template>


<script>

import PDFObject from 'pdfobject';
import http from '../../modules/request/http_request'

export default {
    name: 'PDFViewer',
    props: {
        local: Boolean, // if this is a local pdf or saved in server
        path: String, // path to disk or path of file in server
    },
    data() {
        return {
            pdfObject: undefined,
            pdfOptions: {
                //height: "400px",
                pdfOpenParams: {
                    // pagemode: "thumbs",
                    // navpanes: 0,
                    // toolbar: 0,
                    // statusbar: 0,
                    // view: "FitV"
                }
            },
        };
    },
    mounted(){
        // browser doesn't support embedded PDFs, need to download
        if(!PDFObject.supportsPDFs){
            this.showInfoPopup('PDFs are not supported by this browser. Please download if you want to view this document.');
            return;
        }

        //let path = 'biogas.pdf';

        // embed pdf
        /*let success = this.renderPDF(path);
        if(success === false){
            console.log("show error message --> An error occured trying to display this PDF. Please try again or download to your computer.");
            return;
        }*/
    },
    methods: {
        /*
         * show PDF in browser
         */
        async renderPDF(path){
            // get contents of pdf
            /*let contents = await this.getPDF(path);
            if(contents === false){
                console.log('show error code ---> could not return file')
                return false;
            }*/

            // Encode the String
            // console.log(contents);
            /*let encodedString = btoa(unescape(encodeURIComponent(contents)));
            console.log(encodedString)
            let pdfContents = "data:application/pdf;base64," + encodedString;
            //let pdfObject = PDFObject.embed(pdfContents, this.$refs.pdf_viewer, this.pdfOptions);
            */
            let query = {
                token: this.getFirebaseToken(),
                path: path,
            };

            // set loading as timeout since there's no pdf embed callback
            this.changeLoadingState(true);
            let self = this;
            setTimeout(function(){
                self.changeLoadingState(false);
            }, 3000);

            let endpoint = http.makeGetEndpoint("http://localhost:", 3080, '/api/docs/get', query);
            let pdfObject = PDFObject.embed(endpoint, this.$refs.pdf_viewer, this.pdfOptions);
            if(pdfObject === false){
                this.showInfoPopup('Could not display this PDF. Please try again or download to your computer if you want to view this document.');
                return false;
            }
            this.pdfObject = pdfObject;
            return true;
        },

        /*
         * get pdf contents
         */
        async getPDF(path){
            /*let body = {
                token: this.getFirebaseToken(),
                path: path
            }

            let results = await http.get('/docs', body);
            return results;*/
            /*if(results === false){
                return false;
            }
            if(results.code !== 0){
                return false;
            }

            return results.contents;*/
        },
    },
}

</script>


<style scoped>

.pdfobject-container {
	width: 100%;
	/* max-width: 600px; */
	/* height: 100%; */
    height: 670px;
	margin: 2em 0;
}

.pdfobject {
    border: solid 1px #666;
}

</style>
