import AccountSettings from "./AccountSettings";
import Home from "./Home";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useContext, createContext, useState, useEffect } from "react";
import { auth } from "./functions/fb_init";
import { getUserData, getUserDocument } from "./functions/api";
import { onSnapshot } from "firebase/firestore";

export const UserInfoContext = createContext();



export default function App(){
    const [userInfo, setUserInfo] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [snapListening, setSnapListening] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(async user => {
            if (!user) {
                setUserInfo(null)
            }
            else{
                let udata = await getUserData(user.uid);
                setUserInfo(udata);
            }
        })
    }, [])
    

    useEffect(() => {
        if (userInfo && !snapListening){
            async function loadUserDoc(){
                let user_doc = await getUserDocument(auth.currentUser.uid);
                setUserDoc(user_doc)
                setSnapListening(true);
            }
            console.log('load user doc')
            loadUserDoc();
        }
    }, [userInfo])

    useEffect(() => {
        if (userDoc){
            const stopUpdating = onSnapshot(userDoc, (doc) => {
                // If its not waiting to be updloaded to the server still
                if (!doc.metadata.hasPendingWrites){
                    console.log('User data updated', doc.data())
                    setUserInfo(doc.data())
                }
            })
            return () => {
                stopUpdating();
            }
        }
    }, [userDoc])

    return (
            <UserInfoContext.Provider value={{ userInfo }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/earlyadopter" element={<EarlyAdopter />} /> */}
                    <Route path="/account/settings" element={<AccountSettings />} />
                </Routes>
            </Router>
            </UserInfoContext.Provider>
    )
}