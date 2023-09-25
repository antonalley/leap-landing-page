import AccountSettings from "./AccountSettings";
import Home from "./Home";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


export default function App(){
    return (
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/earlyadopter" element={<EarlyAdopter />} /> */}
                    <Route path="/account/settings" element={<AccountSettings />} />
                </Routes>
            </Router>
    )
}