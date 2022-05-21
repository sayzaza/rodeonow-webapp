<template>

    <div v-if="r_showModal" class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header d-flex justify-content-center">
                <span v-if="r_editMode">
                    <img @click="deleteUser" class="pointer" src="/bootstrap-icons/icons/trash.svg" width="20" height="20">
                </span>
                <button type="button" class="close" @click="closeModal">&times;</button>
                <h2 v-if="r_editMode !== true" class="modal-title text-center">
                    Create New User
                </h2>
                <h2 v-else class="modal-title" style="text-align: center;">Edit User</h2>
            </div>
            <div class="modal-body">
                <ul class="nav nav-tabs" v-if="r_editMode">
                    <li :class= "[r_showAccount ? 'nav-item active' : 'nav-item']">
                        <a class="nav-link active" @click="editUserMode(true)">Account</a>
                    </li>
                    <li :class= "[!r_showAccount ? 'nav-item active' : 'nav-item']">
                        <a class="nav-link" @click="editUserMode(false)">Password</a>
                    </li>
                </ul>
                <div class="form-group" v-if="!r_editMode || r_showAccount">
                    <label>First Name:</label>
                    <input  type="text"
                            v-model="r_firstName"
                            class="form-control"
                            placeholder="First Name"
                            maxlength="40"/>
                </div>
                <div class="form-group" v-if="!r_editMode || r_showAccount">
                    <div class="form-group infoform">
                        <label>Last Name:</label>
                        <input  type="text"
                                v-model="r_lastName"
                                class="form-control"
                                placeholder="Last Name"
                                maxlength="40"/>
                    </div>
                </div>
                <div class="form-group" v-if="!r_editMode || r_showAccount">
                    <div class="form-group infoform">
                        <label>Email:</label>
                        <input type="email"
                                v-model="r_email"
                                class="form-control"
                                autocomplete="off"
                                placeholder="Email Address"
                                maxlength="40"/>
                    </div>
                </div>
                <div class="form-group" v-if="!r_editMode || r_showAccount">
                    <div class="form-group infoform">
                        <label>Phone:</label>
                        <input type="text"
                                v-model="r_phone"
                                class="form-control"
                                autocomplete="off"
                                placeholder="Phone Number"
                                maxlength="40"/>
                    </div>
                </div>
                <div class="form-group" v-if="!r_editMode || !r_showAccount">
                    <div class="form-group infoform">
                        <div></div>
                        <label v-if="r_editMode !== true">Create Password (8 Character Minimum):</label>
                        <label v-else>New Password (8 Character Minimum):</label>
                        <input  type="password"
                                v-model="r_newPassword"
                                class="form-control"
                                placeholder="Password"
                                autocomplete="off"
                                maxlength="40">
                    </div>
                </div>
                <div class="form-group" v-if="!r_editMode || !r_showAccount">
                    <div class="form-group infoform">
                        <div></div>
                        <label>Confirm Password:</label>
                        <input  type="password"
                                v-model="r_confirmPassword"
                                class="form-control"
                                autocomplete="off"
                                placeholder="Confirm Password"
                                maxlength="40">
                    </div>
                </div>
            </div>

            <div class="modal-footer justify-content-center">
                <div v-if="r_editMode === true">
                    <button @click="editUser" class="btn btn-primary" v-if="r_showAccount">Save</button>
                    <button @click="editPassword" class="btn btn-primary" v-if="!r_showAccount">Save</button>
                </div>
                <div v-else>
                    <button @click="createUser" class="btn btn-primary">Create Account</button>
                </div>
            </div>
        </div>
    </div>

</template>


<script>

const user = require('../../../modules/users/user');
const time = require('../../../modules/utils/time');

