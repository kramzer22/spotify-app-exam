import axios from "axios";

const CLIENT_ID = "2cb115d03ad74a4687adf80ddbf31c46";
const CLIENT_SECRET = "6ec8bda29a8543a0a7a85d3821a419c7";
const SPOTIFY_SDK_TOKEN =
  "BQDgeKkQybZN18cQX_ifkfi8jsn5jsraKxVjC-GFtVy40mcp1GVkZE3eOSFbppponykuxGmBFUC2S0v62491fzgtzqicS-iFF4ZB5SdjpTGKtXqUjP9NA0Y3hZ7Bk9ti9WFeZ98vaAE_J-ZT5zhkNLAmKRdaLSUVWU9RCxuhn5oM5QkoM4NbMrMflq4lx_kqosqBQykMzyq05DR6h_7rNu-h";

const fetchUserAuthToken = async () => {
  window.location.href = "http://localhost:3001/login";
};

const fetchAccessToken = async () => {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const fetchArtist = async (selectedArtistId) => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${selectedArtistId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = await response.json();

    return data.id;
  } catch (error) {
    console.error(error);
  }
};

const fetchRelatedArtists = async (selectedArtistId) => {
  try {
    const geniusToken = await fetchAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${selectedArtistId}/related-artists`,
      {
        headers: {
          Authorization: "Bearer " + geniusToken,
        },
      }
    );

    const data = await response.json();

    return data.artists;
  } catch (error) {
    console.error(error);
  }
};

const fetchAlbums = async (selectedArtistId) => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${selectedArtistId}/albums`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = await response.json();

    return data.items;
  } catch (error) {
    console.error(error);
  }
};

const fetchSelectedAlbum = async (albumId) => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default {
  fetchArtist,
  fetchRelatedArtists,
  fetchAlbums,
  fetchSelectedAlbum,
  fetchAccessToken,
  fetchUserAuthToken,
};
