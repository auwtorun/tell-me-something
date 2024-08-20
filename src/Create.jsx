import React, { useState } from 'react';
import app from './firebaseConfig';
import { getDatabase, ref, set, push } from 'firebase/database';
import Notification from './Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const Create = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState(null);

    const sendData = async () => {
        if (!message.trim()) {
            // Show error notification if message is empty
            setNotification({ message: 'Message cannot be empty.', type: 'error' });
            return;
        } else if (!name.trim() && !isAnonymous) {
            // Show error notification if name is empty and not anonymous
            setNotification({ message: 'Name cannot be empty.', type: 'error' });
            return;
        }
        setIsLoading(true);
        const db = getDatabase(app);
        const newDoc = push(ref(db, 'messages'));
        const timestamp = new Date().toISOString();
        try {
            await set(newDoc, {
                name: isAnonymous ? 'anonymous' : name,
                message: message,
                timestamp: timestamp,
            });
            setNotification({ type: 'success', message: 'Message sent successfully!' });
            setName('');
            setMessage('');
            setIsAnonymous(false);
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to send message. Please try again.' });
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };

    const handleCancel = () => {
        // Reset fields and close modal
        setName('');
        setMessage('');
        setIsAnonymous(false);
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-16 h-16 fixed bottom-5 right-5 p-3 rounded-full shadow-lg bg-slate-500"
            >
                <FontAwesomeIcon icon={faPen} style={{ color: "#ffffff" }} />
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
                    <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg w-96 m-12">
                        <h3 className="text-xl font-semibold mb-4">Tell me something!</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            disabled={isAnonymous}
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                        />
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Your message"
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
                        />
                        <div className="mb-4">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={() => setIsAnonymous(!isAnonymous)}
                                className="mr-2"
                            />
                            <label>Send as anonymous</label>
                        </div>
                        <button
                            onClick={sendData}
                            disabled={isLoading}
                            className={`w-full p-2 ${isLoading ? 'bg-gray-500' : 'bg-green-600'} text-gray-100 rounded hover:${isLoading ? 'bg-gray-600' : 'bg-green-700'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                        >
                            {isLoading ? 'Sending...' : 'Send'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="w-full p-2 mt-2 bg-red-600 text-gray-100 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Render Notification */}
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)} // Close notification when timer expires
                />
            )}
        </>
    );
};

export default Create;
