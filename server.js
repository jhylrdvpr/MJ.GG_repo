import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const RIOT_KEY = process.env.RIOT_API_KEY;

if (!RIOT_KEY) {
  console.warn('Warning: RIOT_API_KEY is not set in environment. Set it in your .env file.');
}

app.use(express.json());

function forwardResponse(res, upstreamResp, body) {
  res.status(upstreamResp.status);
  const contentType = upstreamResp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { res.json(JSON.parse(body)); } catch (e) { res.send(body); }
  } else {
    res.send(body);
  }
}

// Get summoner by name: /api/riot/summoner/:platform/:name
app.get('/api/riot/summoner/:platform/:name', async (req, res) => {
  const { platform, name } = req.params;
  const url = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(name)}`;
  try {
    const r = await fetch(url, { headers: { 'X-Riot-Token': RIOT_KEY } });
    const text = await r.text();
    forwardResponse(res, r, text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get match list by PUUID: /api/riot/matches/:regional/:puuid
app.get('/api/riot/matches/:regional/:puuid', async (req, res) => {
  const { regional, puuid } = req.params;
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids`;
  try {
    const r = await fetch(url, { headers: { 'X-Riot-Token': RIOT_KEY } });
    const text = await r.text();
    forwardResponse(res, r, text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get match by match id: /api/riot/match/:regional/:matchId
app.get('/api/riot/match/:regional/:matchId', async (req, res) => {
  const { regional, matchId } = req.params;
  const url = `https://${regional}.api.riotgames.com/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  try {
    const r = await fetch(url, { headers: { 'X-Riot-Token': RIOT_KEY } });
    const text = await r.text();
    forwardResponse(res, r, text);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
