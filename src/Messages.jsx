import React, { useState, useEffect } from 'react';
import app from './firebaseConfig';
import Title from './Title';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import Comments from './Comments';
import Notification from './Notification';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [likedMessages, setLikedMessages] = useState(new Set());
    const [currentMessageId, setCurrentMessageId] = useState(null);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const db = getDatabase(app);
        const dbRef = ref(db, 'messages');

        onValue(dbRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const messagesArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                    timestamp: formatDistanceToNow(new Date(data[key].timestamp), { addSuffix: true }),
                }));
                setMessages(messagesArray);
                // Update liked messages
                const liked = new Set(messagesArray.filter(msg => msg.likedBy?.includes(/* User ID */)).map(msg => msg.id));
                setLikedMessages(liked);
            } else {
                setMessages([]);
            }
        });
    }, []);

    const handleLike = (id) => {
        const db = getDatabase(app);
        const messageRef = ref(db, `messages/${id}`);
        const isLiked = likedMessages.has(id);

        update(messageRef, {
            likes: (messages.find(msg => msg.id === id)?.likes || 0) + (isLiked ? -1 : 1),
            likedBy: isLiked ? null : [/* User ID */], // Manage the list of users who liked
        });

        // Update local state
        setLikedMessages(prev => {
            const newLikedMessages = new Set(prev);
            if (isLiked) {
                newLikedMessages.delete(id);
            } else {
                newLikedMessages.add(id);
            }
            return newLikedMessages;
        });
    };

    const handleCommentSent = () => {
        setNotification({ message: 'Comment sent successfully!', type: 'success' });
    };

    const handleCancelComment = () => {
        setCurrentMessageId(null); // Close comment input
    };

    const handleCommentError = (error) => {
        setNotification({ message: error, type: 'error' });
    };

    return (
        <>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            {messages.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
                    <p>No messages available.</p>
                </div>
            ) : (
                <>
                    <Title />
                    {messages
                        .slice()
                        .reverse() // Show most recent messages on top
                        .map((item) => (
                            <div key={item.id} className="border-2 border-gray-600 rounded-lg p-4">
                                <h1 className="text-xl font-bold">{item.name}</h1>
                                <p>{item.message}</p>
                                <div className="text-sm text-gray-400 my-2">
                                    {item.timestamp}
                                </div>
                                <button
                                    onClick={() => handleLike(item.id)}
                                    className={`text-xl pr-2 ${likedMessages.has(item.id) ? 'text-pink-500' : 'text-white'}`}
                                >
                                    <FontAwesomeIcon icon={likedMessages.has(item.id) ? faHeartSolid : faHeartOutline} />
                                    <span className="ml-2">{item.likes || 0}</span>
                                </button>
                                <button
                                    onClick={() => setCurrentMessageId(item.id === currentMessageId ? null : item.id)} // Toggle comment input
                                    className="text-xl pl-2 text-white"
                                >
                                    <FontAwesomeIcon icon={faComment} />
                                    <span className="ml-2">{item.comments ? Object.keys(item.comments).length : 0}</span>
                                </button>
                                {currentMessageId === item.id && (
                                    <Comments
                                        messageId={item.id}
                                        comments={item.comments}
                                        onCommentSent={handleCommentSent}
                                        onCommentError={handleCommentError}
                                        onCancel={handleCancelComment} // Pass handleCancelComment to Comments
                                    />
                                )}
                                {item.comments && (
                                    <div className="mt-2">
                                        {Object.keys(item.comments).map(commentId => (
                                            <div key={commentId} className='border-2 border-gray-500 rounded-lg p-2 mt-2'>
                                                <p className='text-slate-50 font-bold'>{item.comments[commentId].name}</p>
                                                <p className='text-slate-50'>{item.comments[commentId].message}</p>
                                                <p className='text-gray-400 text-sm mt-2'>{formatDistanceToNow(new Date(item.comments[commentId].timestamp), { addSuffix: true })}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </>
            )}
        </>
    );
};

export default Messages;
