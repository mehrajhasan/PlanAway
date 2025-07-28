import React from 'react';
import {
  MapIcon,
  PlaneIcon,
  LandmarkIcon,
  CreditCardIcon,
  UsersIcon,
  FileTextIcon
} from 'lucide-react';


const features = [
  {
    icon: <MapIcon className="icon" />,
    title: 'Itinerary Builder',
    desc: 'Build your daily schedule with drag & drop ease.',
  },
  {
    icon: <PlaneIcon className="icon" />,
    title: 'Reservations',
    desc: 'Flights, hotels, restaurants — organized & editable.',
  },
  {
    icon: <LandmarkIcon className="icon" />,
    title: 'Places to Go',
    desc: 'Smart suggestions tailored to your trip\'s season & city.',
  },
  {
    icon: <CreditCardIcon className="icon" />,
    title: 'Expense Splitting',
    desc: 'Track spending, tag friends, and balance costs together.',
  },
  {
    icon: <UsersIcon className="icon" />,
    title: 'Live Collaboration',
    desc: 'Plan together in real-time — synced edits, shared comments.',
  },
  {
    icon: <FileTextIcon className="icon" />,
    title: 'Notes & Docs',
    desc: 'Packing lists, checklists, and trip docs, all in one place.',
  },
];

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="featureName">Your All-in-One Trip Planner</h2>
      <div className="features">
        {features.map((f, idx) => (
          <div className="feature-card" key={idx}>
            <div className="icon-wrap">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
