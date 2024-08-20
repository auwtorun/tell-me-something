import React, { useEffect } from 'react';

const Notification = ({ type, message, onClose }) => {
    const getClassNames = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-700 text-gray-100';
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Notification disappears after 3 seconds

        return () => clearTimeout(timer); // Clear the timer if the component unmounts
    }, [onClose]);

    return (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg ${getClassNames()} z-50`}>
            <p>{message}</p>
        </div>
    );
};

export default Notification;
