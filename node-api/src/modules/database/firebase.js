const admin = require('firebase-admin');
const auth = require('firebase/auth');


/*
 * validates firebase token from request
 */
async function verifyFirebaseToken(token){
    return new Promise(function(resolve) {
        try {
            admin.auth().verifyIdToken(token)
            .then((claims) => {
              resolve(claims);
            })
            .catch(() => {
                //console.log(error);
                resolve(false);
            });
        } catch {
            resolve(false)
        }
    })
}
module.exports.verifyFirebaseToken = verifyFirebaseToken;


/*
 * saves user in firebase
 */
async function createUser(userInfo){
    let firebaseUser;
    return await auth.getAuth().createUserWithEmailAndPassword(userInfo.email, userInfo.newPass)
      .then(function(user) {
          firebaseUser = user.user;
      })
      .then(function(user) {
          return firebaseUser;
      })
      .catch(function(error) {
        return false;
      });
    /*
    return await admin.auth().createUser({
        email:          userInfo.email,
        password:       userInfo.newPassword,
        displayName:    userInfo.firstName + ' ' + userInfo.lastName,
        emailVerified:  false,
        //phoneNumber:    userInfo.phone
    }).then(function(userRecord) {
        return userRecord;
     })
     .catch(function(error) {
         return false;
     });*/
}
module.exports.createUser = createUser;

/*
 * updates user info in firebase
 */
async function updateUser(userInfo){
    return await admin.auth().updateUser(userInfo.userID, {
      email: userInfo.email,
      // phoneNumber: userInfo.phone,
      password: userInfo.newPassword,
      displayName: userInfo.firstName + ' ' + userInfo.lastName,
    })
      .then(function(userRecord) {
          return true;
      })
      .catch(function(error) {
          console.log(error);
          return false;
      });
}
module.exports.updateUser = updateUser;


/*
 * update firebase password
 */
async function updatePassword(uid, password){
    return new Promise(function(resolve) {
        admin.auth().updateUser(uid, {
          /*email: "modifiedUser@example.com",
          phoneNumber: "+11234567890",
          emailVerified: true,*/
          password: password,
          /*displayName: "Jane Doe",
          photoURL: "http://www.example.com/12345678/photo.png",
          disabled: true*/
        })
          .then(function(userRecord) {
              resolve(true);
          })
          .catch(function(error) {
              resolve(false);
          });
     });
}
module.exports.updatePassword = updatePassword;


/*
 * enables/disables user
 */
async function disableUser(uid, disable){
    return new Promise(function(resolve) {
        admin.auth().updateUser(uid, {
          disabled: disable
        })
          .then(function(userRecord) {
              resolve(true);
          })
          .catch(function(error) {
              resolve(false);
          });
     });
}
module.exports.disableUser = disableUser;
