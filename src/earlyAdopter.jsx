import { Paper } from "@mui/material";
import NavBar from "./NavBar";
import './earlyadopter.css'
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#c4f0ff",
			color: "#fff",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#87bbfd" }
		},
		invalid: {
			iconColor: "#ffc7ee",
			color: "#ffc7ee"
		}
	}
}

function PaymentForm(){
    const [success, setSuccess] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        })
    

        if (!error){
            try {
                const {id} = paymentMethod
                // axios request to backend
            } catch (error){
                console.log(error)
            }
        }
    }

    return (
        <>
        {!success ?
        <form onSubmit={handleSubmit}>
            <fieldset className="FormGroup">
                <div className="FormRow">
                    <CardElement option={CARD_OPTIONS}/>
                </div>
            </fieldset>
            <button>Pay</button>

        </form>
        : 
        <div>
            <span>Payment Successful</span>
        </div>}

        </>
    )
}


export default function EarlyAdopter(){

    return (
        <div id="early-adopter">
            <NavBar />
            <div id="early-adopter-form">
                <Paper elevation={3}>
                    <PaymentForm />
                </Paper>
            </div>
        </div>
    )
}