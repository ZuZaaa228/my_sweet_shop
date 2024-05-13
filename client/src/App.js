import {useEffect, useState} from 'react';
import './App.css';

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function App() {
    const [access, setAccess] = useState(localStorage.getItem('accessToken'));
    const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'));
    const [refreshRequired, setRefreshRequired] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formUsername, setFormUsername] = useState('');
    const [formPassword, setFormPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dateJoined, setDateJoined] = useState('');
    const [error, setError] = useState('');
    const csrftoken = getCookie('csrftoken');
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
                        return response.json();
                    } else {
                        throw Error(`Something went wrong: code ${response.status}`);
                    }
                })
                .then(({data}) => {
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setUsername(data.username);
                    setEmail(data.email);
                    setDateJoined(data.date_joined);
                    setError(null);
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
                    localStorage.setItem('accessToken', access);
                    setAccess(access);
                    localStorage.setItem('refreshToken', refresh);
                    setRefresh(refresh);
                    setError(null);
                })
                .catch(error => {
                    console.log(error);
                    setError('Ошибка, подробности в консоли');
                });
        }
    }, [refreshRequired]);

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
            .then(({access, refresh}) => {
                localStorage.setItem('accessToken', access);
                setAccess(access);
                localStorage.setItem('refreshToken', refresh);
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
        <div className="App">
            {error ? <p>{error}</p> : null}
            {!access ?
                loading ? "Загрузка..." :
                    <form className="loginForm" onSubmit={submitHandler}>
                        <input type="text" name="username" value={formUsername}
                               onChange={e => setFormUsername(e.target.value)} placeholder="Username"/>
                        <input type="password" name="password" value={formPassword}
                               onChange={e => setFormPassword(e.target.value)} placeholder="Password"/>
                        <input type="submit" name="submit" value="Войти"/>
                    </form>
                :
                !error ?
                    <div className="Profile">
                        <h1>{firstName} {lastName}</h1>
                        <h2>{username}</h2>
                        <p>email: {email}</p>
                        <p>Профиль создан {dateJoined}</p>
                    </div>
                    :
                    null
            }
        </div>
    );
}

export default App;
