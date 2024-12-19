import { useState } from "react";
import { Outlet, Link, useSearchParams } from "react-router";
import { AppContainer, ModalContainer } from "./Components/styled";
import { SearchForm } from "./Components/SearchForm";
import { YoutubeSearchList } from "./Components/YoutubeSearchList";
import axios from "axios";
import useSWR, { mutate } from "swr";

const PLAYLIST_STORAGE_KEY = "playlistIds";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("q") || "popular";


  const [isModalOpen, setModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");


  const { data: searchResults, error: searchError, isLoading: searchLoading } = useSWR(
    searchText ? `https://harbour.dev.is/api/search?q=${searchText}` : null,
    async (url) => {
      const response = await axios.get(url);
      return response.data;
    }
  );

 
  const storedPlaylistIds = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY)) || [];


  const { data: playlists, error: playlistError, mutate: mutatePlaylists } = useSWR(
    storedPlaylistIds.length
      ? storedPlaylistIds.map((id) => `https://harbour.dev.is/api/playlists/${id}`)
      : null,
    async (urls) => {
      const responses = await Promise.all(urls.map((url) => axios.get(url)));
      return responses.map((res) => res.data);
    },
    { revalidateOnFocus: false }
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
      console.log(newPlaylist)
    
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
    try {

      await axios.delete(`https://harbour.dev.is/api/playlists/${playlistId}`);

       
      const updatedPlaylistIds = storedPlaylistIds.filter((id) => id !== playlistId);
      localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(updatedPlaylistIds));

      
      const updatedPlaylists = playlists.filter((playlist) => playlist.id !== playlistId);
      mutatePlaylists(updatedPlaylists, true); 
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      alert("Failed to delete playlist. Please try again.");
    }
  };

  const addSearchText = (text) => {
    setSearchParams({ q: text });
  };

  if (searchLoading) {
    return <h1>Loading...</h1>;
  }

  if (searchError) {
    return <h1>Error: {searchError.message}</h1>;
  }

  return (
    <AppContainer>
      <SearchForm addSearchText={addSearchText} />
      <button onClick={() => setModalOpen(true)}>Create Playlist</button>
      <h2>Your Playlists</h2>
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
              <Link to={`/playlists/${playlist.id}`}>{playlist.name}</Link>
              <button onClick={() => handleDeletePlaylist(playlist.id)}>Delete</button> 
            </li>
          ))}
        </ul>
      )}
      <YoutubeSearchList
        data={searchResults || []}
        playlists={playlists || []}
        onVideoAdd={(playlistId, video) => {
          console.log(`Added video ${video.id.videoId} to playlist ${playlistId}`);
        }}
      />
      <Outlet />

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
    </AppContainer>
  );
}

export default App;
