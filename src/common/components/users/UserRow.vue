<template>

    <tr v-on:dblclick="editUser"
        class="table-row pointer">
        <td>
            <span v-if="r_editMode">
                <input
                    v-model="r_firstName"
                    class="form-control"
                    type="text"
                    placeholder="First Name"
                    min=0
                    max=40/>
            </span>
            <span v-else>
                {{ r_firstName }}
            </span>
        </td>
        <td>
            <span v-if="r_editMode">
                <input
                    v-model="r_lastName"
                    class="form-control"
                    type="text"
                    placeholder="Last Name"
                    min=0
                    max=40/>
            </span>
            <span v-else>
                {{ r_lastName }}
            </span>
        </td>
        <td>
            {{ r_email }}
        </td>
        <td>
            {{ r_phone }}
        </td>
        <td>
            {{ r_dateCreated }}
        </td>
        <td>
            <div v-if="getCurrentUser().uid !== userID">
                <img v-if="r_deleted === false" 
                    class="pointer"
                    @click="deactivateUser"
                    src="/bootstrap-icons/icons/check.svg" 
                    width="25" 
                    height="25">
                <img v-else 
                    class="pointer"
                    @click="reactivateUser"
                    src="/bootstrap-icons/icons/lock-fill.svg" 
                    width="25" 
                    height="25">
            </div>
        </td>
        <!-- <td>
            <img
                class="pointer"
                @click="editUser"
                src="/bootstrap-icons/icons/person.svg" 
                width="25" 
                height="25">
        </td> -->
    </tr>

</template>


<script>

import { mapMutations } from 'vuex'

const request = require('../../../modules/users/user');

export default {
    name: 'UserRow',
    props: {
        userID: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        accountType: Number,
        dateCreated: String,
        dateDeleted: String,
    },
    data(){
        return{
            r_editMode: false,
            r_deleted: false,

            // user info
            r_firstName: this.firstName,
            r_lastName: this.lastName,
            r_email: this.email,
            r_phone: this.phone,

            r_dateCreated: this.dateCreated,
            r_dateDeleted: this.dateDeleted,
        }
    },
    mounted(){
        if(this.r_dateDeleted !== null){
            this.r_deleted = true;
        }
    },
    methods: {
        ...mapMutations([
            'showEditUserModal',
        ]),

        /*
         * click edit mode/save
         */
        editUserMode(){
            this.r_editMode = true;
        },
        saveUser(){
            this.r_editMode = false;
        },

        /*
         * deactivate user
         */
         async deactivateUser(){
             let confirm = window.confirm("Are you sure you want to deactivate this user? This person will be locked from their account.");
             if(confirm === false){
                 return;
             }

             this.changeLoadingState(true);
             let response = await request.deactivateUser(this.userID, this.getFirebaseToken());
             this.changeLoadingState(false);

             // request error
             if(response === false){
                  this.showWarnPopup('Could not deactivate this account. Please try again.');
                  return;
             }

             let responseJson = JSON.parse(response);
             if(responseJson.code == 0){
                 this.showSuccessPopup("User successfully deactivated.")
                 this.r_dateDeleted = "NOW";
                 this.$parent._filterUsers();
                 this.r_deleted = true;
             } else{
                 this.showWarnPopup('Could not deactivate this account. Please try again.');
             }
         },

         /*
          * reactivate user
          */
        async reactivateUser(){
            // display confirmation for deactivating user
            let confirm = window.confirm("Are you sure you want to reactivate this user?");
            if(confirm === false){
                return;
            }

            this.changeLoadingState(true);
            let response = await request.reactivateUser(this.userID, this.getFirebaseToken());
            this.changeLoadingState(false);
            if(response === false){
                this.showWarnPopup('Could not activate this account. Please try again.');
                return;
            }

            let responseJson = JSON.parse(response);
            if(responseJson.code == 0){
                this.showSuccessPopup("User successfully reactivated.")
                this.r_dateDeleted = "";
                this.$parent.filterUsers();
                this.r_deleted = false;
            } else{
                this.showWarnPopup('Could not activate this account. Please try again.');
            }
        },

        editUser() {
            let editData = {
                editMode:       true,
                userID:         this.userID,
                firstName:      this.r_firstName,
                lastName:       this.r_lastName,
                email:          this.r_email,
                phone:          this.r_phone,
                accountType:    this.accountType,
                dateCreated:    this.dateCreated,
                dateDeleted:    this.dateDeleted,

                editUserCallback:   this.onEditUser,
                deleteUserCallback: this.deactivateUser,
            }
            this.showEditUserModal(editData);
        },

        /*
         * callback for edited user
         */
        onEditUser(userInfo){
            this.r_firstName = userInfo.firstName;
            this.r_lastName = userInfo.lastName;
            this.r_email = userInfo.email;
            this.r_phone = userInfo.phone;
        },
    }
}
</script>
