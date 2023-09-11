

export default function Home(){
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
                    <p>Gain access to our beta version for just $5</p>
                    <button className="pay-button">$5 Pay Now</button>
                </div>
                <div>
                    <h2>Join the Waitlist</h2>
                    <form>
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit">Join</button>
                    </form>
                </div>
                
            </section>
        </div>
    )
}