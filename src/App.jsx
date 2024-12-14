import { useState, useEffect } from 'react';
import { SearchForm } from './Components/SearchForm';
import { YoutubeSearchList } from './Components/YoutubeResult';
import { AppContainer } from './Components/styled';
import axios from 'axios';
import useSWR from 'swr';
import './App.css';
import { Outlet, useNavigate, useSearchParams } from 'react-router';

// Fetcher function for SWR
async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchText = searchParams.get("q") || "water"; 
  const navigate = useNavigate();


  const { data, error, isLoading } = useSWR(
    searchText ? `https://harbour.dev.is/api/search?q=${searchText}` : null,
    fetcher
  );

  
  if (isLoading) {
    return <h1>Loading...</h1>;
  }


  if (error) {
    return <h1>Error: {error.message}</h1>;
  }


  const addSearchText = (text) => {
    setSearchParams({ q: text });
    navigate("/") 
  };

  return (
    <AppContainer>
      <SearchForm addSearchText={addSearchText} />
      <Outlet />
      <YoutubeSearchList data={data} />
    </AppContainer>
  );
}

export default App;
