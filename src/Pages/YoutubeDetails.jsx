import React, { useRef } from "react"
import { useParams } from "react-router";
import { VideoDetailsContainer } from "../Components/styled";
import useSWR from "swr";
import axios from "axios";

async function fetcher(url) {
  const response = await axios.get(url);
  return response.data;
}

export function YoutubeDetails() {
  const { videoId } = useParams();
  const videoRef = useRef(null);

  const { data, error } = useSWR(
    `https://harbour.dev.is/api/videos/${videoId}`,
    fetcher
  );
  
  if (!data && !error) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>An error occurred: {error.message || "Unknown error"}</h1>;
  }

  if (videoRef.current) {
    videoRef.current.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <VideoDetailsContainer  ref={videoRef}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={data.title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
    </VideoDetailsContainer>
  );
}
