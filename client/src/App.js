import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {getCookie} from './tools/getCookie';
import {setCookie} from './tools/setCookie';
import MyLoginForm from "./components/Forms/MyLoginForm";
import MyHeader from "./components/Header/MyHeader";


function App() {
    const [access, setAccess] = useState(getCookie('accessToken'));
    const [refresh, setRefresh] = useState(getCookie('refreshToken'));
    const [refreshRequired, setRefreshRequired] = useState(false);
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [error, setError] = useState('');
    const csrftoken = getCookie('csrftoken');
    const [loading, setLoading] = useState(false); // Добавлено состояние loading

    useEffect(() => {
        if (access) {
            fetch(
                '/api/user',
                {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': `Bearer ${access}`,
                    },
                }
            )
                .then(response => {
                    if (response.ok) {
                        setIsAuthenticate(true)

                        return response.json();
                    } else {
                        console.log(response.status, response.statusText);
                        if (response.status === 401 && response.statusText === "Unauthorized") {
                            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                            document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                        }
                        throw Error(`Something went wrong: code ${response.status}`);
                    }
                })
                .catch(error => {
                    if (error.message === 'refresh') {
                        setRefreshRequired(true);
                    } else {
                        console.log(error);
                        setError('Ошибка, подробности в консоли');
                    }
                });
        }
    }, [access]);

    useEffect(() => {
        if (refreshRequired) {
            fetch(
                '/api/token/refresh',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({refresh})
                }
            )
                .then(response => {
                    if (response.ok) {

                        return response.json();
                    } else {
                        throw Error(`Something went wrong: code ${response.status}`);
                    }
                })
                .then(({access, refresh}) => {
                    setCookie('accessToken', access, 1);
                    setAccess(access);
                    setCookie('refreshToken', refresh, 7);
                    setRefresh(refresh);
                    setError(null);
                })
                .catch(error => {
                    console.log(error);
                    setError('Ошибка, подробности в консоли');
                });
        }
    }, [refreshRequired]);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <MyHeader isAuthenticate={isAuthenticate}/>
                            "Главная"
                        </>}/>
                    <Route path="/login" element={

                        <MyLoginForm
                            access={access}
                            setAccess={setAccess}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            loading={loading}
                            setLoading={setLoading}
                            error={error}
                            setError={setError}
                        />

                    }/>
                    <Route path="/profile" element={
                        <>
                            <MyHeader isAuthenticate={isAuthenticate}/>
                            "Профиль"
                        </>
                    }/>
                    <Route path="/catalog" element={
                        <>
                            <MyHeader isAuthenticate={isAuthenticate}/>
                            "Каталог"
                        </>}/>
                    <Route path="/cart" element={
                        <>
                            <MyHeader isAuthenticate={isAuthenticate}/>
                            "Корзина"
                        </>}/>
                    <Route path="/orders" element={<>
                        <MyHeader isAuthenticate={isAuthenticate}/>
                        "Заказы"
                    </>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
