import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import MyHeader from "./components/Header/MyHeader";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MyHeader />} />
                <Route path="/login" element={<MyHeader />} />
                <Route path="/profile" element={<MyHeader />} />
                <Route path="/catalog" element={<MyHeader />} />
                <Route path="/cart" element={<MyHeader />} />
                <Route path="/orders" element={<MyHeader />} />
            </Routes>
        </BrowserRouter>
    )
        ;
}

export default App;
