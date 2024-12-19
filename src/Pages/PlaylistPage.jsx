import { useParams } from "react-router";
import useSWR from "swr";
import axios from "axios";

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

function PlaylistPage() {
  const { playlistId } = useParams(); 

  const { data: playlist, error, isLoading } = useSWR(
    playlistId ? `https://harbour.dev.is/api/playlists/${playlistId}` : null,
    fetcher
  );

  if (!playlistId) {
    return <h1>Playlist ID is undefined. Please try again.</h1>;
  }

  if (isLoading) {
    return <h1>Loading playlist...</h1>;
  }

  if (error) {
    return <h1>Failed to load playlist. Please try again later.</h1>;
  }

  if (!playlist || !playlist.videos) {
    return <h1>No data available for this playlist.</h1>;
  }

  return (
    <div>
      <h1>{playlist.name}</h1>
      {playlist.videos.length === 0 ? (
        <p>No videos in this playlist.</p>
      ) : (
        <ul>
          {playlist.videos.map((video) => (
            <li key={video.videoId}>
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                style={{ width: "120px", marginRight: "10px" }}
              />
              <div style={{ display: "inline-block" }}>
                <h3>{video.title}</h3>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaylistPage;
