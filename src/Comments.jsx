import React, { useState } from 'react';
import { getDatabase, ref, update } from 'firebase/database';
import app from './firebaseConfig';

const Comments = ({ messageId, comments = {}, onCommentSent, onCancel, onCommentError }) => {
    const [replyName, setReplyName] = useState('');
    const [replyComment, setReplyComment] = useState('');

    const handleComment = async () => {
        if (!replyName.trim()) {
            onCommentError('Name cannot be empty.');
            return;
        } else if (!replyComment.trim()) {
            onCommentError('Message cannot be empty.');
            return;
        }

        const db = getDatabase(app);
        const commentRef = ref(db, `messages/${messageId}/comments`);
        const newComment = {
            name: replyName,
            message: replyComment,
            timestamp: new Date().toISOString(),
        };

        try {
            await update(commentRef, {
                [Date.now()]: newComment, // Use a timestamp as key for comments
            });
            setReplyName('');
            setReplyComment('');
            onCommentSent(); // Notify parent about successful comment
            onCancel(); // Close the comment input
        } catch (error) {
            onCommentError('Failed to comment. Please try again.');
        }
    };

    return (
        <div className="mt-4">
            <input
                type="text"
                value={replyName}
                onChange={(e) => setReplyName(e.target.value)}
                placeholder="Your name"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
            />
            <input
                type="text"
                value={replyComment}
                onChange={(e) => setReplyComment(e.target.value)}
                placeholder="Your comment"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-2"
            />
            <div className="flex space-x-2">
                <button
                    onClick={handleComment}
                    className="bg-green-600 text-gray-100 p-2 rounded hover:bg-green-700"
                >
                    Send Comment
                </button>
                <button
                    onClick={onCancel}
                    className="bg-red-600 text-gray-100 p-2 rounded hover:bg-red-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Comments;
