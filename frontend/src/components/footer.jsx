import React from 'react';


const Footer = () => {
  const footerLinks = {
    product: [
        { name: 'Features', href: '#features' }
    ],
    company: [
        { name: 'About Us', href: '/about' }
    ],
    support: [
        { name: 'Contact', href: '/contact' }
    ],
    legal: [
        { name: 'Privacy', href: '#' }
    ]
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section footer-brand">
          <h3>PlanAway</h3>
          <p>Making travel planning effortless and collaborative for everyone.</p>
        </div>

        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            {footerLinks.product.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            {footerLinks.company.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            {footerLinks.support.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            {footerLinks.legal.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 PlanAway. All rights reserved. Made with ❤️ for travelers worldwide</p>
      </div>
    </footer>
  );
};

export default Footer;
