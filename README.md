# YouTube Playlist Application

## Overview
This is a feature-rich YouTube playlist application that allows users to create and manage playlists with enhanced functionality. It incorporates **Material-UI** and **Styled-Components** for a responsive and visually appealing interface.

## Functional Requirements

### Key Features
1. **Autoplay Next**
   - Automatically plays the next video in the queue once the current video finishes.

2. **Dynamic Playlist Management**
   - Users can search for videos and add them to the playlist while a video is still playing.
   - Duplicate songs are not allowed in the same playlist.

3. **Sharable Playlists**
   - Each playlist has a unique URL that users can share via:
     - Twitter
     - Facebook
     - Copy URL to clipboard

4. **Video Removal**
   - Users can remove videos from the playlist.

5. **Playlist Management**
   - Users can create, manage, and delete playlists.
   - Multiple playlists can be accessed and managed simultaneously.

6. **Persistence and Synchronization**
   - Playlists are persisted to an API.
   - Changes to the playlist are polled and synchronized across users.
   - Playlists are also saved locally using Local Storage for offline access.

---

## Technologies Used

### Frontend
- **React.js**: Main framework for building the UI.
- **Material-UI**: For responsive and pre-styled components.
- **Styled-Components**: For custom styling with scoped CSS-in-JS.

### Backend
- **API**: A backend service to persist playlists and manage synchronization across users.

### Libraries/Tools
- **YouTube Data API**: For video search and metadata retrieval.
- **React-Router**: For unique playlist URLs.
- **Axios**: For API communication.
- **WebSockets**: For real-time playlist synchronization.

---

## API Endpoints

### Base URL
`https://harbour.dev.is/api`

### Endpoints

#### Get Playlist
Fetch a specific playlist by ID:
```http
GET https://harbour.dev.is/api/playlists/{playlistId}
```

#### Create Playlist
Create a new playlist:
```http
POST https://harbour.dev.is/api/playlists
{
  "name": "My playlist"
}
```

#### Update Playlist
Update an existing playlist with custom properties:
```http
PUT https://harbour.dev.is/api/playlists/{playlistId}
{
  "name": "My playlist",
  "videos": [
    { "videoId": "5qap5aO4i9A", "title": "My video", "thumbnailUrl": "https://..."},
    { "videoId": "lTRiuFIWV54", "title": "Other video", "thumbnailUrl": "https://..." }
  ]
}
```

#### Add Video to Playlist
Add a single video to a playlist:
```http
POST https://harbour.dev.is/api/playlists/{playlistId}/videos
{
  "videoId": "5qap5aO4i9A", "title": "My video", "thumbnailUrl": "https://..."
}
```

#### Delete Video from Playlist (Optional)
Remove a specific video from a playlist:
```http
DELETE https://harbour.dev.is/api/playlists/{playlistId}/videos/{videoId}
```

#### Delete Playlist (Optional)
Remove an entire playlist:
```http
DELETE https://harbour.dev.is/api/playlists/{playlistId}
```

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo/youtube-playlist-app.git
    ```

2. Navigate to the project directory:
    ```bash
    cd youtube-playlist-app
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the application:
    ```bash
    npm start
    ```

---

## Usage

### Creating a Playlist
1. Search for a video using the search bar.
2. Add the video to the playlist while the current video is playing.
3. Duplicate videos are automatically detected and not added to the playlist.

### Sharing a Playlist
1. Open the playlist.
2. Copy the unique URL or share directly via Twitter or Facebook.

### Managing Playlists
- Create, update, and delete playlists through the playlist management interface.
- Access multiple playlists simultaneously.

### Persistence and Synchronization
- Changes to playlists are automatically saved and synchronized across all users.
- Playlists are also cached locally using Local Storage for offline access.

---


