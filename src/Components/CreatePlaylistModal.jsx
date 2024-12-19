import React, { useState } from 'react';
import { usePlaylist } from './PlaylistContext';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-height: 500px;
  overflow-y: auto;
`;

const PlaylistItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #2980b9;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

export function PlaylistModal({ video, onClose }) {
  const { playlists, createPlaylist, addVideoToPlaylist } = usePlaylist();
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = createPlaylist(newPlaylistName);
      addVideoToPlaylist(newPlaylist.id, video);
      setNewPlaylistName('');
      onClose();
    }
  };

  const handleAddToExistingPlaylist = (playlistId) => {
    addVideoToPlaylist(playlistId, video);
    onClose();
  };

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Add to Playlist</h2>
        <div>
          <Input
            type="text"
            placeholder="New Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <Button onClick={handleCreatePlaylist}>Create Playlist</Button>
        </div>
        <h3>Existing Playlists</h3>
        {playlists.map((playlist) => (
          <PlaylistItem key={playlist.id}>
            {playlist.name} ({playlist.videos.length} videos)
            <Button onClick={() => handleAddToExistingPlaylist(playlist.id)}>
              Add Video
            </Button>
          </PlaylistItem>
        ))}
      </ModalContent>
    </ModalOverlay>
  );
}
