import './Home.css';
import { useEffect, useRef, useState } from "react";
import { addToWaitlist, createAccount, getFile } from "./functions/api"
import { Dialog, DialogTitle, Grid, ListItem, Modal, Paper, TextField, Typography } from "@mui/material";
import { Button } from "@mui/base";
import { Box, Stack } from "@mui/system";
import NavBar from './NavBar';

function Home() {
    
    const companyName = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const [joinedWaitlist, setjoinedWaitlist] = useState(null);
    const [betaOpen, setBetaOpen] = useState(false);
    const [createdAccount, setCreatedAccount] = useState(false);
    const [accountCreateError, setAccountCreateError] = useState(false);
    
    const [groupPicURL, setGroupPicURL] = useState(null)

    async function joinWaitlist(e) {
        e.preventDefault();
        await addToWaitlist(email.current.value, companyName.current.value);
        setjoinedWaitlist(companyName.current.value);
    }

    function betaClose() {
        setBetaOpen(false);
    }

    async function createAdminAccount(e) {
        e.preventDefault();
        let success = await createAccount(email.current.value, password.current.value, companyName.current.value);
        if (success) {
            setCreatedAccount(true)
            setBetaOpen(false);
        } else {
            setAccountCreateError(true);
        }
    }

    const [headerVideoURL, setHeaderVideoURL] = useState(null);

    useEffect(() => {
        async function getVideoUrl() {
            let url = await getFile("IMG_2258.mp4")
            setHeaderVideoURL(url);

            let groupPic = await getFile("serviceleapgroup.JPG")
            setGroupPicURL(groupPic);
        }
        getVideoUrl();
    }, [])

    function goToEA(){
        window.location = "/earlyadopter";
    }


    return (
        <div className="landing-page">
            <NavBar />
            <div>
                <div id="video-header-container">
                    <div id="video-overlay">
                        <div style={{ maxWidth: '75%', wordWrap: 'normal' }}>
                            <div style={{ fontSize: '2.3em' }}>The CRM built for Window Washers</div>
                            <div style={{ fontSize: '0.7em', maxWidth: '40%', marginLeft: '20px' }}>Are you a small window washer looking to grow your business? Our CRM helps you manage sales and streamline operations so you can focus on growing your company and brand.</div>
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
                        <div className='timeline description-section'>
                            <h2>Product Timeline</h2>
                            <div className="timeline-point completed">
                                <div className="timeline-marker"></div>
                                Early Adopters Sign up
                            </div>
                            <div className="timeline-point completed">
                                <div className="timeline-marker"></div>
                                Calulator App release
                            </div>
                            <div className="timeline-point">
                                <div className="timeline-marker"></div>
                                Accept payments from calculator App
                            </div>
                            <div className="timeline-point">
                                <div className="timeline-marker"></div>
                                Customer List, editing, and filtering
                            </div>
                            <div className="timeline-point">
                                <div className="timeline-marker"></div>
                                Map with Markers
                            </div>
                            <div className="timeline-point">
                                <div className="timeline-marker"></div>
                                Sales Tools
                            </div>
                        </div>
                        <div className='mission description-section'>
                            <h2>Mission</h2>
                            
                            <p>{groupPicURL && <img id="mission-img" src={groupPicURL} alt="Mission"></img>}
                            At Service Leap, we're dedicated to enabling you in constructing your first business. We provide training and essential tools that empower anyone, including you, to earn thousands of dollars monthly, or even weekly, through starting and running your service business effectively.
                            
                            With our custom CRM designed for Window Servicing, not only do you receive these tools at no monthly cost but you will also gain access to our customer trading system. Here, you can build a client list, establish your brand, gain experience, and earn respect. You can even sell your business for a substantial profit when it comes time for you to embark on your next venture.

                            Service Leap is your partner on the path to financial freedom. Are you ready to take the leap?</p>
                        
                        </div>
                    </section>
                    <section className="options row-col-adapt">
                        <div>
                            <h2>Become an Early Adopter</h2>
                            <ul className='points'>
                                <li>Exclusive Access to the most recent version of the app</li>
                                <li>We will highly consider your input on features</li>
                                <li>Get 1 month free on product release (~200$ Value)</li>
                            </ul>
                            <button className="pay-button" onClick={goToEA}>Learn More</button>
                        </div>
                        <Dialog
                            open={createdAccount}
                            onClose={() => setCreatedAccount(false)}
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
                                            <Button variant="outlined" color="error" onClick={() => setBetaOpen(false)}>Cancel</Button>
                                        </ListItem>
                                        <ListItem>
                                            {accountCreateError && <div style={{ color: "red" }}>Failed to create account. Try again.</div>}
                                        </ListItem>
                                    </form>

                                </Stack>
                            </Paper>

                        </Dialog>
                        {!joinedWaitlist ?
                            <div>
                                <h2>Join the Waitlist</h2>
                                <ul className='points'>
                                    <li>Get updates on app progress</li>
                                    <li>Get notified when stable version is launched</li>
                                    <li>Discount first month of use</li>
                                </ul>
                                <form onSubmit={joinWaitlist}>
                                    <input ref={companyName} type="text" placeholder="Enter your Company name" />
                                    <input ref={email} type="email" placeholder="Enter your email" />
                                    <button type="submit">Join Waitlist</button>
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
        </div>
    );
}

export default Home;
