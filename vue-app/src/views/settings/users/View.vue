<template>

    <div>
        <HeaderNavBar/>
        <div>
            <LeftSideBar/>
            <div class="main-body animated bounce">
                <div>
                    <h5> {{ r_usersCount + " " + r_userFilter}} users.</h5>

                    <div class="d-flex justify-content-end">
                        <img @click="addUser()" class="pointer" src="/bootstrap-icons/icons/plus-circle.svg" width="27" height="27">
                    </div>
                    <div class="form-group">
                        <label>Account Status</label>
                        <select @change="filterUsers" class="form-control" name="active-status">
                            <option selected value="1">Active</option>
                            <option value="2">Inactive</option>
                            <option value="3">All Users</option>
                        </select>
                    </div>
                </div>

                <div>
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Date Created</th>
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            <UserRow
                                v-for="user in r_filteredUsers"
                                :key="user.firebase_uid"
                                :userID="user.firebase_uid"
                                :firstName="user.first_name"
                                :lastName="user.last_name"
                                :email="user.email"
                                :phone="user.phone"
                                :accountType="user.account_type"
                                :dateCreated="user.date_created"
                                :dateDeleted="user.date_deleted"/>
                        </tbody>
                    </table>
                </div>
                <UserModal
                    :editMode="true"/>
            </div>
        </div>
    </div>

</template>



<script>

import { mapMutations } from 'vuex'

const user = require('../../../modules/users/user');

import HeaderNavBar from '../../../common/components/app/HeaderNavBar.vue'
import LeftSideBar from '../../../common/components/app/LeftSideBar.vue'

import UserRow from '../../../common/components/users/UserRow.vue'
import UserModal from '../../../common/components/users/UserModal.vue';

export default {
    name: 'ViewUsers',
    components: {
        HeaderNavBar,
        LeftSideBar,
        UserRow,
        UserModal,
    },
    props: {
    },
    data(){
        return {
            r_users: [],
            r_usersCount: 0,
            r_userFilter: "registered",
            r_userFilterStatus: 1,
            r_filteredUsers: [],
        }
    },
    created(){
    },
    mounted() {
        this.changeLoadingState(true);
        this.getAllUsers();
        let self = this;
        setInterval(function(){
            self.changeLoadingState(false);
        }, 250)

    },
    methods: {
        ...mapMutations([
            'showEditUserModal',
        ]),

        /*
         * button click to add new user
         */
        addUser(){
            let props = {
                editMode: false,
                createUserCallback: this.onCreateUser,
                userID:      '',
                firstName:   '',
                lastName:    '',
                email:       '',
                phone:       '',
                accountType: 0,
                //dateCreated:  this.dateCreated,
                //dateDeleted:this.dateDeleted,
            }

            this.showEditUserModal(props);
        },

        /*
         * callback for created user
         */
        onCreateUser(userInfo){
            this.r_users.push(userInfo);
            this._filterUsers();
        },


        /*
         * gets all users
         */
         async getAllUsers(){
             let body = { token: this.getFirebaseToken() }
             let users = await user.getAll(body);
             if(users === false){
                 //this.showWarnPopup('Could not retrieve users. Please refresh the page and try again.');
                 return false;
             }

             let usersJson = JSON.parse(users);
             if(usersJson.code !== 0){
                 //this.showWarnPopup('Could not retrieve users. Please refresh the page and try again.');
                 return false;
             }

             this.r_users = usersJson.contents;
             this.r_usersCount = this.r_users.length;
             this.filterActiveUsers();
         },

         /*
          * filters users
          */
          filterUsers(event){
              this.r_userFilterStatus = +event.target.value;
              this._filterUsers()
          },
          _filterUsers(){
              switch(this.r_userFilterStatus){
                  case 1: { // active
                      this.filterActiveUsers();
                      break;
                  }
                  case 2: { // inactive
                      this.filterInactiveUsers();
                      break
                  }
                  case 3: { // all
                      this.filterAllUsers();
                      break
                  }
                  default: { // revert to all
                      this.filterAllUsers();
                      break;
                  }
              }
          },

          /*
           * filters active users
           */
           filterActiveUsers(){
               let userRows = [];
               this.r_users.forEach(function(row){
                   if(row.date_deleted === null){
                       userRows.push(row);
                   }
               });
               this.r_usersCount = userRows.length;
               this.r_userFilter = "active";
               this.r_userFilterStatus = 1;
               this.r_filteredUsers = userRows;
           },


           /*
            * filters active users
            */
            filterInactiveUsers(){
                let userRows = [];
                this.r_users.forEach(function(row){
                    if(row.date_deleted !== null){
                        userRows.push(row);
                    }
                });
                this.r_usersCount = userRows.length;
                this.r_userFilter = "inactive";
                this.r_userFilterStatus = 2;
                this.r_filteredUsers = userRows;
            },


            /*
             * filters active users
             */
            filterAllUsers(){
                 this.r_usersCount = this.r_users.length;
                 this.r_userFilter = "registered";
                 this.r_userFilterStatus = 3;
                 this.r_filteredUsers = this.r_users;
            }

    }
}

</script>

<style scoped>

.add-user-button{
    /* margin-right: 10%; */
    /* font-size: 17px;
    padding-bottom: 10px; */
    cursor: pointer;
}

.add-user-button:hover{
    color: grey;
}

#modal-user{
    padding-right: 17px;
    display:none;
    margin-top: 50px;
}

</style>
