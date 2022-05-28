

const validate = async (data) => {
    const isEmpty = await checkEmpty(data);
    if (isEmpty) {
      return { error: true, msg: "All fields are required" };
    } else if (!checkPasswordMatch(data)) {
      return { error: true, msg: "Password does not match" };
    }else if(!checkPasswordLength(data)){
       return { error: true, msg: "Password too short" };
    }
     else {
      return true;
    }
  };

  const checkEmpty = async (data) => {
    for (const property in data) {
      console.log(`${property}: ${data[property]}`);
      if (
        data[property] == null ||
        data[property] == undefined ||
        data[property] == ""
      ) {
        return true;
      }
    }
    return false;
  };

  const checkPasswordMatch = (data) => {

    if (data.password !== data.confirmPassword) {
      return false;
    } else {
      return true;
    }
  };

  const checkPasswordLength =(data)=>{
      console.log("password length",data.password.length)
    if (data.password.length < 6) {
        return false;
      } else {
        return true;
      }
  }

  module.exports= {
    validate
  }