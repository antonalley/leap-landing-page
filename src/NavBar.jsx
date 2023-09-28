import {useState, useEffect, useContext, useRef} from 'react'
import { Button } from "@mui/base";
import { UserInfoContext } from './App';
import { Dialog, DialogTitle, List, ListItem, Stack, TextField } from '@mui/material';
import { login } from './functions/api';

export default function NavBar({ setBetaOpen }){
    const [scrolled, setScrolled] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [failedLogin, setFailedLogin] = useState(null);
    const { userInfo } = useContext(UserInfoContext)
    const email = useRef(null);
    const password = useRef(null);

    useEffect(() => {
        // Set header to not opaque after scrolled down 100px
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        window.addEventListener("scroll", handleScroll);
    }, [])


    function goToAccountSettings() {
        window.location.pathname = "/account/settings"
    }

    function loginPopup(){
        setIsLogin(true);
    }

    async function submitLogin(e){
        e.preventDefault();
        let result = await login(email.current.value, password.current.value)
        if (result){
            setIsLogin(false);
        } else {
            setFailedLogin("Failed to Login")
        }
    }

    function goToHome(){
        window.location.pathname = "/"
    }
    return (
        <header className={scrolled ? "header-scrolled" : ""}>
            <div style={{ fontSize: '2rem', cursor:'pointer' }} onClick={goToHome}>Service Leap</div>
            { !userInfo ?
            <div style={{display:'flex', flexDirection:'row', justifyContent: 'space-around'}}>
            <Button variant="contained" onClick={()=>setBetaOpen(true)} style={{backgroundColor:'var(--rally-green)', margin:'0px 20px'}}>Join the Community</Button>
            <Button variant="contained" onClick={loginPopup} style={{backgroundColor:'var(--background-gray)'}}>Login</Button>
            </div>
            :
            <div style={{display:'flex', flexDirection:'row', justifyContent: 'space-around'}}>
            <div style={{fontWeight:'bold', fontSize:'2em', margin:'0px 20px'}}>{userInfo.company_name}</div>
            <Button variant="contained" onClick={goToAccountSettings} style={{backgroundColor:"var(--rally-green)"}}>Account Settings</Button>
            </div>
            }
            <Dialog
                open={isLogin}
                onClose={()=>setIsLogin(false)}
            >
                <DialogTitle>Login</DialogTitle>
                <Stack spacing={2}>
                    <form onSubmit={submitLogin}>
                    <ListItem>
                        <TextField label="Email" type="email" fullWidth inputRef={email} ></TextField>
                    </ListItem>
                    <ListItem>
                        <TextField label="Password" type="password" fullWidth inputRef={password}></TextField>
                    </ListItem>
                    <ListItem>
                        <Button type="submit">Login</Button>
                        {failedLogin && <div style={{color:'red'}}>Failed to Login, try again</div>}
                    </ListItem>
                    </form>
                </Stack>
            </Dialog>
        </header>
    )
}