const request = require('../request/http_request');
const validate = require('../utils/validate');


/*
 * registers user and sets admin info
 */
async function setAdminInfo(userInfo){
    return await request.post('/api/user/register', userInfo);
}
module.exports.setAdminInfo = setAdminInfo;


/*
 * gets users for this organization
 */
async function getAll(userInfo){
    return await request.get('/api/user/getall', userInfo);
}
module.exports.getAll = getAll;


/*
 * verifies user input and sends request to server
 */
async function createUser(userInfo){
    let isValid = validate.userInputIsValid(userInfo);
    if(isValid.valid === false){
        return isValid;
    }

    if(userInfo.newPass != userInfo.confirmPass){ // passwords must match
        return {
            valid: false,
            message: "New passwords don't match."
        };
    } else if(userInfo.newPass.length < 8){ // password must be at least 8 characters
        return {
            valid: false,
            message: "New password must be at least 8 characters."
        };
    }

    return await request.post('/api/user/admin/user/create', userInfo);
}
module.exports.createUser = createUser;


/*
 * deactivate user account
 */
async function deactivateUser(userID, token){
    let body = {
        userID: userID,
        token: token
    }
    return await request.post('/api/user/admin/user/deactivate', body);
}
module.exports.deactivateUser = deactivateUser


/*
 * reactivate user account
 */
async function reactivateUser(userID, token){
    let body = {
        userID: userID,
        token: token
    }
    return await request.post('/api/user/admin/user/reactivate', body);
}
module.exports.reactivateUser = reactivateUser


/*
 * edits another users info
 */
async function editUser(userInfo){
    let inputIsValid = validate.userInputIsValid(userInfo);
    if(!inputIsValid.valid){
        return inputIsValid;
    }
    return await request.post('/api/user/admin/user/edit', userInfo);
}
module.exports.editUser = editUser;



/*
 * edits logged in users acccount (password)
 */
async function editAccount(userInfo){
    let passIsValid = validate.passwordIsValid(userInfo);
    if(!passIsValid.valid){
        return passIsValid;
    }
    return await request.post('/api/user/password/reset', userInfo);
}
module.exports.editAccount = editAccount;


/*
 * edits logged in users acccount (password)
 */
async function changePassword(userInfo){
    let passIsValid = validate.passwordIsValid(userInfo);
    if(!passIsValid.valid){
        return passIsValid;
    }
    return await request.post('/api/user/admin/password/change', userInfo);
}
module.exports.changePassword = changePassword;
