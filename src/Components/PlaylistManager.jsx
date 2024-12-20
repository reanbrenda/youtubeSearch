import React, { useState } from "react";
import { Link } from "react-router";
import { ModalContainer } from "./styled";
import useSWR, { mutate } from "swr";
import axios from "axios";

const PLAYLIST_STORAGE_KEY = "playlistIds";

export function PlaylistManager({ children, sharedPlaylistId }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const storedPlaylistIds = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY)) || [];

  
  const isSharedPlaylist =
    sharedPlaylistId && !storedPlaylistIds.includes(sharedPlaylistId);

  const { data: playlists, error: playlistError, mutate: mutatePlaylists } = useSWR(
    isSharedPlaylist
      ? [`https://harbour.dev.is/api/playlists/${sharedPlaylistId}`] 
      : storedPlaylistIds.map((id) => `https://harbour.dev.is/api/playlists/${id}`), 
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => axios.get(url)));
      return isSharedPlaylist ? [responses[0].data] : responses.map((res) => res.data);
    }
  );

  const handleCreatePlaylist = async () => {
    if (isSharedPlaylist) {
      alert("Cannot create a new playlist while viewing a shared playlist.");
      return;
    }

    if (!newPlaylistName.trim()) {
      alert("Playlist name cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("https://harbour.dev.is/api/playlists", {
        name: newPlaylistName,
      });

      const newPlaylist = response.data;
      const updatedPlaylistIds = [...storedPlaylistIds, newPlaylist.id];
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(updatedPlaylistIds));

      mutatePlaylists([...playlists, newPlaylist], false);
      setNewPlaylistName("");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      alert("Failed to create playlist. Please try again.");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (isSharedPlaylist) {
      alert("Cannot delete a shared playlist.");
      return;
    }

    try {
      await axios.delete(`https://harbour.dev.is/api/playlists/${playlistId}`);

      const updatedPlaylistIds = storedPlaylistIds.filter((id) => id !== playlistId);
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(updatedPlaylistIds));

      const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
      mutatePlaylists(updatedPlaylists, false);
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      alert("Failed to delete playlist. Please try again.");
    }
  };

  const onVideoAdd = async (playlistId, video) => {
    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) {
      alert("Playlist not found.");
      return;
    }

    const isDuplicate = playlist.videos.some((v) => v.videoId === video.id.videoId);

    if (isDuplicate) {
      alert("This video is already in the playlist.");
      return;
    }

    try {
      await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.url,
      });

      const updatedVideos = [...playlist.videos, { videoId: video.id.videoId, ...video.snippet }];
      mutate(
        storedPlaylistIds.map((id) => `https://harbour.dev.is/api/playlists/${id}`),
        playlists.map((p) => (p.id === playlistId ? { ...p, videos: updatedVideos } : p)),
        false
      );

      alert("Video added to playlist successfully!");
    } catch (error) {
      console.error("Failed to add video to playlist:", error);
      alert("Failed to add video. Please try again.");
    }
  };

  return (
    <div>
      {!isSharedPlaylist && (
        <button onClick={() => setModalOpen(true)}>Create Playlist</button>
      )}
      <h2>{isSharedPlaylist ? "Shared Playlist" : "Your Playlists"}</h2>
      {playlistError ? (
        <p>Error loading playlists.</p>
      ) : !playlists ? (
        <p>Loading playlists...</p>
      ) : playlists.length === 0 ? (
        <p>No playlists created yet.</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.id}>
              {isSharedPlaylist ? (
                <span>{playlist.name}</span>
              ) : (
                <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
              )}
              {!isSharedPlaylist && (
                <button onClick={() => handleDeletePlaylist(playlist.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {children(playlists, onVideoAdd)}

      {isModalOpen && (
        <ModalContainer>
          <div className="modal">
            <h2>Create a New Playlist</h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
            <button onClick={handleCreatePlaylist}>Create</button>
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </ModalContainer>
      )}
    </div>
  );
}
