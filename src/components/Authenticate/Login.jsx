import React, {useState} from 'react';
import Requester from "../tools/Requester";
import {Navigate, useNavigate} from 'react-router-dom';

function Login({...props}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = Requester('POST', 'http://127.0.0.1:8000/users/login/', JSON.stringify({email, password}));

            if (response.ok) {
                const data = JSON.parse(response.responseText);
                const token = data.access;

                localStorage.setItem('token', token);
                console.log("Успешно");
                navigate('/');

            } else {
                setError('Ошибка аутентификации');
            }
        } catch (error) {
            setError('Authentication failed');
        }
    };
    console.log(props.isAuthenticated());
    if (props.isAuthenticated()) {
        return <Navigate to="/" replace/>;
    }

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;