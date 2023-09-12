import { useRef, useState } from "react";
import { addToWaitlist, createAccount } from "./functions/api"
import { Dialog, DialogTitle, Grid, ListItem, Modal, Paper, TextField, Typography } from "@mui/material";
import { Button } from "@mui/base";
import { Box, Stack } from "@mui/system";


export default function Home(){
    const companyName = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const [joinedWaitlist, setjoinedWaitlist] = useState(null);
    const [betaOpen, setBetaOpen] = useState(false);
    const [createdAccount, setCreatedAccount] = useState(false);
    const [accountCreateError, setAccountCreateError] = useState(false);

    async function joinWaitlist(e){
        e.preventDefault();
        await addToWaitlist(email.current.value, companyName.current.value);
        setjoinedWaitlist(companyName.current.value);
    }

    function betaClose(){
        setBetaOpen(false);
    }

    async function createAdminAccount(e){
        e.preventDefault();
        let success = await createAccount(email.current.value, password.current.value, companyName.current.value);
        if (success){
            setCreatedAccount(true)
            setBetaOpen(false);
        } else{
            setAccountCreateError(true);
        }
    }

    return (
        <div id='home'>
            <section className="description">
                <h2>Service Leap CRM</h2>
                <p>
                    Easy to use all-encompassing tool for managing your personal window servicing business. BEST CRM OUT THERE
                </p>
            </section>
            <section className="options">
                <div>
                    <h2>Get Beta Access</h2>
                    <p>Exclusive Access to the most recent version of the app<br/>Our Phone Number<br/>Currently the app is a calulator to help calulate the cost to bill customers</p>
                    <button className="pay-button" onClick={()=>setBetaOpen(true)}>Join</button>
                </div>
                <Dialog
                    open={createdAccount}
                    onClose={()=>setCreatedAccount(false)}
                    >
                        <DialogTitle>Successfully Created an account</DialogTitle>
                    </Dialog>
                <Dialog
                    open={betaOpen}
                    onClose={betaClose}
                    >
                        <DialogTitle>Create an admin account for your company</DialogTitle>
                    <Paper elevation={3}>
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
                            <ListItem>
                                <Button type="submit" variant="contained" color="primary">Create Account</Button>
                                <Button variant="outlined" color="error" onClick={()=>setBetaOpen(false)}>Cancel</Button>
                            </ListItem>
                            <ListItem>
                                {accountCreateError && <div style={{color:"red"}}>Failed to create account. Try again.</div>}
                            </ListItem>
                            </form>
                            
                        </Stack>
                    </Paper>

                </Dialog>
                { !joinedWaitlist ?
                <div>
                    <h2>Join the Waitlist</h2>
                    <p>Get updates on app progress,<br/> Get notified when stable version is launched,<br/> Discount first month of use</p>
                    <form onSubmit={joinWaitlist}>
                    <input ref={companyName} type="text" placeholder="Enter your Company name" />
                    <input ref={email} type="email" placeholder="Enter your email" />
                    <button type="submit">Join</button>
                    </form>
                </div>
                    :
                <div>
                    <h2>Welcome {joinedWaitlist && joinedWaitlist}!</h2>
                    <p>Thank you for joining our waitlist!</p>
                    <p>You will receive updates from us soon</p>
                </div>
                }
        
                
            </section>
        </div>
    )
}