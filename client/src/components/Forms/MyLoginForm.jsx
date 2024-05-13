import React, {useState} from 'react';
import {setCookie} from "../../tools/setCookie";
import {getCookie} from "../../tools/getCookie";
import {Navigate} from "react-router-dom";
import MyLoader from "../Loader/MyLoader";


function MyLoginForm({ access, setAccess, refresh, setRefresh, loading, setLoading, error, setError, ...props }) {
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');

    const submitHandler = e => {
        e.preventDefault();
        setLoading(true);
        fetch(
            '/api/token/obtain',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: JSON.stringify({
                    username: formUsername,
                    password: formPassword,
                }),
            }
        )
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw Error(`Something went wrong: code ${response.status}`);
                }
            })
            .then(({ access, refresh }) => {
                setCookie('accessToken', access, 1);
                setAccess(access);
                setCookie('refreshToken', refresh, 7);
                setRefresh(refresh);
                setError(null);
            })
            .catch(error => {
                console.log(error);
                setError('Ошибка, подробности в консоли');
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex justify-center items-center h-screen bg-orange-100">
            {!access ?
                loading ?
                    <MyLoader/>
                    :
                    <form className="max-w-md w-full p-4 bg-white shadow-md rounded-md relative"
                          onSubmit={submitHandler}>
                        <input type="text" name="username" value={formUsername}
                               onChange={e => setFormUsername(e.target.value)} placeholder="Username"
                               className="mb-4 p-2 w-full border border-gray-300 rounded-md"/>
                        <input type="password" name="password" value={formPassword}
                               onChange={e => setFormPassword(e.target.value)} placeholder="Password"
                               className="mb-4 p-2 w-full border border-gray-300 rounded-md"/>
                        <input type="submit" name="submit" value="Войти"
                               className="p-2 w-full bg-orange-600 text-white rounded-md cursor-pointer hover:bg-orange-700 transition duration-300 mb-2"/>
                        {error && <p className="text-red-500 absolute bottom-0 left-0 w-full text-center">{error}</p>}
                    </form>
                :
                <Navigate to="/" replace/>
            }
        </div>
    );
}

export default MyLoginForm;