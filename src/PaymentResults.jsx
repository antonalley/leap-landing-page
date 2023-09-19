import NavBar from "./NavBar";

export default function PaymentResult({success}){
    return (
        <div>
            <NavBar setBetaOpen={()=>{}}></NavBar>
            <div>
                <h2>Payment was a {success}</h2>
            </div>
        </div>
    )
}