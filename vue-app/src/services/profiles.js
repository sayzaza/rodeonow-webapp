import store from "@/store";
import {
    getDownloadURL,
    getStorage,
    ref as storageRef
} from "firebase/storage";
import { doc, getDoc, getFirestore } from '@firebase/firestore';

export const getProfileImageById = ({ id, account_type }) => {
    const storage = getStorage();
    const spaceRef = storageRef(storage, `/users/${id}/profile.jpg`);
    return getDownloadURL(spaceRef).catch((error) => {
        console.error(error);
        if (account_type == 2)
            return require("@/assets/images/contestant.png");
        else if (account_type == 3)
            return require("@/assets/images/rodeo-fan.png");
        else return require("@/assets/images/contractor.png");
    });
};

export async function userProfileCallback(profile) {
    store.commit('SET_SELECTED_PROFILE', null)
    const db = getFirestore();
    profile.photo_url = await getProfileImageById(profile);
    if (!profile.current_accessed_account) return profile;
    store.dispatch("bindRef", {
        key: "selectedProfile",
        ref: doc(db, "users", profile.current_accessed_account),
        callback: async (prof) => {
            prof.photo_url = await getProfileImageById(prof);
            return prof;
        }
    });
    return profile;
}

export async function getUserAccessibleProfiles(profile) {
    const db = getFirestore();
    if (
        profile &&
        profile.account_access &&
        Object.keys(profile.account_access).length > 0
    ) {
        const promises = Object.keys(profile.account_access)
            .filter((id) => profile.account_access[id])
            .map(async (id) => {
                const snapDoc = await getDoc(doc(db, "users", id));
                return {
                    ...snapDoc.data(),
                    id: snapDoc.id,
                    photo_url: await getProfileImageById({ 
                        id: snapDoc.id,
                        account_type: snapDoc.data().account_type 
                    })
                };
            });
        return Promise.allSettled(promises).then((results) => {
            let accessible_accounts = [
                profile,
                ...results.map((res) => res.value)
            ];
            store.commit("SET_ACCESSIBLE_PROFILES", accessible_accounts);
        });
    }

}