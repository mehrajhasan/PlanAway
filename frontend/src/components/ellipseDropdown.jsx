import React from 'react'
import { SquarePen, Trash2 } from 'lucide-react';

const EllipseDropdown = ({ onEdit, onDelete }) => {
    return ( 
        <div className="dropDown">
            <ul className="dropDown-list">
                <li onClick={onEdit}>Edit <SquarePen size={11} color="#0969da" style={{ marginBottom: "-1px"}}/></li>
                <li onClick={onDelete}>Delete <Trash2 size={11} color="red" style={{ marginBottom: "-1px"}}/></li>
            </ul>
        </div>
    )
}

export default EllipseDropdown;