import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '../firebase';

export const GetPlaces = async (cityQuery, tag) => {
  const city = cityQuery.split("_")[0];
  const key = `${city}_${tag}`.toLowerCase().replace(/\s+/g, "");
  const ref = doc(db, "recommendationsCache", key);

  // check Firestore cache
  const snap = await getDoc(ref);
  if (snap.exists()) return snap.data().results;

  const query = `${tag} in ${city}`;

  // fetch coords from your backend
  const res = await fetch(
    `http://localhost:3000/api/places?city=${encodeURIComponent(city)}&query=${encodeURIComponent(query)}`
  );

  if (!res.ok) throw new Error("Failed to fetch coordinates");

  const json = await res.json();
  const results = json.results || [];

  // save to cache
  await setDoc(ref, { results });

  return results;
};

export default GetPlaces;
