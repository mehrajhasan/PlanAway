import React from 'react';
import { StarIcon } from 'lucide-react';


const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "PlanAway made organizing our group trip to Europe so much easier. Everyone could contribute and we stayed on budget!",
      author: "Sarah M.",
      role: "Travel Enthusiast"
    },
    {
      id: 2,
      text: "The collaboration features are amazing. My family could all add suggestions and we ended up with the perfect itinerary.",
      author: "Mike R.",
      role: "Family Traveler"
    },
    {
      id: 3,
      text: "Best travel planning app I've used. The expense splitting feature saved us so much hassle during our trip.",
      author: "Jessica L.",
      role: "Digital Nomad"
    }
  ];

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="star-icon" size={18} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p>"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.author}</strong>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;