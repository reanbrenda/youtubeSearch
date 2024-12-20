import React, { useState } from "react";
import { Link } from "react-router";
import { VideoGrid, VideoItem, VideoThumbnail, VideoTitle } from "./styled";


export function YoutubeSearchList({ data, playlists, onVideoAdd, sharedPlaylistId }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleAddToPlaylistClick = (video) => {
    setSelectedVideo(video);
    setDropdownOpen(true);
  };

  const handleAddVideoToPlaylist = async (playlistId) => {
    if (!selectedVideo) return;

    try {
      await onVideoAdd(playlistId, selectedVideo);
    } catch (error) {
      console.error("Error adding video to playlist:", error);
    } finally {
      setDropdownOpen(false);
      setSelectedVideo(null);
    }
  };

  return (
    <VideoGrid>
      {data.map((item) => (
        <VideoItem key={item.id.videoId}>
          <Link to={`/${item.id.videoId}`}>
            <VideoThumbnail
              src={item.snippet.thumbnails.url}
              alt="Video Thumbnail"
            />
          </Link>
          <VideoTitle>{item.snippet.title}</VideoTitle>
          <button onClick={() => handleAddToPlaylistClick(item)}>
            Add to Playlist
          </button>

          {isDropdownOpen && selectedVideo === item && (
            <div className="dropdown">
              <h4>Select a Playlist</h4>
              <ul>
                {sharedPlaylistId ? (
                  <li>
                    <button onClick={() => handleAddVideoToPlaylist(sharedPlaylistId)}>
                      Add to Shared Playlist
                    </button>
                  </li>
                ) : (
                  playlists.map((playlist) => (
                    <li key={playlist.id}>
                      <button onClick={() => handleAddVideoToPlaylist(playlist.id)}>
                        {playlist.name}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </VideoItem>
      ))}
    </VideoGrid>
  );
}

