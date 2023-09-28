import { Button, CircularProgress } from "@mui/material";
import { GetAccountSetupLink, GetStripeAccount, createStripeConnect, updateUserInfo } from "./functions/api";
import { useState, useEffect, useContext } from "react";
import { auth } from "./functions/fb_init";
import './account.css'
import NavBar from "./NavBar";
import { UserInfoContext } from "./App";



function AccountStatus({ accountStatus, userInfo }){
    const [isLoading, setIsLoading] = useState(false);

    async function createAcc(e){
        e.preventDefault();
        setIsLoading(true);
        
        let user_email = auth.currentUser.email //"anton.alley@outlook.com"; // TODO get from user
        let uid = auth.currentUser.uid; // TODO
        console.log(user_email, uid);

        // TODO add in loading visual

        let url = await createStripeConnect(uid, user_email,true);
        if (url){
            window.location.href = url;
        } else{
            console.log("failed")
            setIsLoading(false);
        }
    }

    async function continueAccSetup(e){
        e.preventDefault();
        setIsLoading(true)

        let url = await GetAccountSetupLink(userInfo.stripe_connect_id, true)
        if (url){
            window.location.href = url;
        } else {
            console.log("failed to get link")
            setIsLoading(false)
        }
    }

    return (
        <div style={{display:'flex',flexDirection:'row', minWidth:'20vw', justifyContent:'space-between'}}>
            <div>Account Actions</div>
            <div>
                { accountStatus === "not_paid" ?
                <Button style={{backgroundColor:'var(--rally-green)'}} variant="contained">Pay 5$ for Early Access</Button>
                : accountStatus === "not_setup" ?
                <> {isLoading ? <CircularProgress /> : 
                <Button style={{backgroundColor:'var(--rally-purple)'}} variant="contained" onClick={createAcc}>Setup Payment Account</Button>}
                </>
                 :
                accountStatus === "pending_setup" ?
                <> {isLoading ? <CircularProgress /> : 
                <Button style={{backgroundColor:'var(--rally-purple)'}} variant="contained" onClick={continueAccSetup}>Continue Payment Setup</Button>}
                </>
                
                : accountStatus === "completed_setup" ?
                <div> No Actions </div> : 
                <div>Account Status Error</div>
                }
            </div>
        </div>
    )
}

export default function AccountSettings(){
    const {userInfo} = useContext(UserInfoContext);
    const [accountStatus, setAccountStatus] = useState("completed_setup"); // not_paid | not_setup (connect account) | pending_setup | completed_setup

    useEffect(() => {
        if (userInfo){
            if (!userInfo.status_codes.includes("early_adopter_paid_true")){
                setAccountStatus("not_paid")
            } else if (!userInfo.stripe_connect_id){
                setAccountStatus("not_setup")
            } else if (!userInfo.stripe_connect_status || userInfo.stripe_connect_status != "completed_setup"){
                setAccountStatus("pending_setup")
                // TODO check for updates
            } else {
                setAccountStatus("completed_setup")
            }
        }
        
    }, [userInfo])

    useEffect(() => {
        // Check the URL params to see payment status
        let params = new URLSearchParams(window.location.search);
        let stripe_created = params.get('stripe_created') // Might not need this
        // if (stripe_created === "true"){
        //     setIsStripeCreated(true);
        // } else if (stripe_created === "false"){
        //     // Do Nothing, 
        //     // maybe change the button to create account to continue to create, and change the function it calls
        // }

    }, [])

    async function checkStatus(){
        if (userInfo && !(userInfo.stripe_connect_status && userInfo.stripe_connect_status === "completed_setup") && userInfo.stripe_connect_id){
            // If the account isn't already marked as setup on stripe, check stripe status on the account
            let account = await GetStripeAccount(userInfo.stripe_connect_id, true);
            console.log("stripe_account: ", account)
            if (account.charges_enabled){
                let success = updateUserInfo(userInfo.user_id, {stripe_connect_status:"completed_setup"})
                if (success){
                    // Workaround to make sure the user info updates
                    // TODO: for somereason the snapshot hook in App.js isn't trigerring when it updates here
                    window.location.reload();
                }
            }
        }
    }

    useEffect(()=>{
        // Check the stripe status
        checkStatus()
    },[userInfo])


    function logout(){
        auth.signOut()
        .then(()=>{
            console.log('Signed out')
            window.location.pathname = "/"
        }).catch((error) => {
            console.log("Failed to Logout: ", error)
        })
    }

    // TODO: add email to user info
    return (
        <div className="account-settings-page">
            <NavBar />
            <div className="account-settings-container">

                <div className="account-settings-grid">

                    <div className="settings-row">
                        <div>Company Name</div>
                        <div>{userInfo && userInfo.company_name}</div>
                    </div>
                    <div className="settings-row">
                        <div>Email</div>
                        <div>{userInfo && auth.currentUser.email}</div>
                    </div>
                    <AccountStatus accountStatus={accountStatus} userInfo={userInfo}/>

                    {accountStatus==="completed_setup" && 
                    <div className="settings-row">
                        <div>Go to Payments Dashboard</div>
                        <Button href="https://dashboard.stripe.com" target="_blank" style={{backgroundColor:'var(--rally-purple)', color:'white'}}>To Stripe</Button>
                    </div>
                    }
                    <Button style={{backgroundColor:'red'}} variant="contained" onClick={logout}>Logout</Button>
                </div>
            </div>
        </div>
    )
}