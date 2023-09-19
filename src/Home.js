import './Home.css';
import { useEffect, useRef, useState } from "react";
import { addToWaitlist, createAccount, getFile, userSuccessPayEarlyAdopter } from "./functions/api"
import NavBar from './NavBar';
import AccountFlow from './AccountDialog';

function Home() {
    const companyName = useRef(null);
    const email = useRef(null);
    const [joinedWaitlist, setjoinedWaitlist] = useState(null);
    const [accountStatus, setAccountStatus] = useState(null);
    const [groupPicURL, setGroupPicURL] = useState(null);
    const [slides1URL, setSlides1URL] = useState(null);
    const [slides2URL, setSlides2URL] = useState(null);

    async function joinWaitlist(e) {
        e.preventDefault();
        await addToWaitlist(email.current.value, companyName.current.value);
        setjoinedWaitlist(companyName.current.value);
    }

    function betaClose() {
        if (accountStatus !== "success"){
            setAccountStatus(null);
        } else {
            setAccountStatus("finished");
        }
    }

    useEffect(() => {
        // Check the URL params to see payment status
        let params = new URLSearchParams(window.location.search);
        let paymentsuccess = params.get('paymentsuccess')
        let uid = params.get('user_id')

        if (paymentsuccess && paymentsuccess === "true"){
            // TODO: verify account
            // TODO: add a key so it can't be replicated ( For security - but we don't really care about that right now)
            setAccountStatus("success")
            // Set indicator in firestore
            userSuccessPayEarlyAdopter(uid);
        }
        else if (paymentsuccess && paymentsuccess === "false"){
            setAccountStatus("failed")
        }

    }, [])

    const [headerVideoURL, setHeaderVideoURL] = useState(null);

    useEffect(() => {
        async function getVideoUrl() {
            let url = await getFile("IMG_2258.mp4")
            setHeaderVideoURL(url);

            let groupPic = await getFile("serviceleapgroup.JPG")
            setGroupPicURL(groupPic);

            let s1 = await getFile("James_slides.MP4")
            setSlides1URL(s1);
            let s2 = await getFile("Trevors_slides.MP4")
            setSlides2URL(s2);
        }
        getVideoUrl();
    }, [])

    return (
        <div className="landing-page">
            <NavBar setBetaOpen={()=>setAccountStatus("createaccount")}/>
            <div>
                <div id="video-header-container">
                    <div id="video-overlay">
                        <div style={{ maxWidth: '75%', wordWrap: 'normal' }}>
                            <div className="vh-title">
                                You have the skills, We have the tools
                            </div>
                            <div className="vh-subtitle" style={{ }}>
                                We have all of the software and connections you need to start your first window servicing business, or grow the business you have made
                            </div>
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
                            We're here to help you take the leap.<br /><br />
                            We are three friends who met in an entrepreneurship class, identified software issues in the window servicing industry, and are creating the perfect solution.<br /><br />
                            Now, we're launching the Leap Community to empower window servicing businesses and individuals jump into this booming industry. Join us as we help you thrive in an industry with over 39,000 new homes being constructed just this year in Utah. <br /><br />
                            Ready to take the leap?
                            </p>
                        
                        </div>
                    </section>
                    <section className="quote-slides row-col-adapt">
                        <div>
                            <div className='slides-overlay'></div>
                            {slides1URL ?
                            <video autoPlay loop muted playsInline id="video-slides-1" className="video-slides">
                                <source src={slides1URL} type="video/mp4" />
                            </video> :
                            <div id="video-slides-1" className="video-slides"></div>
                            }
                            
                            
                        </div>
                        <div>
                        <div className='slides-overlay'></div>
                            {slides2URL ?
                                <video autoPlay loop muted playsInline id="video-slides-2" className="video-slides">
                                    <source src={slides2URL} type="video/mp4" />
                                </video> :
                                <div id="video-slides-2" className="video-slides"></div>
                                }
                        </div>
                    </section> 
                    <section className="options row-col-adapt">
                    {!joinedWaitlist ?
                            <div>
                                <h2>Join the Waitlist</h2>
                                <p className="points">
                                We are slowly releasing all of the software necessary in a fully custom window washing CRM, when we have the entire package finished. We will let you know and you can be one of the first to experience software made just for you.
                                </p>
                                <ul className='points'>
                                    <li>Get updates on app progress</li>
                                    <li>Get notified when stable version is launched</li>
                                    <li>Discount first month of use</li>
                                </ul>
                                <form onSubmit={joinWaitlist}>
                                    <input ref={companyName} type="text" placeholder="Enter your Company name" />
                                    <input ref={email} type="email" placeholder="Enter your email" />
                                    <button type="submit" style={{backgroundColor:'var(--rally-purple)'}}>Join Waitlist</button>
                                </form>
                            </div>
                            :
                            <div>
                                <h2>Welcome {joinedWaitlist && joinedWaitlist}!</h2>
                                <p>Thank you for joining our waitlist!</p>
                                <p>You will receive updates from us soon</p>
                            </div>
                        }
                        <div>
                            <h2>Become an Early Adopter</h2>
                            <p className="points">
                                If you're ready to join young entrepreneurs changing their lives, become an early adopter for just $5. Get all these features and prove your commitment to taking the leap towards financial freedom. 
                            </p>
                            <ul className='points'>
                                <li>Exclusive Access to the most recent version of the app</li>
                                <li>We will highly consider your input on features</li>
                                <li>Get 1 month free on product release (~150$ Value)</li>
                                <li>Access to our private discord server with peer mentorship, advice, and a community of people building their businesses like you</li>
                            </ul>
                            <button className="pay-button" onClick={()=>setAccountStatus("createaccount")} style={{backgroundColor:'var(--rally-green)'}}>Join the Community</button>
                        </div>
                    </section>
                </div>
            </div>
            <AccountFlow accountStatus={accountStatus} onClose={betaClose} setAccountStatus={setAccountStatus}/>
        </div>
    );
}

export default Home;
