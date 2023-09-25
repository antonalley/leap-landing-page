import { Button } from "@mui/material";
import { createStripeConnect } from "./functions/api";
import { useState, useEffect } from "react";
import { auth } from "./functions/fb_init";

export default function AccountSettings(){
    const [isStripeCreated, setIsStripeCreated] = useState(false);

    useEffect(() => {
        // Check the URL params to see payment status
        let params = new URLSearchParams(window.location.search);
        let stripe_created = params.get('stripe_created')
        if (stripe_created === "true"){
            setIsStripeCreated(true);
        } else if (stripe_created === "false"){
            // Do Nothing, 
            // maybe change the button to create account to continue to create, and change the function it calls
        }

    }, [])
    async function createAcc(e){
        e.preventDefault();
        
        let user_email = auth.currentUser.email //"anton.alley@outlook.com"; // TODO get from user
        let uid = auth.currentUser.uid; // TODO
        console.log(user_email, uid);

        let url = await createStripeConnect(uid, user_email);
        if (url){
            window.location.href = url;
        } else{
            console.log("failed")
        }
    }
    return (
        <div style={{width:'100%', height: '100%', display: 'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
            {!isStripeCreated ?
            <form onSubmit={createAcc}>
                <Button type="submit">Create Connect Account</Button>
            </form>
            :
            <div>Stripe Account already created!</div>
            }
        </div>
    )
}