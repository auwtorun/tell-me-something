import React, { useState, useEffect } from 'react';
import app from "./firebaseConfig";
import Title from './Title';
import { getDatabase, ref, onValue } from "firebase/database";
import { formatDistanceToNow } from 'date-fns';

const Messages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const dbRef = ref(db, "messages");

        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const messagesArray = Object.values(data).map((item) => ({
                    ...item,
                    timestamp: formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }), // Format the timestamp
                }));
                setMessages(messagesArray);
            } else {
                setMessages([]);
            }
        });
    }, []);

    return (
        <>
            {messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
                    <p>No messages available.</p>
                </div>
            ) : (
                <>
                <Title></Title>
                {messages.map((item, index) => (
                    <div key={index} className="border-2 border-gray-600 rounded-lg p-4 my-2">
                        <h1 className="text-xl font-bold">{item.name}</h1>
                        <p>{item.message}</p>
                        <div className="text-sm text-gray-400">
                            {item.timestamp}
                        </div>
                    </div>
                    ))}
                </>
            )}
        </>
    );
};

export default Messages;
