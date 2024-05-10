import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MyHeader from "./components/Header/MyHeader";
import Login from "./components/Authenticate/Login";


function App() {
    const isAuthenticated = () => {
        try {
            if (JSON.parse(localStorage.success) === "Login successfully")
                return true;
        } catch (e) {
            return false;
        }
        return false;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyHeader/>}/>
                <Route path="/login" element={
                    <>
                        <MyHeader isAuthenticated={isAuthenticated}/>
                        <Login isAuthenticated={isAuthenticated}/>
                    </>
                }/>
                <Route path="/profile" element={<MyHeader isAuthenticated={isAuthenticated}/>}/>
                <Route path="/catalog" element={<MyHeader isAuthenticated={isAuthenticated}/>}/>
                <Route path="/cart" element={<MyHeader isAuthenticated={isAuthenticated}/>}/>
                <Route path="/orders" element={<MyHeader isAuthenticated={isAuthenticated}/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
