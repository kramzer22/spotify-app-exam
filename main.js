import spotifyServices from "./services/spotifyServices";
import displayHelpers from "./helpers/displayHelpers";
import cookieHelpers from "./helpers/cookieHelpers";
import geniusServices from "./services/geniusServices";

let selectedArtistId = "06HL4z0CvFAxyc27GXpf02";
let selectedRelatedArtist;
let selectedArtistAlbums;
let selectedAlbum;
let selectedSongName;

let currentNavIndex;
let currentTrackIndex = -1;
let albumLength;

const playerImage = document.getElementById("playerImage");
const playerSongTitle = document.getElementById("playingSongTitle");
const playerArtist = document.getElementById("playingArtist");
const spotifyPlayer = document.getElementById("spotifyPlayer");
const playerEndTime = document.getElementById("endTime");

const navigationLinks = document.querySelectorAll("#navigationLinks");
const informationBody = document.getElementById("informationBody");

const togglePlay = document.getElementById("togglePlay");
const nextTrack = document.getElementById("nextTrack");
const prevTrack = document.getElementById("prevTrack");

navigationLinks.forEach((link, index) => {
  link.addEventListener("click", (e) => handleNavClick(e, index));
});

prevTrack.addEventListener("click", async () => {
  if (selectedAlbum) {
    if (currentTrackIndex > -1) {
      currentTrackIndex--;

      loadSelectedAlbum();
    }

    if (currentNavIndex === 0) {
      const lyrics = await geniusServices.fetchSelectedTrackLyrics(
        selectedSongName
      );
      displayHelpers.displayLyrics(informationBody, lyrics);
    }
  }
});

nextTrack.addEventListener("click", async () => {
  if (selectedAlbum) {
    if (currentTrackIndex < albumLength - 1) {
      currentTrackIndex++;

      loadSelectedAlbum();
    } else {
      currentTrackIndex = 0;

      loadSelectedAlbum();
    }

    if (currentNavIndex === 0) {
      const lyrics = await geniusServices.fetchSelectedTrackLyrics(
        selectedSongName
      );
      displayHelpers.displayLyrics(informationBody, lyrics);
    }
  }
});

const loadDefaultPlayer = () => {
  playerImage.src =
    "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/3152102/disc-clipart-md.png";
};

const resetNavFontStyle = () => {
  navigationLinks.forEach((link) => {
    link.style.fontWeight = "normal";
  });
};

const loadSelectedAlbum = async () => {
  const artistName = selectedAlbum.label;
  selectedSongName = selectedAlbum.tracks.items[currentTrackIndex].name;

  const duration = selectedAlbum.tracks.items[currentTrackIndex].duration_ms;
  const minutes = Math.floor(duration / 60000);
  const seconds = ((duration % 60000) / 1000).toFixed(0).padStart(2, "0");

  playerImage.src = selectedAlbum.images[1].url;
  playerSongTitle.textContent = selectedSongName;
  playerArtist.textContent = artistName;
  playerEndTime.textContent = `${minutes}:${seconds}`;
};

const handleNavClick = async (e, index) => {
  resetNavFontStyle();
  e.target.style.fontWeight = "bold";
  if (index === 0) {
    currentNavIndex = 0;
    const lyrics = await geniusServices.fetchSelectedTrackLyrics(
      selectedSongName
    );
    displayHelpers.displayLyrics(informationBody, lyrics);
  } else if (index === 1) {
    currentNavIndex = 1;
    displayHelpers.displayAlbums(
      informationBody,
      selectedArtistAlbums,
      handleLoadSelectedAlbum
    );
  } else {
    currentNavIndex = 2;
    displayHelpers.displayRelatedArtists(
      informationBody,
      selectedRelatedArtist,
      handleLoadSelectedArtist
    );
  }
};

const handleLoadSelectedAlbum = async (albumId) => {
  selectedAlbum = await spotifyServices.fetchSelectedAlbum(albumId);
  console.log(selectedAlbum);
  const trackUri = await selectedAlbum.uri;
  currentTrackIndex = 0;
  albumLength = selectedAlbum.tracks.items.length;
  console.log(albumLength);

  loadSelectedAlbum();
};

const handleLoadSelectedArtist = async (artistId) => {
  selectedArtistId = artistId;
  selectedArtistId = await spotifyServices.fetchArtist(selectedArtistId);
  if (selectedArtistId) {
    selectedArtistAlbums = await spotifyServices.fetchAlbums(selectedArtistId);
    selectedRelatedArtist = await spotifyServices.fetchRelatedArtists(
      selectedArtistId
    );

    navigationLinks[1].click();
  }
};

const playSelectedTrack = async (trackUri) => {};

const main = async () => {
  loadDefaultPlayer();
  selectedArtistId = await spotifyServices.fetchArtist(selectedArtistId);
  if (selectedArtistId) {
    selectedArtistAlbums = await spotifyServices.fetchAlbums(selectedArtistId);
    selectedRelatedArtist = await spotifyServices.fetchRelatedArtists(
      selectedArtistId
    );

    navigationLinks[1].click();
  }
};

main();

window.onSpotifyWebPlaybackSDKReady = async () => {
  // const currentUrl = window.location.href;
  // console.log(currentUrl);
  // // Extract the query string from the URL
  // const queryString = currentUrl.split("?")[1];
  // // Parse the query string to get key-value pairs
  // const queryParams = queryString.split("&").reduce((acc, param) => {
  //   const [key, value] = param.split("=");
  //   acc[key] = value;
  //   return acc;
  // }, {});
  // const accessToken = queryParams["access_token"];
  // console.log(accessToken);
  // if (accessToken && accessToken !== "") {
  //   const player = new Spotify.Player({
  //     name: "Spotify web player",
  //     getOAuthToken: (cb) => {
  //       cb(accessToken);
  //     },
  //   });
  //   // Error handling
  //   player.addListener("initialization_error", ({ message }) => {
  //     console.error(message);
  //   });
  //   player.addListener("authentication_error", ({ message }) => {
  //     console.error(message);
  //   });
  //   player.addListener("account_error", ({ message }) => {
  //     console.error(message);
  //   });
  //   player.addListener("playback_error", ({ message }) => {
  //     console.error(message);
  //   });
  //   // Connect the player
  //   player.connect();
  //   player.play();
  // } else {
  //   await spotifyServices.fetchUserAuthToken();
  // }
};
