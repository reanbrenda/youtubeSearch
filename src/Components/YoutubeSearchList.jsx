import { Link } from "react-router";
import {
  VideoGrid,
  VideoItem,
  VideoThumbnail,
  VideoTitle,
  gridVariants,
  itemVariants,
  thumbnailVariants,
} from "./styled";
import { useState } from "react";
import axios from "axios";

export function YoutubeSearchList({ data, playlists, onVideoAdd }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleAddToPlaylistClick = (video) => {
    setSelectedVideo(video);
    setDropdownOpen(true); 
  };

  const handleAddVideoToPlaylist = async (playlistId) => {
    if (!selectedVideo) return;

    try {
      await axios.post(`https://harbour.dev.is/api/playlists/${playlistId}/videos`, {
        videoId: selectedVideo.id.videoId,
        title: selectedVideo.snippet.title,
        thumbnailUrl: selectedVideo.snippet.thumbnails.url,
      });

     
      if (onVideoAdd) onVideoAdd(playlistId, selectedVideo);

      alert(`Video added to playlist successfully!`);
    } catch (error) {
      console.error("Failed to add video to playlist:", error);
      alert("Failed to add video. Please try again.");
    } finally {
      setDropdownOpen(false); 
      setSelectedVideo(null); 
    }
  };

  return (
    <VideoGrid variants={gridVariants} initial="hidden" animate="visible">
      {data.map((item) => (
        <VideoItem
          key={item.id.videoId}
          variants={itemVariants}
          whileHover="hover"
        >
          <Link to={`/${item.id.videoId}`}>
            <VideoThumbnail
              src={item.snippet.thumbnails.url}
              alt="Video Thumbnail"
              variants={thumbnailVariants}
              initial="initial"
              whileHover="hover"
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
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <button onClick={() => handleAddVideoToPlaylist(playlist.id)}>
                      {playlist.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </VideoItem>
      ))}
    </VideoGrid>
  );
}
