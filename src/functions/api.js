import { addDoc, collection, doc, setDoc } from "@firebase/firestore";
import { db } from "./fb_init";


export async function addToWaitlist(email, companyName){
    // TODO
    await addDoc(collection(db, "waitlist"), {
        email: email,
        companyName: companyName
    })
    return true;
}