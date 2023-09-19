import { Dialog, DialogTitle, Grid, ListItem, Modal, Paper, TextField, Typography } from "@mui/material";
import { Button } from "@mui/base";
import { Box, Stack } from "@mui/system";
import { useRef, useState } from "react";
import { createAccount, payNowEarlyAdopter } from "./functions/api";
import './Home.css'

function AccountDialog({ accountStatus, setAccountStatus }){

    const companyName = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const [UID, setUID] = useState(null);

    async function createAdminAccount(e) {
        e.preventDefault();
        let uid = await createAccount(email.current.value, password.current.value, companyName.current.value);
        if (uid) {
            console.log('UID: ', uid)
            setUID(uid);
            setAccountStatus("pay")
        } else {
            setAccountStatus("failed")
        }
    }

    async function paynow(){
        // To Payments page
        if (UID){
            let url = await payNowEarlyAdopter(UID);
            if (url){
                console.log('Going to ', url)
                window.location = url;
            } else {
                console.log('URL not loaded')
            }
        } else {
            console.log("UID is null")
            setAccountStatus("failed")
        }
        
    }
    

    if (!accountStatus){
        return <></>
    }
    else if (accountStatus === "createaccount") {
        return (
            <Stack spacing={2}>
                <form onSubmit={createAdminAccount}>
                    <ListItem>
                        <TextField label="Company Name" type="text" fullWidth inputRef={companyName}></TextField>
                    </ListItem>
                    <ListItem>
                        <TextField label="Email" type="email" fullWidth inputRef={email} ></TextField>
                    </ListItem>
                    <ListItem>
                        <TextField label="Password" type="password" fullWidth inputRef={password}></TextField>
                    </ListItem>
                    <ListItem style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <Button id="create-account-button" type="submit" variant="contained" color="primary">Create Account</Button>
                        <Button id="cancel-button" variant="outlined" color="error" onClick={() => setAccountStatus(null)}>Cancel</Button>
                    </ListItem>
                </form>

            </Stack>
        )            
    }
    else if (accountStatus === "pay"){
        return (
            <div>
                <h2>Pay 5$ To get these benefits: </h2>
                <ul className='points'>
                    <li>Exclusive Access to the most recent version of the app</li>
                    <li>We will highly consider your input on features</li>
                    <li>Get 1 month free on product release (~150$ Value)</li>
                    <li>Access to our private discord server with peer mentorship, advice, and a community of people building their businesses like you</li>
                </ul>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Button color="success" style={{backgroundColor:'green'}} onClick={paynow}>Pay Now</Button>
                </div>
            </div>
        )
    }
    else if (accountStatus === "success"){
        return (
            <div>
                Successfully Created Account, you will be notified shortly.
                <p>Now you can join the discord here: </p>
                <p>Now you can download the app here: </p>
                <p>More information will be sent in an email</p>
            </div>
        )
    }
    else if (accountStatus === "failed"){
        return (
            <div>
                Failed to Create an account. Try again, or for assistance contact Anton Alley 630.943.0041
            </div>
        )
    }
}

export default function AccountFlow({accountStatus, onClose, setAccountStatus}){
    return (
        <Dialog
            open={accountStatus !== null && accountStatus !== 'finished'}
            onClose={onClose}
        >
            <DialogTitle style={{textAlign:'center'}}>Become an Early Adopter</DialogTitle>
            <Paper elevation={0} style={{margin: '20px', padding: '20px', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
                <AccountDialog accountStatus={accountStatus} setAccountStatus={setAccountStatus}/>
            </Paper>
        </Dialog>
    )
}