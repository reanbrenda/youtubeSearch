import React from "react";
import { Outlet, useSearchParams, useParams } from "react-router";
import { AppContainer } from "./Components/styled";
import { SearchForm } from "./Components/SearchForm";
import { YoutubeSearchList } from "./Components/YoutubeSearchList";
import useSWR from "swr";
import { PlaylistManager } from "./Components/PlaylistManager";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("q") || "popular";
  const { playlistId: sharedPlaylistId } = useParams(); // Detect if the URL contains a shared playlist ID

  // Fetch search results
  const { data: searchResults, error: searchError, isLoading: searchLoading } = useSWR(
    searchText ? `https://harbour.dev.is/api/search?q=${searchText}` : null,
    async (url) => {
      const response = await fetch(url);
      return response.json();
    }
  );

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
      <Outlet />
      <PlaylistManager sharedPlaylistId={sharedPlaylistId}>
        {(playlists, onVideoAdd) => (
          <YoutubeSearchList
            data={searchResults || []}
            playlists={playlists || []}
            onVideoAdd={onVideoAdd}
            sharedPlaylistId={sharedPlaylistId} 
          />
        )}
      </PlaylistManager>
     
    </AppContainer>
  );
}

export default App;

