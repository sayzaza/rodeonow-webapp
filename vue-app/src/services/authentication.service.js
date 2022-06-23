import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  signInWithEmailAndPassword
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getFirestore, setDoc, doc, query, getDocs } from "firebase/firestore";
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

export const recoverUserPassword = async (email) => {
  try {
    const result = await sendPasswordResetEmail(email);
    return {
      error: null,
      result
    };
  } catch (error) {
    return {
      error,
      result: null
    };
  }
};

export const loginUser = async (payload) => {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    return { error: null, result };
  } catch (error) {
    return { error, result: null };
  }
};

export const logOut = async () => {
  try {
    const result = await signOut(auth);
    return { error: null, result };
  } catch (error) {
    return { error, result: null };
  }
};

export const registerUser = async (payload) => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    if (result.user) {
      const uploadResult = await uploadImage(
        payload.imageData,
        result.user.uid
      );
      console.log(uploadResult);
      payload.photoUrl = uploadResult;
      delete payload.password;
      delete payload.imageData;
      delete payload.confirmPassword;
      const response = await saveUserDetail(result.user.uid, payload);
      console.log("saveuser", response);
      console.log(result.user.uid);
      return { error: null, result };
    }
  } catch (error) {
    return { error, result: null };
  }
};

const uploadImage = async (imageData, uuid) => {
  const ext = imageData.type.split("/")[1];
  const imageName = `profile.${ext}`;
  const loc = storageRef(storage, `users/${uuid}/${imageName}`);
  const uploadTask = await uploadBytes(loc, imageData);
  return getDownloadURL(uploadTask.ref).then((url) => {
    console.log(url);
    return url;
  });
};

export const checkEmailExist = async (email) => {
  return getDocs(query(collection(db, "users"), where("email", "==", email)));
};

const saveUserDetail = async (uuid, userDetails) => {
  const { account_type, name, first_name, last_name, photoUrl } = userDetails;
  await updateProfile(auth.currentUser, {
    displayName: account_type == 1 ? name : `${first_name} ${last_name}`,
    photoURL: photoUrl
  });
  return await setDoc(doc(db, "users", uuid), userDetails);
};
