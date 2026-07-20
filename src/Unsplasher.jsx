import React, { useState } from 'react';
import './App.css'; // Importing the modern styles below

export default function UnsplashImageFetcher() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zanra, setZanra] = useState('')

  // Replace with your actual Unsplash Access Key
  const ACCESS_KEY = '6XVMHVFjwx6NFFe5njIlxydh8OrKKKH076rF2nXRdWs'; 

  const fetchImage = async () => {
    setLoading(true);
    setError(null);
    try {
      // Added '&query=drawing' to limit results to drawing-related photos
      const response = await fetch(
        `https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}&query=${zanra}`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setImageUrl(data.urls.regular); 
    } catch (err) {
      setError(err.message || 'Failed to fetch image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Drawing Inspiration</h1>
        <p className="subtitle">Fetch a random drawing or sketch from Unsplash</p>
        
        <button
          onClick={fetchImage}
          disabled={loading}
          className="fetch-btn"
        >
          {loading ? 'Fetching...' : 'Get Drawing'}
        </button>

        {error && <p className="error-msg">{error}</p>}

        <div className="image-frame">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Drawing inspiration from Unsplash"
              className="display-image"
            />
          ) : (
            <div className="placeholder-text">
              <input className='input' onChange={(e)=>setZanra(e.target.value)} value={zanra} type="text" placeholder='What do you want'/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}