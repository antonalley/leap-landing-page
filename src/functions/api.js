import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "@firebase/firestore";
import { db, functions, storage } from "./fb_init";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { httpsCallable } from "@firebase/functions";

export async function addToWaitlist(email, companyName){
    // TODO
    await addDoc(collection(db, "waitlist"), {
        email: email,
        companyName: companyName
    })
    return true;
}

export async function createAccount(email, password, companyName){
    try{
        console.log('Creating User', email, password, companyName)
        let auth = getAuth();
        let result = await createUserWithEmailAndPassword(auth, email, password);
        if (result && result.user){
            console.log('Adding user to database')
            let uid = result.user.uid;

            await addDoc(collection(db, "users"), {
                account_type: 'admin',
                status_codes: ["mvp_1"],
                user_id: uid,
                company_name: companyName
            })

            return uid;
        } else{
            return false;
        }
    } catch {
        return false;
    }
    
}

export async function getFile(file_name){
    let url = await getDownloadURL(ref(storage, file_name))
    return url;
}

export async function payNowEarlyAdopter(user_id){
    const PAY = httpsCallable(functions, 'payForBeta')
    try {
        let result = await PAY({ user_id : user_id})
        let msg = result.data.message;
        let url = result.data.url
        console.log(msg, url)
        return url;
    } catch(error) {
        console.log('Failed to complete payment: ')
        console.error(error)
        return false;
    }
    
}

export async function userSuccessPayEarlyAdopter(user_id){
    try{
        let userQuery = query(collection(db, "users"), where("user_id", "==", user_id))
        const queryResults = await getDocs(userQuery);
        queryResults.forEach((item) => {
            updateDoc(doc(db, "users", item.id),{
                status_codes: arrayUnion("early_adopter_paid_true")
            })
        })
        return true;
    } catch (error){
        console.error(error);
        return false;
    }
    
}