<template>

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

</template>



<script>

const user = require('../../../modules/users/user');

import UserRow from './UserRow.vue'

export default {
    name: 'UsersListTable',
    components: {
        UserRow,
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
    mounted() {
        this.changeLoadingState(true);
        this.getAllUsers();
        let self = this;
        setInterval(function(){
            self.changeLoadingState(false);
        }, 250)

    },
    methods: {

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
