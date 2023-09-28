import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "@firebase/firestore";
import { auth, db, functions, storage } from "./fb_init";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "@firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import { httpsCallable } from "@firebase/functions";

export async function getUserData(user_id){
    try{
        const udoc = await getUserDocument(user_id)
        const userDoc = await getDoc(udoc)
        return userDoc.data()
    } catch (error){
        console.error("Error in getting user info", error);
        return false;
    }  
}

export async function getUserDocument(user_id){
    try{
        let userQuery = query(collection(db, "users"), where("user_id", "==", user_id))
        const queryResults = await getDocs(userQuery);
        console.log(queryResults)
        const userDoc = queryResults.docs[0];
        return doc(db, "users", userDoc.id)
    } catch (error){
        console.error("Error in getting user Document", error);
        return false;
    }  
}

export async function updateUserInfo(user_id, updates){
    try {
        const udoc = await getUserDocument(user_id)
        const userDoc = await getDoc(udoc)
        let result = await updateDoc(doc(db, "users", udoc.id), updates);
        return true;

    } catch(error){
        console.error("Failed to update User", error)
        return false;
    }
}

export async function addToWaitlist(email, companyName){
    // TODO
    await addDoc(collection(db, "waitlist"), {
        email: email,
        company_name: companyName
    })
    return true;
}

export async function login(email, password){
    try{
        let result = await signInWithEmailAndPassword(auth, email, password)
        if (result && result.user) {
            console.log("Successfully signed in")
            return true;
        }
        console.log("Failed to login")
        return false;
    } catch (error){
        console.error("Failed to login", error)
        return false;
    }
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

export async function payNowEarlyAdopter(user_id, is_testing=false){
    const PAY = httpsCallable(functions, 'payForBeta')
    try {
        let params = { user_id : user_id, redirect_address: window.location.origin}
        if (is_testing) {params["testing"] = true}
        let result = await PAY(params)
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

export async function createStripeConnect(uid, user_email, is_testing=false){
    const CreateAcc = httpsCallable(functions, "CreateConnectAccount");
    try{
        let params = {user_email: user_email, redirect_address: window.location.origin}
        if (is_testing) {params["testing"] = true}
        let result = await CreateAcc(params);
        let msg = result.data.message;
        let url = result.data.url;
        let customer_id = result.data.connect_account_id;
        // Add customer id to firebase
        console.log("Create Connect account: ", msg, url, customer_id)
        let success = await addStripeConnectToUser(uid, customer_id);
        if (success){
            return url;
        } else return false;
    } catch(error){
        console.error(error)
        return false;
    }
}

export async function addStripeConnectToUser(uid, connect_id){
    console.log('Adding Stripe Connect id to database for user')
    try{
        let userQuery = query(collection(db, "users"), where("user_id", "==", uid))
        const queryResults = await getDocs(userQuery);
        queryResults.forEach((item) => {
            updateDoc(doc(db, "users", item.id),{
                stripe_connect_id: connect_id,
                stripe_connect_status: "pending",
            })
        })
        return true;
    } catch (error){
        console.error("Failed to add connect id to user", error);
        return false;
    }
}

export async function GetStripeAccount(acct_id, is_testing=false){
    const GetStripeAccount = httpsCallable(functions, "GetStripeAccount");
    try{
        let response = await GetStripeAccount({acct_id:acct_id, testing:is_testing})
        let result = response.data;
        if (result.success){
            return result.account
        }
        console.error("Something went wrong getting stripe account: ", result)
        return false;
    } catch(error){
        console.error("Failed to get account info", error)
        return false;
    }
}

export async function GetAccountSetupLink(acct_id, is_testing=false){
    const GetAccountSetupLink = httpsCallable(functions, "GetAccountSetupLink");
    try{
        let response = await GetAccountSetupLink({acct_id:acct_id, testing:is_testing, redirect_address: window.location.origin})
        let result = response.data;
        if (result.success){
            return result.url
        }
        console.error("Something went wrong getting stripe account setup link: ", result)
        return false;
    } catch(error){
        console.error("Failed to get setup link: ", error)
        return false;
    }
}