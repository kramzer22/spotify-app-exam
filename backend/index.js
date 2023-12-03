import express from "express";
import querystring from "querystring";
import cors from "cors";
import axios from "axios";
import cheerio from "cheerio";

const app = express();
const PORT = 3001;

const SPOTIFY_CLIEND_ID = "2cb115d03ad74a4687adf80ddbf31c46";
const SPOTIFY_CLIENT_SECRET = "6ec8bda29a8543a0a7a85d3821a419c7";
const redirectURL = "http://localhost:3001/callback";

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

app.get("/lyrics", async (request, response) => {
  const geniusUrl = request.query.url;

  try {
    const geniusResponse = await axios.get(geniusUrl);

    const lyrics = extractLyricsFromHTML(await geniusResponse.data);
    console.log(lyrics);
    response.status(200).json({ lyrics: lyrics });
  } catch (error) {
    console.error("Error:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

function extractLyricsFromHTML(html) {
  try {
    const $ = cheerio.load(html);
    let lyrics = $('div[class="lyrics"]').text().trim();
    if (!lyrics) {
      lyrics = "";
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "");
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n";
        }
      });
    }
    if (!lyrics) return null;
    return lyrics.trim();
  } catch (error) {
    console.error("Error extracting lyrics:", error.message);
    return null; // Return null or handle the error as appropriate
  }
}

app.get("/login", (req, res) => {
  const authorizeUrl =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIEND_ID,
      scope: "user-read-private user-read-email", // Add necessary scopes
      redirect_uri: redirectURL,
    });

  res.redirect(authorizeUrl);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectURL,
        client_id: SPOTIFY_CLIEND_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      }),
    });

    const data = await response.json();

    // You now have the access token
    const accessToken = data.access_token;
    res.redirect(`http://localhost:5173/?access_token=${accessToken}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log("Server is now running on port: " + PORT);
});
