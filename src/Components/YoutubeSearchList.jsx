import React, { useState } from "react";
import {
  Dialog,
  Checkbox,
  Button,
  Tooltip,
  Snackbar,
  IconButton,
  Box,
} from "@mui/material";
import { Link } from "react-router";
import { VideoGrid, VideoItem, VideoThumbnail, VideoTitle } from "./styled";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

export function YoutubeSearchList({ data, playlists, onVideoAdd, sharedPlaylistId }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleAddToPlaylistClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handlePlaylistSelection = (playlistId) => {
    if (selectedPlaylists.includes(playlistId)) {
      setSelectedPlaylists(selectedPlaylists.filter((id) => id !== playlistId));
    } else {
      setSelectedPlaylists([...selectedPlaylists, playlistId]);
    }
  };

  const handleAddVideoToPlaylists = async () => {
    if (!selectedVideo || selectedPlaylists.length === 0) return;

    try {
      await Promise.all(
        selectedPlaylists.map((playlistId) => onVideoAdd(playlistId, selectedVideo))
      );
      setSnackbarMessage("Video successfully added to playlists!");
    } catch (error) {
      setSnackbarMessage("Error adding video to playlists.");
      console.error("Error adding video to playlists:", error);
    } finally {
      setSnackbarOpen(true);
      setIsModalOpen(false);
      setSelectedVideo(null);
      setSelectedPlaylists([]);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
    setSelectedPlaylists([]);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div>
      <VideoGrid>
        {data.map((item) => (
          <VideoItem key={item.id.videoId} style={{ position: "relative" }}>
            <Link to={`/${item.id.videoId}`}>
              <VideoThumbnail
                src={item.snippet.thumbnails.url}
                alt="Video Thumbnail"
              />
            </Link>
            <VideoTitle>{item.snippet.title}</VideoTitle>
            <Box
              style={{
                position: "absolute",
                bottom: "2px",
                right: "10px",
                zIndex: 2,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "50%",
                padding: "5px",
              }}
            >
              <Tooltip title="Add to Playlist">
                <IconButton
                  color="primary"
                  onClick={() => handleAddToPlaylistClick(item)}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </VideoItem>
        ))}
      </VideoGrid>

      <Dialog open={isModalOpen} onClose={handleCancel}>
        <div style={{ padding: "20px" }}>
          <h4>Select one or more playlists:</h4>
          <ul>
            {sharedPlaylistId ? (
              <li>
                <Checkbox
                  checked={selectedPlaylists.includes(sharedPlaylistId)}
                  onChange={() => handlePlaylistSelection(sharedPlaylistId)}
                />
                Current Playlist
              </li>
            ) : (
              playlists.map((playlist) => (
                <li key={playlist.id}>
                  <Checkbox
                    checked={selectedPlaylists.includes(playlist.id)}
                    onChange={() => handlePlaylistSelection(playlist.id)}
                  />
                  {playlist.name}
                </li>
              ))
            )}
          </ul>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddVideoToPlaylists}
            >
              OK
            </Button>
          </div>
        </div>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
}

