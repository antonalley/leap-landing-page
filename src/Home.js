import { useEffect, useRef, useState } from "react";
import { addToWaitlist, createAccount, getVideo } from "./functions/api"
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

    const [headerVideoURL, setHeaderVideoURL] = useState(null);

    useEffect(() => {
        async function getVideoUrl(){
            let url = await getVideo("IMG_2258.mp4")
            setHeaderVideoURL(url);
        }
        getVideoUrl();
    }, [])

    return (
        <div>
            <div id="video-header-container">
                <div id="video-overlay">
                    <div style={{maxWidth:'75%', wordWrap:'normal'}}>
                    <div style={{fontSize:'2.3em'}}>The CRM built for Window Washers</div>
                    <div style={{fontSize: '0.7em', maxWidth:'40%', marginLeft:'20px'}}>Are you a small window washer looking to grow your business? Our CRM helps you manage sales and streamline operations so you can focus on growing your company and brand.</div>
                    </div>
                </div>
                {headerVideoURL ?
                <video autoPlay loop muted playsInline id="video-header">
                    <source src={headerVideoURL} type="video/mp4" />
                </video> :
                <div id="video-header"></div>
                }
            </div>
            <div id="home">
            <section className="description">
                <h2>Service Leap CRM</h2>
                <p>
                    Easy to use all-encompassing tool for managing your personal window servicing business
                </p>
            </section>
            <section className="options">
                <div>
                    <h2>Get Beta Access</h2>
                    <ul>
                        <li>Exclusive Access to the most recent version of the app</li>
                        <li>Our Phone Number</li>
                        <li>Currently the app is a calulator to help calulate the cost to bill customers</li>
                    </ul>
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
                    <ul>
                        <li>Get updates on app progress</li>
                        <li>Get notified when stable version is launched</li>
                        <li>Discount first month of use</li>
                    </ul>
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
        </div>
    )
}