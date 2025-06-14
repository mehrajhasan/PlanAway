import React, { useEffect, useState } from 'react';

const Notepad = ({ trip }) => {
    const [note, setNote] = useState('');

    useEffect(() => {
        if (!trip?.id) return;
        const savedNote = localStorage.getItem(`note-${trip.id}`);
        if (savedNote) setNote(savedNote);
        else setNote("");
    }, [trip]);

    useEffect(() => {
        if (trip?.id) {
            localStorage.setItem(`note-${trip.id}`, note);
        }
    }, [note, trip]);

    return (
        <div className="notepad">
            <div className="notepad-header">
                <h3>Notes</h3>
            </div>

            <textarea className="notepad-body" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Store any notes/reminders here"/>
        </div>
    );
}

export default Notepad;