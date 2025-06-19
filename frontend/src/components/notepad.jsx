import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Notepad = ({ trip }) => {
    const [note, setNote] = useState('');

    useEffect(() => {
        if (!trip?.id) return;

        if (auth.currentUser) {
            setNote(trip.notes?.[0] || "");
        } else {
            const savedNote = localStorage.getItem(`note-${trip.id}`);
            setNote(savedNote || "");
        }
    }, [trip]);

    useEffect(() => {
        if (!trip?.id) return;

        const saveNote = async () => {
            if (auth.currentUser) {
                const tripRef = doc(db, "trips", trip.id);
                await updateDoc(tripRef, {
                    notes: [note]
                });
            } else {
                localStorage.setItem(`note-${trip.id}`, note);
            }
        };

        saveNote();
    }, [note, trip]);

    return (
        <div className="notepad">
            <div className="notepad-header">
                <h3>Notes</h3>
            </div>
            <textarea
                className="notepad-body"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Store any notes/reminders here"
            />
        </div>
    );
};

export default Notepad;
