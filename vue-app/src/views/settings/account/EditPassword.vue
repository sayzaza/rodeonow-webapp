<template>

    <div>
        <HeaderNavBar/>
        <div class="container-fluid">
            <LeftSideBar
                :show="true"
                :firstLoad="false"
                :active="5"/>
            <div class="main-body animated bounce">
                <div class="container element-wrap d-flex justify-content-center">
                    <div class="card create-element-form">
                        <div class="card-body text-start">
                            <h4 align="center">Change Password</h4>
                            <div class="mb-3 mt-4">
                                <label class="form-label">Current Password: </label>
                                <input  type="password"
                                        v-model="oldPassword"
                                        class="form-control text-field"
                                        autocomplete="off"
                                        placeholder="Enter Current Password"
                                        maxlength="40">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">New Password: </label>
                                <input  type="password"
                                        v-model="newPassword"
                                        placeholder="Enter New Password"
                                        class="form-control text-field"
                                        autocomplete="off"
                                        maxlength="40">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Confirm New Password:</label>
                                <input  type="password"
                                        v-model="confirmPassword"
                                        placeholder="Confirm New Password"
                                        autocomplete="off"
                                        class="form-control text-field"
                                        maxlength="40">
                                <br />

                                <button @click="updateUser"
                                        type="submit"
                                        class="btn btn-primary w-100">Update</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>


<script>

// const firebase = require("firebase");
// import { getAuth } from "firebase/auth";
import firebase from 'firebase/app'
const user = require('@/modules/users/user');

import HeaderNavBar from '../../../common/components/app/HeaderNavBar.vue'
import LeftSideBar from '../../../common/components/app/LeftSideBar.vue'

export default {
    name: 'EditAccount',
    components: {
        HeaderNavBar,
        LeftSideBar,
    },
    prop: {
    },
    data(){
        return{
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    },
    methods: {

        async userIsAuthenticated(password){
            let currentUser = this.getCurrentUser();
            let credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                password
            );

            return new Promise(function(resolve) {
                currentUser.reauthenticateWithCredential(credential).then(function() {
                    resolve(true);
                }).catch(function() {
                    resolve(false);
                });
            });
        },

        async updateUser(){
            let authenticated = await this.userIsAuthenticated(this.oldPassword);
            if(!authenticated){
                //this.showWarnPopup('Old password is incorrect.');
                return false;
            }

            //let reauth = currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(currentUser.email, this.oldPassword));
            //if()

            let data = {
                oldPass: this.oldPassword,
                newPass: this.newPassword,
                confirmPass: this.confirmPassword,
                token: this.getFirebaseToken()
            }

            // change password
            this.changeLoadingState(true);
            let results = await user.editAccount(data);
            this.changeLoadingState(false);
            if(results.valid === false){
                //this.showWarnPopup(results.message);
                return false;
            }

            if(results == false){
                //this.showWarnPopup('Password change was not successful.');
                return false;
            }

            let resultsJson = JSON.parse(results);
            if(resultsJson.code == 0){ // success
                this.showSuccessPopup("Successfully changed password");
            } else if(resultsJson.code == 40){
                //this.showWarnPopup('Password change was not successful.');
                //this.showWarnPopup("Current password didn't match or improper parameters were submitting.");
            } else {
                //alert(results.ErrorMessage);
                //this.showWarnPopup('Password change was not successful.');
            }
        }

    }
}

</script>

<style scoped>
.card {
    width: 30rem;
}
</style>