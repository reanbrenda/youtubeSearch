import styled from 'styled-components';
import { motion } from 'framer-motion';


export const StyledSearchForm = styled.form`
  display: flex;
  margin-bottom: 20px;
`;

export const SearchInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 4px 0 0 4px;
`;

export const SearchButton = styled.button`
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  margin: 5px 0 0;
  font-size: 14px;
`;


export const VideoTitle = styled.p`
  padding: 6px;
  margin: 0;
  font-size: 14px;
  text-align: center;
`;

export const VideoDetailsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  font-size: 18px;
  color: #3498db;
  margin: 20px 0;
`;

export const ErrorText = styled.div`
  color: red;
  text-align: center;
  margin: 20px 0;
`;



export const AppContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
`;


export const VideoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 20px 0;
`;


export const VideoItem = styled(motion.div)`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
`;


export const VideoThumbnail = styled(motion.img)`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;


export const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.90,
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

export const thumbnailVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    transition: { duration: 0.3 }
  }
};