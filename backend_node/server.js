import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.get('/api/coords', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'Missing city param' });

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.GCP_APIKEY1}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Coords error:', err);
    res.status(500).json({ error: 'Failed to fetch coords' });
  }
});

app.get('/api/places', async (req, res) => {
  const { city, query } = req.query;

  if (!city || !query) {
    return res.status(400).json({ error: 'Missing city or query param' });
  }

  // Step 1: Get lat/lng from Geocoding
  const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${process.env.GCP_APIKEY1}`);
  const geoData = await geoRes.json();
  const coords = geoData.results[0]?.geometry?.location;

  if (!coords) return res.status(404).json({ error: 'City not found' });

  const { lat, lng } = coords;

  // Step 2: Query Google Places API
  const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=10000&key=${process.env.GCP_APIKEY1}`;
  const placesRes = await fetch(placesUrl);
  const placesData = await placesRes.json();

  res.json({ results: placesData.results });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
