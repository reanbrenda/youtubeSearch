import React, { useState } from "react";
import { Link } from "react-router";
import { Drawer, List, ListItem, ListItemText, IconButton, TextField, Button, Box } from "@mui/material";
import { Add, Delete, Close } from "@mui/icons-material";
import styled from "styled-components";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { ListItem as MuiListItem } from "@mui/material";

const PLAYLIST_STORAGE_KEY = "playlistIds";

const StyledSidebarHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
`;

const StyledPlaylistList = styled(List)`
  padding: 16px;
`;
const StyledListItem = styled(MuiListItem)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.1); /* Light gray background on hover */
    cursor: pointer;
  }
`;
export function PlaylistManager({ children, sharedPlaylistId }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const storedPlaylistIds = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY)) || [];
  const isSharedPlaylist = sharedPlaylistId && !storedPlaylistIds.includes(sharedPlaylistId);

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
      setSidebarOpen(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      alert("Failed to create playlist. Please try again.");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
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

  return (
    <div>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => setSidebarOpen(true)}>
        Manage Playlists
      </Button>
      
      <Drawer anchor="right" open={isSidebarOpen} onClose={() => setSidebarOpen(false)}>
        <StyledSidebarHeader>
          <h3>{isSharedPlaylist ? "Shared Playlist" : "Your Playlists"}</h3>
          <IconButton onClick={() => setSidebarOpen(false)}>
            <Close />
          </IconButton>
        </StyledSidebarHeader>
        {playlistError ? (
          <p>Error loading playlists.</p>
        ) : !playlists ? (
          <p>Loading playlists...</p>
        ) : playlists.length === 0 ? (
          <p>No playlists created yet.</p>
        ) : (
          <StyledPlaylistList>
            {playlists.map((playlist) => (
              <ListItem key={playlist.id} secondaryAction={null}>
                {isSharedPlaylist ? (
                  <ListItemText primary={playlist.name} />
                ) : (
                  <Link to={`/playlists/${playlist.id}`} 
                  
                  style={{ textDecoration: "none", color: "inherit" }}>
                    <ListItemText primary={playlist.name} />
                  </Link>
                )}
                {!isSharedPlaylist && (
                  <Box marginLeft="auto">
                    <IconButton edge="end" onClick={() => handleDeletePlaylist(playlist.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </ListItem>
            ))}
          </StyledPlaylistList>
        )}
        {!isSharedPlaylist && (
          <Box padding={2}>
            <TextField
              fullWidth
              label="New Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              variant="outlined"
              margin="dense"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreatePlaylist}
              style={{ marginTop: "8px" }}
            >
              Create Playlist
            </Button>
          </Box>
        )}
      </Drawer>

      {children(playlists, async (playlistId, video) => {
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
          mutatePlaylists(playlists.map((p) => (p.id === playlistId ? { ...p, videos: updatedVideos } : p)), false);
        } catch (error) {
          console.error("Failed to add video to playlist:", error);
          alert("Failed to add video. Please try again.");
        }
      })}
    </div>
  );
}
