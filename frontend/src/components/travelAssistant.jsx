import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';

const TravelAssistant = ({ trip }) => {
    return (
        <div className="travel-assistant">
            <div className="ta-header">
                <h3 className="ta-text">
                    <div className="reservation-icon" id="ta-icon">
                        <Bot/>
                    </div>
                    <h4>Travel Assistant</h4>
                </h3>
            </div>
            <div className="ta-body">
                <div className="ta-body-header">
                    <h4>Based on your trip to {trip?.destination?.split(',')[0]}, you might enjoy:</h4>
                </div>
                <div className="ta-suggestions">

                </div>
            </div>
        </div>
    );
};

export default TravelAssistant;