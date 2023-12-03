const removeInformationElements = (displayContainer) => {
  while (displayContainer.firstChild) {
    displayContainer.removeChild(displayContainer.firstChild);
  }
};

const displayLyrics = async (displayContainer, lyrics) => {
  removeInformationElements(displayContainer);
  displayContainer.className = "information-container lyrics-card";
  const formattedLyrics = lyrics.replace(/\n/g, "<br />");
  try {
    displayContainer.innerHTML = `<p>${formattedLyrics}</p>`;
  } catch (error) {
    console.error(error);
  }
};

const displayAlbums = (displayContainer, albums, handleLoadSelectedAlbum) => {
  removeInformationElements(displayContainer);
  displayContainer.className = "information-container sliding-card";

  albums.map((album) => {
    const albumContainer = document.createElement("div");
    const albumCoverImg = document.createElement("img");
    const albumTitle = document.createElement("p");
    const albumYear = document.createElement("p");

    albumContainer.addEventListener("click", () =>
      handleLoadSelectedAlbum(album.id)
    );

    albumContainer.className = "album-list-container";
    albumCoverImg.className = "album-list-img";

    const date = new Date(album.release_date);
    albumCoverImg.src = album.images[1].url;
    albumTitle.textContent = album.name;
    albumYear.textContent = date.getFullYear();

    albumContainer.appendChild(albumCoverImg);
    albumContainer.appendChild(albumTitle);
    albumContainer.appendChild(albumYear);

    displayContainer.appendChild(albumContainer);
  });
};

const displayRelatedArtists = (
  displayContainer,
  artists,
  handleLoadSelectedArtist
) => {
  removeInformationElements(displayContainer);
  displayContainer.className = "information-container sliding-card";

  artists.map((artist) => {
    const artistContainer = document.createElement("div");
    const artistImg = document.createElement("img");
    const artistName = document.createElement("p");

    artistContainer.addEventListener("click", () =>
      handleLoadSelectedArtist(artist.id)
    );

    artistImg.className = "album-list-img";

    artistImg.src = artist.images[1].url;
    artistName.textContent = artist.name;

    artistContainer.appendChild(artistImg);
    artistContainer.appendChild(artistName);

    displayContainer.appendChild(artistContainer);
  });
};

export default { displayLyrics, displayAlbums, displayRelatedArtists };
