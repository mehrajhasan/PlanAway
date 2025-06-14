import React, { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import GetSmartReccs from '../utils/getSmartReccs';
import GetDesc from '../utils/getDesc';
import { Utensils, Trees, Music, Gem, Heart, Palette, Sparkles } from 'lucide-react';

const TravelAssistant = ({ trip }) => {
    const [recs, setRecs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTag, setSelectedTag] = useState("original");

    useEffect(() => {
        const fetchRecs = async () => {
            if (!trip?.destination){
                return
            }

            setLoading(true);
            const city = trip.destination.split(",")[0];
            const results = await GetSmartReccs(city, selectedTag);
            setRecs(results);
            setLoading(false);
            setTimeout(() => setLoading(false), 0);
        };

        fetchRecs();
    }, [selectedTag, trip]);;

    const tagEmojiMap = {
        original: <Sparkles size={12.5}/>,
        food: <Utensils size={12.5}/>,
        nature: <Trees size={12.5}/>,
        nightlife: <Music size={12.5}/>,
        "hidden gems": <Gem size={12.5}/>,
        romantic: <Heart size={12.5}/>,
        artsy: <Palette size={12.5}/>,
    };


    return (
        <div className="travel-assistant">
            <div className="ta-header">
                <h3 className="ta-text">
                    <div className="reservation-icon" id="ta-icon">
                        <Bot/>
                    </div>
                    <p>Travel Assistant</p>
                </h3>
            </div>
            <div className="ta-body">
                <div className="ta-body-header">
                    <h4>Based on your trip to {trip?.destination?.split(',')[0]}, you might enjoy:</h4>
                </div>
                <div className="ta-suggestions">
                    {recs.length === 0 ? (
                        <p>Loading ideas...</p>
                    ) : (
                        recs.map((place, i) => (
                            <div key={i} className="recc-card">
                                <h4 className="recc-header">{place.name}</h4>
                                <p className="recc-desc">{GetDesc(place)}</p>
                            </div>
                        ))
                    )}
                </div>
                <hr className="ta-divider"/>
                <div className="tag-buttons">
                    {["Original", "Food", "Nature", "Nightlife", "Hidden Gems", "Romantic", "Artsy"].map((tag) => {
                        const key = tag.toLowerCase();
                        return (
                            <button key={tag} className={`tag-pill ${selectedTag === key ? "active" : ""}`} onClick={() => setSelectedTag(key)} style={{display: "flex", alignItems:"center", gap:"7.5px"}}>
                                {tagEmojiMap[key]} {tag}
                            </button>
                        );
                    })}
                    </div>
            </div>
        </div>
    );
};

export default TravelAssistant;