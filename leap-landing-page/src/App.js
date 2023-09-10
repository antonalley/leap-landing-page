import './App.css';
import Home from './Home';
import {useEffect} from 'react'

function App() {
  useEffect(() => {
    // Add a class to trigger the animation when the component mounts
    document.querySelector('header').classList.add('animate');
    document.querySelectorAll('section').forEach(q => {
      q.classList.add('animate');
    }) 
  }, []);
  return (
    <div className="landing-page">
      <header>
        <a style={{fontSize:'2rem'}}>Service Leap</a>
      </header>
      <Home />
    </div>
  );
}

export default App;
