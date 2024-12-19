// import React, { useState } from 'react';
// import useSWR, { mutate } from 'swr';
// import axios from 'axios';
// import { ModalContainer } from './styled';

// const PLAYLIST_STORAGE_KEY = "playlistIds";

// const fetchPlaylists = async (ids) => {
//   const urls = ids.map((id) => `https://harbour.dev.is/api/playlists/${id}`);
//   const responses = await Promise.all(urls.map((url) => axios.get(url)));
//   return responses.map((res) => res.data);
// };

// export const PlaylistManager = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [newPlaylistName, setNewPlaylistName] = useState("");

//   // Retrieve playlist IDs from localStorage
//   const storedPlaylistIds = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY)) || [];

//   // SWR for fetching playlists
//   const { data: playlists, error, mutate: mutatePlaylists } = useSWR(
//     storedPlaylistIds.length ? storedPlaylistIds : null,
//     fetchPlaylists,
//     { revalidateOnFocus: false }
//   );

//   const handleCreatePlaylist = async () => {
//     if (!newPlaylistName.trim()) {
//       alert("Playlist name cannot be empty.");
//       return;
//     }

//     try {
//       const response = await axios.post('https://harbour.dev.is/api/playlists', {
//         name: newPlaylistName,
//       });

//       const newPlaylist = response.data;

//       // Update localStorage
//       const updatedPlaylistIds = [...storedPlaylistIds, newPlaylist.id];
//       localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(updatedPlaylistIds));

//       // Update SWR cache
//       mutatePlaylists((playlists) => [...(playlists || []), newPlaylist], false);

//       // Clear input and close modal
//       setNewPlaylistName("");
//       setModalOpen(false);
//     } catch (err) {
//       console.error('Failed to create playlist:', err);
//       alert("Failed to create playlist. Please try again.");
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => setModalOpen(true)}>Create Playlist</button>
//       <h2>Your Playlists</h2>
//       {error ? (
//         <p>Error loading playlists.</p>
//       ) : !playlists ? (
//         <p>Loading playlists...</p>
//       ) : playlists.length === 0 ? (
//         <p>No playlists created yet.</p>
//       ) : (
//         <ul>
//           {playlists.map((playlist) => (
//             <li key={playlist.id}>{playlist.name}</li>
//           ))}
//         </ul>
//       )}

//       {isModalOpen && (
//         <ModalContainer>
//           <div className="modal">
//             <h2>Create a New Playlist</h2>
//             <input
//               type="text"
//               value={newPlaylistName}
//               onChange={(e) => setNewPlaylistName(e.target.value)}
//               placeholder="Enter playlist name"
//             />
//             <button onClick={handleCreatePlaylist}>Create</button>
//             <button onClick={() => setModalOpen(false)}>Cancel</button>
//           </div>
//         </ModalContainer>
//       )}
//     </div>
//   );
// };
