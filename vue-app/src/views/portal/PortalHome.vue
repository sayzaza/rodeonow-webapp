<template>

    <div>
        <!-- <HeaderNavBar/> -->
        <div>
            <LeftSideBar
                :show="true"
                :firstLoad="false"
                :active="5"/>
            <div class="main-body animated bounce">
                <div>

                    <!-- <OrderSummaryTable/> -->
                    <!-- <QuickStatsTable/> -->
                    <!-- <OrderPreferredStatusTable/> -->
                    <!-- <OrderCommentsTable/> -->
                    <!-- <ItemsAwaitingReviewTable/> -->
                    <!-- <OrderStatisticsTable/> -->
                    <!-- <VendorOrdersTable/> -->

                    <!-- <hr>
                    <button type="button" @click="showSuccessPopup('Success message')"> Add success popup </button>
                    <hr>
                    <button type="button" @click="showWarnPopup('Warn message')"> Add warn popup </button>
                    <hr>
                    <button type="button" @click="showInfoPopup('Info message')"> Add info popup </button>
                    <hr>
                    <button type="button" @click="remove2fa">Remove 2FA</button>
                    <hr>
                    <button type="button" @click="setAdminStuff()"> Set admin stuff </button>
                    <hr>
                    <input
                        placeholder="Enter Phone Number"
                        autocomplete="off"
                        v-model="number">
                    <button type="button" @click="twofactor">2 Factor</button>
                    <hr>
                    <div v-if="waitingForCode">
                        <input
                            placeholder="Enter Verification Code"
                            autocomplete="off"
                            v-model="code">
                        <button type="button" @click="submitcode">Submit Code</button>
                    </div>
                    <div style="display: flex; justifyContent: center; alignItems: center">
                      <div ref="recaptcha" id="recaptcha-container" style="z-index: 100000"/>
                    </div> -->
                </div>
                <!-- <EmailCreator/> -->
                <!-- <PDFViewer path="biogas.pdf"/> -->
                <!-- <FileUploader/> -->
            </div>
        </div>
    </div>

</template>


<script>

// import { getAuth } from "firebase/auth";

import firebase from 'firebase/app'
const user = require('../../modules/users/user');

import HeaderNavBar from '../../common/components/app/HeaderNavBar.vue'
import LeftSideBar from '../../common/components/app/LeftSideBar.vue'



// import EmailCreator from '../../common/components/message/EmailCreator.vue'
// import PDFViewer from '../../common/components/document/PDFViewer.vue'
//import FileUploader from '../../common/components/document/FileUploader.vue'

export default {
    name: 'PortalHome',
    components: {
        HeaderNavBar,
        LeftSideBar,

        // EmailCreator,
        // PDFViewer,
        // FileUploader
    },
    data(){
        return{
          number: "",
          code: "",
          waitingForCode: false
        }
    },
    created(){
        document.body.style.backgroundColor = "#f5f5f5";
    },
    mounted(){
        this.changeLoadingState(true);
        this.changeLoadingState(false);
    },
    methods: {

        async twofactor() {
          /*try {
            var recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.$refs.recaptcha);
            const user = getAuth().currentUser;
            var phoneNumber = this.number;
            phoneNumber = phoneNumber.trim();
            var multiFactorSession = await user.multiFactor.getSession();
            var phoneInfoOptions = {
              phoneNumber: phoneNumber,
              session: multiFactorSession
            };
            var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
            var verificationId = await phoneAuthProvider.verifyPhoneNumber(
              phoneInfoOptions, recaptchaVerifier);
            recaptchaVerifier.clear();
            this.waitingForCode = true;
            this.verificationId = verificationId
          } catch (err) {
            recaptchaVerifier.clear();
            alert(err.message);
          }*/
        },

      async submitcode(){
        /*try {
          const user = getAuth().currentUser;
          var cred = firebase.auth.PhoneAuthProvider.credential(this.verificationId, this.code);
          var multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);
          this.remove2fa();
          await user.multiFactor.enroll(multiFactorAssertion, this.number);
          this.waitingForCode = false;
          this.code = "";
          this.number = "";
          alert("successfully enrolled in 2fa with number " + this.number);
        } catch (err) {
          this.code = "";
          alert(err.message);
        }*/
      },

      async remove2fa(){
           const user = firebase.auth().currentUser;
           const length = user.multiFactor.enrolledFactors.length;
           for (let i = 0; i < length; i++){
             let oldFactor = user.multiFactor.enrolledFactors[0];
             await user.multiFactor.unenroll(oldFactor);
           }
       },


       /*
        * sets admin info on registration
        */
       async setAdminStuff(){

           let body = {
               userID: this.getCurrentUser().uid,
               token: this.getFirebaseToken(),
               organizationID: 1,
               accountType: 5
           }

           let response = await user.setAdminInfo(body);
           if(response === false){
               //this.showWarnPopup('Could not register user. Please try again.');
               return false;
           }
           let responseJson = JSON.parse(response);
           if(responseJson.code !== 0){
               //this.showWarnPopup('Could not register user. Please try again.');
               return false;
           }
           this.showSuccessPopup('Successfully created user.');
       },

    }
}

</script>

<style scoped>

body{
    background-color: #555555;
}

.container {
    width: 966px;
    width: 80%;
}

</style>
