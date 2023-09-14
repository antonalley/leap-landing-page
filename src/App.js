import './App.css';
import Home from './Home';
import {useEffect} from 'react'
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

// const stripePromise = loadStripe("")

function App() {
  // const stripeOptions = {
  //   clientSecret: '{{CLIENT_SECRET}}'
  // }
  useEffect(() => {
    // Add a class to trigger the animation when the component mounts
    document.querySelector('header').classList.add('animate');
    document.querySelectorAll('section').forEach(q => {
      q.classList.add('animate');
    }) 
  }, []);
  return (
    // <Elements stripe={stripePromise} options={stripeOptions}>
    <div className="landing-page">
      <header>
        <a style={{fontSize:'2rem'}}>Service Leap</a>
      </header>
      <Home />
    </div>
    // </Elements>
  );
}

export default App;
