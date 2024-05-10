import React, {useState} from 'react';

function LogoutButton() {
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/logout/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Передаем токен авторизации
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            // Удаляем токен из localStorage
            localStorage.removeItem('token');

        } catch (error) {
            setError('Logout failed');
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default LogoutButton;
