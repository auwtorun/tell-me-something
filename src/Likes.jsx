import React, { useState } from 'react';
import { getDatabase, ref, update } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const Likes = ({ id, likes = 0, likedBy }) => {
    const [likedMessages, setLikedMessages] = useState(new Set());

    const handleLike = () => {
        const db = getDatabase(app);
        const messageRef = ref(db, `messages/${id}`);
        const isLiked = likedMessages.has(id);

        update(messageRef, {
            likes: likes + (isLiked ? -1 : 1),
            likedBy: isLiked ? null : [/* User ID */], // Manage the list of users who liked
        });

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

    return (
        <button
            onClick={handleLike}
            className={`text-xl pr-2 ${likedMessages.has(id) ? 'text-pink-500' : 'text-gray-500'}`}
        >
            <FontAwesomeIcon icon={likedMessages.has(id) ? faHeartSolid : faHeartOutline} />
            <span className="ml-2">{likes || 0}</span>
        </button>
    );
};

export default Likes;
