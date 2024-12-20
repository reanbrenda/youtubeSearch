import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import useSWR, { mutate } from "swr";
import axios from "axios";

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

function PlaylistPage() {
  const { playlistId } = useParams();
  const { data: playlist, error, isLoading } = useSWR(
    playlistId ? `https://harbour.dev.is/api/playlists/${playlistId}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isAdding, setAdding] = useState(false);
  const [isRemoving, setRemoving] = useState(false);
  const [isYouTubeApiReady, setYouTubeApiReady] = useState(false);
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
    if (isYouTubeApiReady && playlist && playlist.videos.length > 0) {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '360',
          width: '640',
          videoId: playlist.videos[currentVideoIndex].videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            playsinline: 1,
          },
          events: {
            onStateChange: onPlayerStateChange
          }
        });
      } else {
        playerRef.current.loadVideoById(playlist.videos[currentVideoIndex].videoId);
      }
    }
  }, [isYouTubeApiReady, playlist, currentVideoIndex]);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      if (currentVideoIndex < playlist.videos.length - 1) {
        setCurrentVideoIndex(prevIndex => prevIndex + 1);
      } else {
        // Add the first video to the end of the playlist
        const firstVideo = playlist.videos[0];
        const updatedVideos = [...playlist.videos, firstVideo];
        mutate(
          `https://harbour.dev.is/api/playlists/${playlistId}`,
          { ...playlist, videos: updatedVideos },
          false
        );
        setCurrentVideoIndex(playlist.videos.length); // Play the newly added video
      }
    }
  };

  const handleAddVideoToPlaylist = async (video) => {
    if (!playlistId || !video) return;

    try {
      setAdding(true);
      await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, {
        videoId: video.id.videoId,
        title: video.snippet.title,
        thumbnailUrl: video.snippet.thumbnails.url,
      });

      const updatedVideos = [...playlist.videos, video];
      mutate(
        `https://harbour.dev.is/api/playlists/${playlistId}`,
        { ...playlist, videos: updatedVideos },
        false
      );

      alert("Video added successfully.");
    } catch (error) {
      console.error("Failed to add video:", error);
      alert("Failed to add video. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!playlistId || !videoId) return;

    try {
      setRemoving(true);
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

      alert("Video removed successfully.");
    } catch (error) {
      console.error("Failed to remove video:", error);
      alert("Failed to remove video. Please try again.");
    } finally {
      setRemoving(false);
    }
  };

  if (isLoading) return <h1>Loading playlist...</h1>;
  if (error) return <h1>Failed to load playlist. Please try again later.</h1>;
  if (!playlist || !playlist.videos || playlist.videos.length === 0) {
    return <h1>No videos in this playlist.</h1>;
  }

  const currentVideo = playlist.videos[currentVideoIndex];

  return (
    <div>
      <h1>{playlist.name}</h1>
      {currentVideo && (
        <div>
          <h2>Now Playing: {currentVideo.title}</h2>
          <div id="youtube-player"></div>
        </div>
      )}
      <h3>Up Next</h3>
      <ul>
        {playlist.videos.slice(currentVideoIndex + 1).map((video, index) => (
          <li key={video.videoId}>
            <div>
              <h4>{video.title}</h4>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                style={{ width: "150px", cursor: "pointer" }}
                onClick={() => setCurrentVideoIndex(currentVideoIndex + 1 + index)}
              />
              {index === 0 && <span> (Next)</span>}
            </div>
          </li>
        ))}
      </ul>
      <h3>Playlist Videos</h3>
      <ul>
        {playlist.videos.map((video, index) => (
          <li key={video.videoId}>
            <div>
              <h4>{video.title}</h4>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                style={{ width: "150px", cursor: "pointer" }}
                onClick={() => setCurrentVideoIndex(index)}
              />
              <button
                onClick={() => handleRemoveVideo(video.videoId)}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Remove"}
              </button>
              {index === currentVideoIndex && <span> (Now Playing)</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlaylistPage;
