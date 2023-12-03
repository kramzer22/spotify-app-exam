import axios from "axios";
import cheerio from "cheerio";

const GENIUS_CLIENT_ID =
  "d0WMVpGgY1OzMN8a06yQdOEea7_VClh-1alVI9pdKV3IAd4flwNdqiM2aEAybg3Z";
const GENIUS_CLIENT_SECRET =
  "dw0tIRuUVaBqUh3kDGr6HYnlPAt2ivNmR0iprlJeJhZgE3U8nWP4rWtbzhJcJET1IUHOREdWCftD_o_xJkeYYg";

const fetchAccessToken = async () => {
  try {
    const response = await fetch("https://api.genius.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GENIUS_CLIENT_ID,
        client_secret: GENIUS_CLIENT_SECRET,
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

const getLyrics = async (songUrl) => {
  return await axios.get(`http://localhost:3001/lyrics/?url=${songUrl}`);
};

const fetchSelectedTrackLyrics = async (songName) => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await fetch(
      `https://api.genius.com/search/?q=${songName}&access_token=${accessToken}`
    );

    const data = await response.json();

    const songUrl = data.response.hits[0].result.url;
    console.log(songUrl);
    const backEndResponse = await getLyrics(songUrl);
    console.log(backEndResponse);

    return backEndResponse.data.lyrics;

    // const parser = new DOMParser();
    // const doc = parser.parseFromString(songData, "text/html");
    // console.log(doc);
  } catch (error) {
    console.error(error);
  }
};

export default { fetchSelectedTrackLyrics };
