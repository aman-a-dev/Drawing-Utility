import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRandomImage } from '../utils/unsplashService';
import {
  SunIcon, MoonIcon, DownloadIcon, ShareIcon, 
  ExpandIcon, CloseIcon, CancelIcon, ImageIcon 
} from './Icons';
import './App.css';

export default function UnsplashImageFetcher() {
  const [imageData, setImageData] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Ref to hold the AbortController
  const abortControllerRef = useRef(null);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleFetch = useCallback(async () => {
    if (!query.trim()) return; // Prevent fetching if empty

    // Create a new AbortController for this specific request
    abortControllerRef.current = new AbortController();
    
    setIsFetching(true);
    setIsImageLoading(true);
    setError(null);
    
    try {
      const data = await fetchRandomImage(query, abortControllerRef.current.signal);
      setImageData(data);
    } catch (err) {
      if (err.message !== 'Aborted') {
        setError(err.message || 'Failed to fetch inspiration.');
      }
      setIsImageLoading(false);
    } finally {
      setIsFetching(false);
    }
  }, [query]);

  const handleCancel = () => {
    // 1. Abort the network request if it's currently fetching
    if (isFetching && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsFetching(false);
      setIsImageLoading(false);
    }
    
    // 2. Clear the input and reset the canvas
    setQuery('');
    setImageData(null);
    setError(null);
  };

  const handleShare = async () => {
    if (!imageData) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Drawing Inspiration', text: `Check out this art by ${imageData.photographer}`, url: imageData.unsplashUrl });
      } catch (err) { if (err.name !== 'AbortError') showToast('Share cancelled'); }
    } else {
      try { await navigator.clipboard.writeText(imageData.unsplashUrl); showToast('Link copied to clipboard!'); } 
      catch { showToast('Failed to copy link'); }
    }
  };

  // Dynamic button text and state
  const isGetArtDisabled = isFetching || !query.trim();
  const showCancelBtn = query.trim() !== '' || isFetching;

  return (
    <>
      <motion.div className="bg-mesh" key={theme} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

      <div className="container">
        <motion.button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <AnimatePresence mode="wait">
            <motion.div key={theme} initial={{ y: -20, opacity: 0, rotate: -90 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: 20, opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <motion.div className="card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <h1 className="title">Drawing Inspiration</h1>
          <p className="subtitle">Fetch a random sketch, art, or concept from Unsplash</p>

          {/* Search Input */}
          <input 
            className="input" 
            onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && !isGetArtDisabled && handleFetch()} 
            value={query} 
            type="text" 
            placeholder="e.g. Cyberpunk, Landscape..." 
            aria-label="Search query" 
          />

          {/* Button Group: Get Art + Cancel */}
          <div className="button-group">
            <motion.button 
              onClick={handleFetch} 
              disabled={isGetArtDisabled} 
              className="fetch-btn" 
              whileHover={!isGetArtDisabled ? { scale: 1.02 } : {}} 
              whileTap={!isGetArtDisabled ? { scale: 0.95 } : {}}
            >
              {isFetching ? 'Fetching...' : 'Get Art'}
            </motion.button>

            <AnimatePresence>
              {showCancelBtn && (
                <motion.button 
                  className="cancel-btn"
                  onClick={handleCancel}
                  initial={{ opacity: 0, scale: 0.8, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 'auto' }}
                  exit={{ opacity: 0, scale: 0.8, width: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CancelIcon width="16" height="16" />
                  {isFetching ? 'Cancel' : 'Clear'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {error && <motion.p className="error-msg" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{error}</motion.p>}
          </AnimatePresence>

          {/* Image Frame */}
          <motion.div className="image-frame" layout style={{ backgroundColor: imageData?.color || 'var(--skeleton-base)' }}>
            <AnimatePresence mode="wait">
              {isImageLoading && <motion.div key="skeleton" className="skeleton" exit={{ opacity: 0 }} />}
              {!imageData && !isImageLoading && (
                <motion.div key="placeholder" className="placeholder-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ImageIcon />
                  <span>Your canvas awaits...</span>
                </motion.div>
              )}
              {imageData && (
                <motion.img
                  key={imageData.imageUrl}
                  src={imageData.imageUrl}
                  alt="Drawing inspiration"
                  className={`display-image ${!isImageLoading ? 'loaded' : ''}`}
                  onLoad={() => setIsImageLoading(false)}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Utility Bar */}
          <AnimatePresence>
            {imageData && !isImageLoading && (
              <motion.div className="utility-bar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 0.2 }}>
                <motion.a href={imageData.downloadUrl} download="drawing-inspiration.jpg" target="_blank" rel="noopener noreferrer" className="icon-btn" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <DownloadIcon /> <span>Download</span>
                </motion.a>
                <motion.button className="icon-btn" onClick={handleShare} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <ShareIcon /> <span>Share</span>
                </motion.button>
                <motion.button className="icon-btn" onClick={() => setIsExpanded(true)} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <ExpandIcon /> <span>Expand</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attribution */}
          <AnimatePresence>
            {imageData && !isImageLoading && (
              <motion.p className="attribution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                Photo by <a href={imageData.photographerUrl} target="_blank" rel="noopener noreferrer">{imageData.photographer}</a> on <a href={imageData.unsplashUrl} target="_blank" rel="noopener noreferrer">Unsplash</a>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isExpanded && imageData && (
          <motion.div className="lightbox-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsExpanded(false)}>
            <motion.button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <CloseIcon width="24" height="24" />
            </motion.button>
            <motion.img src={imageData.fullImageUrl} alt="Expanded view" className="lightbox-image" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 25 }} onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div className="toast" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}