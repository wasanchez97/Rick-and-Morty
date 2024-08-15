// src/components/Loader.jsx
import React from 'react';
import './styles/Loader.css'; // Asegúrate de crear este archivo

const Loader = () => {
  return (
    <div className='loader'>
      <div className='container'>
        <img src='/img/Rick.png' alt='Rick' className='image-rick'/>
        <span className='loading-text'>Loading...</span>
        <img src='/img/Morty.png' alt='Morty' className='image-morty' />
      </div>
    </div>
  );
};

export default Loader;
