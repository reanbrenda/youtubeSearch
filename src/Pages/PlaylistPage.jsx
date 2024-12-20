import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import useSWR, { mutate } from "swr";
import axios from "axios";
import styled from "styled-components";
import { Button, CircularProgress, IconButton, Snackbar, Modal, Box, Typography } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkIcon from '@mui/icons-material/Link';

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

const Container = styled.div`
  display: flex;
  padding: 20px;
  gap: 20px;
`;

const VideoPlayerContainer = styled.div`
  flex: 2;
`;

const PlaylistContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 600px;
  border-left: 1px solid #ccc;
  padding-left: 10px;
`;

const VideoThumbnail = styled.img`
  width: 150px;
  cursor: pointer;
  margin-right: 10px;
  border: ${(props) => (props.active ? "2px solid #007BFF" : "none")};
`;

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
};

function PlaylistPage() {
  const { playlistId } = useParams();
  const { data: playlist, error, isLoading } = useSWR(
    playlistId ? `https://harbour.dev.is/api/playlists/${playlistId}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isYouTubeApiReady, setYouTubeApiReady] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [retryAction, setRetryAction] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setYouTubeApiReady(true);
    };
  }, []);

  useEffect(() => {
    if (!isYouTubeApiReady || !playlist || playlist.videos.length === 0) return;

    const currentVideo = playlist.videos[currentVideoIndex]?.videoId;

    if (playerRef.current) {
      playerRef.current.loadVideoById(currentVideo);
    } else {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '360',
        width: '640',
        videoId: currentVideo,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }
  }, [isYouTubeApiReady, playlist, currentVideoIndex]);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      if (currentVideoIndex < playlist.videos.length - 1) {
        setCurrentVideoIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!playlistId || !videoId) return;

    try {
      await axios.delete(
        `https://harbour.dev.is/api/playlists/${playlistId}/videos/${videoId}`
      );

      const updatedVideos = playlist.videos.filter((video) => video.videoId !== videoId);
      mutate(
        `https://harbour.dev.is/api/playlists/${playlistId}`,
        { ...playlist, videos: updatedVideos },
        false
      );

      if (currentVideoIndex >= updatedVideos.length) {
        setCurrentVideoIndex(Math.max(0, updatedVideos.length - 1));
      }
    } catch (error) {
      console.error("Failed to remove video:", error);
      setRetryAction(() => () => handleRemoveVideo(videoId));
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setRetryAction(null);
  };

  const handleOpenShareModal = () => {
    setShareModalOpen(true);
  };

  const handleCloseShareModal = () => {
    setShareModalOpen(false);
  };

  const handleShareToPlatform = (platform) => {
    const url = window.location.href;
    let shareUrl = "";

    if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    } else if (platform === "copy") {
      navigator.clipboard.writeText(url).then(() => {
        setCopySnackbarOpen(true);
      });
      return;
    }

    window.open(shareUrl, "_blank");
  };

  const handleCopySnackbarClose = () => {
    setCopySnackbarOpen(false);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <h1>Failed to load playlist. Please try again later.</h1>;
  if (!playlist || !playlist.videos || playlist.videos.length === 0) {
    return <h1>No videos in this playlist.</h1>;
  }

  const currentVideo = playlist.videos[currentVideoIndex];

  return (
    <Container>
      <VideoPlayerContainer>
        <h1>{playlist.name}</h1>
        {currentVideo && (
          <div>
            <h2>Now Playing: {currentVideo.title}</h2>
            <div id="youtube-player"></div>
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          startIcon={<ShareIcon />}
          onClick={handleOpenShareModal}
        >
          Share
        </Button>
      </VideoPlayerContainer>
      <PlaylistContainer>
        <h3>Playlist Videos</h3>
        <ul>
          {playlist.videos.map((video, index) => (
            <li key={video.videoId} style={{ display: "flex", alignItems: "center" }}>
              <VideoThumbnail
                src={video.thumbnailUrl}
                alt={video.title}
                active={index === currentVideoIndex}
                onClick={() => setCurrentVideoIndex(index)}
              />
              <h4>{video.title}</h4>
              <IconButton
                onClick={() => handleRemoveVideo(video.videoId)}
                color="error"
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </li>
          ))}
        </ul>
      </PlaylistContainer>
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message="Failed to remove video."
        action={
          retryAction && (
            <Button color="secondary" size="small" onClick={retryAction}>
              Retry
            </Button>
          )
        }
      />
      <Snackbar
        open={copySnackbarOpen}
        onClose={handleCopySnackbarClose}
        message="URL copied to clipboard!"
      />
      <Modal
        open={shareModalOpen}
        onClose={handleCloseShareModal}
        aria-labelledby="share-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography id="share-modal-title" variant="h6" component="h2">
            Share this playlist
          </Typography>
          <Button
            variant="contained"
            startIcon={<TwitterIcon />}
            onClick={() => handleShareToPlatform("twitter")}
          >
            Twitter
          </Button>
          <Button
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={() => handleShareToPlatform("facebook")}
          >
            Facebook
          </Button>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => handleShareToPlatform("copy")}
          >
            Copy URL
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default PlaylistPage;
