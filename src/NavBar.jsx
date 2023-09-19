import {useState, useEffect} from 'react'
import { Button } from "@mui/base";

export default function NavBar({ setBetaOpen }){
    const [scrolled, setScrolled] = useState(false);

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

    function goToEA(){
        window.location = "/earlyadopter";
    }

    return (
        <header className={scrolled && "header-scrolled"}>
            <div style={{ fontSize: '2rem' }}>Service Leap</div>
            <Button variant="contained" onClick={()=>setBetaOpen(true)} style={{backgroundColor:'var(--rally-green)'}}>Join the Community</Button>
        </header>
    )
}