export default {
    name: 'UserModal',
    props: {
        /*createUserCallback: Function,
        editUserCallback: Function,
        deleteUserCallback: Function,*/
    },
    data() {
        return {
            r_showModal: false,
            r_editMode: false,
            r_userID: '',
            r_firstName: '',
            r_lastName: '',
            r_email: '',
            r_phone: '',
            r_dateCreated: '',
            r_dateDeleted: '',
            r_showAccount: true,

            r_newPassword: '',
            r_confirmPassword: '',

            createUserCallback: undefined,
            editUserCallback: undefined,
            deleteUserCallback: undefined,
        }
    },
    created(){
        this.unsubscribe = this.$store.subscribe((mutation) => {
            if (mutation.type === 'showEditUserModal') {
                let payload = mutation.payload;

                this.r_editMode = payload.editMode;

                this.r_userID = payload.userID;
                this.r_firstName = payload.firstName;
                this.r_lastName = payload.lastName;
                this.r_email = payload.email;
                this.r_phone = payload.phone;
                this.r_dateCreated = payload.dateCreated;
                this.r_dateDeleted = payload.dateDeleted;
                this.r_newPassword = '';
                this.r_confirmPassword = '';
                //this.r_showAccount = payload.

                this.createUserCallback = payload.createUserCallback;
                this.editUserCallback = payload.editUserCallback;
                this.deleteUserCallback = payload.deleteUserCallback;

                this.r_showModal = true;
            }
        })
    },
    destroyed(){
        this.unsubscribe();
    },
    methods: {
        editUserMode(mode) {
            this.r_showAccount = mode;
        },

        /*
         * closes modal
         */
        closeModal(){
            this.r_showModal = false;
        },

        /*
         * save user in database
         */
        async createUser(){
            let userInfo = {
                firstName: this.r_firstName,
                lastName: this.r_lastName,
                email: this.r_email,
                phone: this.r_phone,
                newPass: this.r_newPassword,
                confirmPass: this.r_confirmPassword,
                token: this.getFirebaseToken()
            }

            this.changeLoadingState(true);
            let results = await user.createUser(userInfo);
            this.changeLoadingState(false);
            if(results.valid === false){ // frontend formatting error
                this.showWarnPopup(results.message);
                return false;
            }

            // request error
            if(results === false){
                this.showWarnPopup("Could not create new user. Please try again.");
                return false;
            }

            let resultsJson = JSON.parse(results);
            if(resultsJson.code === 0){
                // add userID and return results
                let createUserData = {
                    firebase_uid: resultsJson.contents,
                    date_created: time.getNowTimeString(),
                    date_deleted: null,
                    first_name: userInfo.firstName,
                    last_name: userInfo.lastName,
                    email: userInfo.email,
                    phone: userInfo.phone,
                    account_type: userInfo.accountType,
                }
                this.showSuccessPopup("Successfully created new user.");
                this.createUserCallback(createUserData);
                this.closeModal();
            } else {
                this.showWarnPopup("Could not create new user. Please try again.");
                return false;
            }
        },

        /*
         * edits non-password info
         */
        async editUser () {
             let body = {
                 userID: this.r_userID,
                 firstName: this.r_firstName,
                 lastName: this.r_lastName,
                 email: this.r_email,
                 phone: this.r_phone,
                 token: this.getFirebaseToken()
             }

             this.changeLoadingState(true);
             let results = await user.editUser(body);
             this.changeLoadingState(false);
             if(results.valid === false){ // validatation error
                 this.showWarnPopup(results.message);
                 return false;
             }

             // request error
             if(results == false){
                 this.showWarnPopup('Could not edit user information. Please try again.');
             }
             let resultsJson = JSON.parse(results);
             if(resultsJson.code == 0){
                 this.showSuccessPopup('Successfully edited user profile.');
                 this.editUserCallback(body);
                 this.closeModal();
             } else {
                 this.showWarnPopup('Could not edit user information. Please try again.');
             }
        },

        /*
         * changes password
         */
        async editPassword () {
             let body = {
                 userID: this.r_userID,
                 newPass: this.r_newPassword,
                 confirmPass: this.r_confirmPassword,
                 token: this.getFirebaseToken()
             }

             this.changeLoadingState(true);
             let results = await user.changePassword(body);
             this.changeLoadingState(false);
             if(results.valid === false){ // validatation error
                 this.showWarnPopup(results.message);
                 return false;
             }
             // request error
             if(results == false){
                 this.showWarnPopup('Password change was not successful.');
                 return false;
             }

             let resultsJson = JSON.parse(results);
             if(resultsJson.code == 0){ // success
                 this.showSuccessPopup("Successfully changed password");
                 this.r_newPassword = '';
                 this.r_confirmPassword = '';
             } else {
                 this.showWarnPopup('Password change was not successful.');
             }
        },

        /*
         * on click to delete user
         */
        async deleteUser() {
            this.deleteUserCallback();
            // // display confirmation for deactivating user
            // let confirm = window.confirm("Are you sure you want to deactivate this user? This person will be locked from their account.");
            // if(confirm === false){
            //     return;
            // }
            //
            // let body = {
            //     UserID : this.r_userID
            // }
            // let response = await user.deactivateUser(body);
            //
            // if(response === false){
            //     alert("System error. Please try again.")
            // } else if(response.ErrorCode == 0){
            //     alert("User successfully deactivated.")
            //     this.r_dateDeleted = "NOW";
            //     this.$parent.filterUsers();
            //     this.r_deleted = true;
            // } else{
            //     console.log(response.ErrorMessage);
            //     alert("Error");
            // }
        }
    }
 }

</script>

<style scoped>
.modal-header {
    position: relative;
}

.modal-header button {
    position: absolute;
    right: 1rem;
}

.modal-header img {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
}
</style>