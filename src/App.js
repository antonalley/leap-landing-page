import Home from "./Home";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import EarlyAdopter from "./earlyAdopter";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentResult from "./PaymentResults";

// const stripePromise = loadStripe("pk_live_51NpIzVLKgquOPe9eL7BrpWQAmL2ySbLJDzjLWdV7ypwtNvfapdEOvJkoKsAZTw0a9UeIZqzhGm75M7CK7NVQifTK00FwzGqj66")

export default function App(){
    // TODO: replace with environment var
    // const stripeOptions = {
    //   clientSecret: 'sk_test_51NpIzVLKgquOPe9egtqxZ8NVorGnqPDL5t8ZEi3SbNpTvIl1IpKb5Eaow2JFoSWDmXMhb0GJjT73EN9bvSHwS8ns009fPcFtzF'
    // }
    // options={stripeOptions}>

    return (
        // <Elements stripe={stripePromise}>  
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/paymentsuccess" element={<PaymentResult success={true} />}></Route>
                    <Route path="/paymentfail" element={<PaymentResult success={false} />}></Route>
                    {/* <Route path="/earlyadopter" element={<EarlyAdopter />} /> */}
                </Routes>
            </Router>
        // </Elements>
    )
}