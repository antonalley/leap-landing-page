import { addDoc, collection, doc, setDoc } from "@firebase/firestore";
import { db } from "./fb_init";
import { createUserWithEmailAndPassword, getAuth } from "@firebase/auth";


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
        } else{
            return false;
        }
        return true;
    } catch {
        return false;
    }
    
}