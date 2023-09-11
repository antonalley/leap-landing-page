import { addToWaitlist } from "./functions/api"


export default function Home(){

    async function joinWaitlist(e){
        e.preventDefault();
        await addToWaitlist(e.refs.email.value, e.refs.companyName.value);
    }
    return (
        <div id='home'>
            <section className="description">
                <h2>Service Leap CRM</h2>
                <p>
                    Easy to use all-encompassing tool for managing your personal window servicing business
                </p>
            </section>
            <section className="options">
                <div>
                    <h2>Get Beta Access</h2>
                    <p>Gain access to our beta version for just $5.</p>
                    <button className="pay-button">$5 Pay Now</button>
                </div>
                <div>
                    <h2>Join the Waitlist</h2>
                    <form onSubmit={joinWaitlist}>
                    <input ref="companyName" type="text" placeholder="Enter your Company name" />
                    <input ref="email" type="email" placeholder="Enter your email" />
                    <button type="submit">Join</button>
                    </form>
                </div>
                
            </section>
        </div>
    )
}