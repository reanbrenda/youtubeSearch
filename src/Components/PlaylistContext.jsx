import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://harbour.dev.is/api';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/playlists`);
      setPlaylists(Array.isArray(response.data) ? response.data : []); // Ensure playlists is always an array
      setError(null);
    } catch (err) {
      setError(err);

      const savedPlaylists = localStorage.getItem('playlists');
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      } else {
        setPlaylists([]); // Fallback to empty array
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async (name) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/playlists`, { name });
      const newPlaylist = response.data;
      setPlaylists((prev) => [...(Array.isArray(prev) ? prev : []), newPlaylist]);
      setError(null);
      return newPlaylist;
    } catch (err) {
      setError(err);

      const newPlaylist = {
        id: `local_${Date.now()}`,
        name,
        videos: [],
      };
      setPlaylists((prev) => [...(Array.isArray(prev) ? prev : []), newPlaylist]);
      return newPlaylist;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializePlaylists = async () => {
      await fetchPlaylists();

      if (!Array.isArray(playlists) || !playlists.some((p) => p.name === 'Default Playlist')) {
        await createPlaylist('Default Playlist');
      }
    };

    initializePlaylists();
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        isLoading,
        error,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
