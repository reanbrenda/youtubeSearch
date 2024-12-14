import { useState } from 'react'
import { SearchForm } from './Components/SearchForm'
import {YoutubeSearchList} from './Components/YoutubeResult'
import { AppContainer } from './Components/styled';
import axios from "axios";
import useSWR from "swr";
import './App.css'
import { Outlet, useNavigate} from 'react-router';

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
  
}
function App() {
  const [searchText, setSearchText]= useState("");
  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR(
    `https://harbour.dev.is/api/search?q=${searchText}`,
    
    fetcher
  );

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error.message}</h1>;
  }
  
  const addSearchText = (searchText) => {
    
    setSearchText(searchText);
    navigate("/");
    
  };

 

  return (
    <AppContainer>
      <SearchForm   addSearchText={addSearchText}/>
      <Outlet/>
      <YoutubeSearchList   data={data}/>
    </AppContainer>
  )
}

export default App
