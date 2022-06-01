import firebase from "firebase/app";
import config from "@/assets/config"
import 'firebase/storage';
import 'firebase/firestore';
firebase.initializeApp(config.firebaseConfig);
const db = firebase.firestore()
const auth = firebase.auth()

export const recoverUserPassword = async(email)=>{
  try {
    const result = await auth.sendPasswordResetEmail(email)
    return {error:null,result}
  } catch (error) {
    return {error,result:null}
  }
}

export const loginUser = async (payload) => {
try {
  const result = await auth.signInWithEmailAndPassword(payload.email,payload.password)
  return {error:null,result}
} catch (error) {
  return {error,result:null}
}

}
export const currentUser = ()=>{
  console.log(auth.currentUser)
  return auth.currentUser
}
export const registerUser = async (payload) => {
  try {
    
  const result = await  auth.createUserWithEmailAndPassword(payload.email,payload.password)
  if(result.user){
    const uploadResult = await uploadImage(payload.imageData,result.user.uid)
    console.log(uploadResult)
    payload.photoUrl = uploadResult
    delete payload.password
    delete payload.imageData
    delete payload.confirmPassword

    const response =await saveUserDetail(result.user.uid,payload)
    console.log("saveuser",response)
    console.log(result.user.uid)
    return {error:null,result}
  }
  
    
  } catch (error) {
    return {error,result:null}
  }
  
};

 const uploadImage = async (imageData,uuid)=>{
  const ext  = imageData.type.split('/')[1]
  const imageName = `profile.${ext}`
  const storageRef = await  firebase.storage().ref(`users/${uuid}/${imageName}`).put(imageData);

   return storageRef.ref.getDownloadURL()
    .then((url) => {
      console.log(url)
      return url
      
    })

}

export const checkEmailExist = async(email) =>{
  return  db
    .collection("users")
    .where("email", "==", `${email}`)
}

 const saveUserDetail = async(uuid,userDetails)=>{
  return await db.doc(`users/${uuid}`).set(userDetails)
}



