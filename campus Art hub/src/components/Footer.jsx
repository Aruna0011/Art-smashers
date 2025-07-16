import React from 'react';
import { Link } from 'react-router-dom';

const pastelColors = [
  '#b39ddb', // lavender
  '#aed581', // pastel green
  '#fff59d', // pastel yellow
  '#81d4fa', // pastel blue
  '#f8bbd0', // pastel pink
];

const Footer = () => {
  const year = new Date().getFullYear();
  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/cart', label: 'Cart' },
    { to: '/contact', label: 'Contact' },
  ];
  return (
    <footer style={{
      width: '100%',
      padding: '40px 0 0 0',
      color: '#eee',
      background: '#23272f',
      borderTop: '1px solid #222',
      marginTop: 'auto',
      fontFamily: 'inherit',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', padding: '0 16px' }}>
        <h2 style={{ fontWeight: 600, fontSize: '2rem', marginBottom: 8, letterSpacing: 1, color: '#fff' }}>Art Smashers</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          {navLinks.map((link, idx) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                display: 'inline-block',
                background: pastelColors[idx % pastelColors.length],
                color: '#23272f',
                border: 'none',
                borderRadius: 20,
                padding: '6px 22px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
                margin: 0,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                letterSpacing: 0.5,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div style={{ color: '#bbb', textAlign: 'center', padding: '12px 0 8px 0', fontSize: '0.98rem', borderTop: '1px solid #222', background: 'transparent' }}>
        © {year} Art Smashers. All rights reserved. Made by Aruna.
      </div>
    </footer>
  );
};

export default Footer; 