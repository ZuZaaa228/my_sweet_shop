import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {getCookie} from './tools/getCookie';
import {setCookie} from './tools/setCookie';
import MyLoginForm from "./components/Forms/MyLoginForm";
import MyHeader from "./components/Header/MyHeader";
import MyProfile from "./components/Profile/MyProfile";
import ProductList from "./components/Products/ProductList";
import Cart from "./components/Cart/Cart";
import Orders from "./components/Orders/Orders";

function App() {
    const [access, setAccess] = useState(getCookie('accessToken'));
    const [refresh, setRefresh] = useState(getCookie('refreshToken'));
    const [refreshRequired, setRefreshRequired] = useState(false);
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [error, setError] = useState('');
    const csrfToken = getCookie('csrftoken');
    const [loading, setLoading] = useState(false);

    console.log(access)

    function refreshRequest() {
        setLoading(true);
        fetch('/api/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refresh})
        })
            .then(response => response.json())
            .then(data => {
                console.log('data refresh', data);
                if (!data.access) {
                    setCookie('accessToken', data.access, 1);
                    setAccess(data.access);
                    setError(null);
                } else {
                    throw new Error('Failed to refresh token');
                }
            })
            .catch(error => {
                console.error('Error refreshing token:', error);
                setError('Ошибка обновления токена');
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        setLoading(true);
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
                        setIsAuthenticate(true)

                        console.log(response.status, response.statusText);
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
                })
        } else {
            setLoading(false);
        }
    }, [access]);

    useEffect(() => {
        if (refreshRequired) {
            refreshRequest();
        }
    }, [refreshRequired]);

    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <>
                            <MyHeader loading={loading} access={access} setLoading={setLoading}
                                      isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate}/>
                            <ProductList setLoading={setLoading} loading={loading} access={access}
                                         refreshRequest={refreshRequest}/>
                        </>
                    }/>
                    <Route path="/login" element={
                        <MyLoginForm csrfToken={csrfToken} access={access} setAccess={setAccess} refresh={refresh}
                                     setRefresh={setRefresh} loading={loading} setLoading={setLoading} error={error}
                                     setError={setError}/>
                    }/>
                    <Route path="/profile" element={
                        <>
                            <MyHeader loading={loading} access={access} setLoading={setLoading}
                                      isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate}/>
                            <MyProfile setLoading={setLoading} loading={loading} access={access}
                                       isAuthenticate={isAuthenticate} setRefreshRequired={setRefreshRequired}/>
                        </>
                    }/>
                    <Route path="/catalog" element={
                        <>
                            <MyHeader loading={loading} access={access} setLoading={setLoading}
                                      isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate}/>
                            <ProductList setLoading={setLoading} loading={loading} access={access}
                                         refreshRequest={refreshRequest}/>
                        </>
                    }/>
                    <Route path="/cart" element={
                        <>
                            <MyHeader loading={loading} access={access} setLoading={setLoading}
                                      isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate}/>
                            <Cart setLoading={setLoading} loading={loading} access={access}
                                  refreshRequest={refreshRequest}/>
                        </>
                    }/>
                    <Route path="/orders" element={
                        <>
                            <MyHeader loading={loading} access={access} setLoading={setLoading}
                                      isAuthenticate={isAuthenticate} setIsAuthenticate={setIsAuthenticate}/>
                            <Orders access={access} refreshRequest={refreshRequest}/>
                        </>
                    }/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
