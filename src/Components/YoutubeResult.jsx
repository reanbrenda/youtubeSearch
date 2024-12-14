import { Link } from "react-router";
import { VideoGrid ,VideoItem,VideoThumbnail ,VideoTitle, gridVariants, 
  itemVariants,
  thumbnailVariants } from "./styled";

export function YoutubeSearchList({ data }) {

  return (
    <VideoGrid 
    variants={gridVariants}
    initial="hidden"
    animate="visible"
  >
      {data.map((item) => (

        <VideoItem key={item.id.videoId}  variants={itemVariants}
          whileHover="hover" >
         <Link to={`/${item.id.videoId}`}>
         <VideoThumbnail src={item.snippet.thumbnails.url} alt="Video Thumbnail"  variants={thumbnailVariants}
              initial="initial"
              whileHover="hover"/>
       </Link>
      <VideoTitle>{item.title}</VideoTitle>
        </VideoItem>
      ))}
   </VideoGrid>
  );
}