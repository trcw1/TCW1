import React from 'react';

const NotFound: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#888', fontSize: '1.2rem' }}>
    <p>404 – page not found</p>
    <a href="/" style={{ color: '#888', textDecoration: 'underline', fontSize: '1rem' }}>Go home</a>
  </div>
);

export default NotFound;
