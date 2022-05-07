/*
 * validates email
 */
function emailIsValid(email){
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
module.exports.emailIsValid = emailIsValid;


/*
 * checking if user input is valid
 */
function userInputIsValid(userInfo){
    if(userInfo.firstName == ""){
        return {
            valid: false,
            message: "First Name cannot be empty."
        };
    }
    if(userInfo.lastName == ""){
        return {
            valid: false,
            message: "Last Name cannot be empty."
        };
    }
    if(userInfo.email == ""){
        return {
            valid: false,
            message: "Email cannot be empty."
        };
    }
    if(userInfo.phone == ""){
        return {
            valid: false,
            message: "Phone Number cannot be empty."
        };
    }
    return {
        valid: true,
        message: ""
    };
}
module.exports.userInputIsValid = userInputIsValid;


/*
 * checking if password is valid
 */
function passwordIsValid(userInfo){
    if(userInfo.newPass == ""){
        return {
            valid: false,
            message: "New password cannot be empty."
        };
    }
    else if(userInfo.confirmPass == ""){
        return {
            valid: false,
            message: "Confirm password cannot be empty."
        };
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
    return {
        valid: true,
        message: ""
    };
}
module.exports.passwordIsValid = passwordIsValid;
