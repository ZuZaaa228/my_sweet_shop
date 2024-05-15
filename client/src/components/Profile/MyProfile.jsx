import React, { useEffect, useState } from 'react';

const UserProfile = ({ setLoading, setRefreshRequired, loading, access, isAuthenticate, ...props }) => {
    const [userData, setUserData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        phoneNumber: '',
        date_joined: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', {
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': `Bearer ${access}`,
                    },
                });
                if (response.ok) {
                    const { data } = await response.json();
                    setUserData(data);
                } else {
                    throw new Error(`Failed to fetch user data: ${response.status}`);
                }
            } catch (error) {
                if (error.message === 'refresh') {
                    setRefreshRequired(true);
                } else {
                    console.error('Error fetching user data:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        if (access) {
            setLoading(true);
            fetchUserData();
        }
    }, [access, setLoading, setRefreshRequired]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <div className="max-w-full md:max-w-fit mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Профиль</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2 gap-4w-full">
                <div className="flex items-center bg-gray-100">
                    <span className="font-semibold mr-2">Имя пользователя:</span>
                    <div className=" rounded py-2 px-4">{userData.username}</div>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold mr-2">Имя:</span>
                    <div className=" rounded py-2 px-4">{userData.first_name}</div>
                </div>
                <div className="flex items-center bg-gray-100 md:bg-white">
                    <span className="font-semibold mr-2">Фамилия:</span>
                    <div className=" rounded py-2 px-4">{userData.last_name}</div>
                </div>
                <div className="flex items-center md:bg-gray-100">
                    <span className="font-semibold mr-2 ">Электронная почта:</span>
                    <div className=" rounded py-2 px-4 max-w">{userData.email}</div>
                </div>
                <div className="flex items-center bg-gray-100">
                    <span className="font-semibold mr-2">Номер телефона:</span>
                    <div className=" rounded py-2 px-4">{userData.phoneNumber}</div>
                </div>
                <div className="flex items-center">
                    <span className="font-semibold mr-2">Дата регистрации:</span>
                    <div className=" rounded py-2 px-4">
                        {formatDate(userData.date_joined)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
