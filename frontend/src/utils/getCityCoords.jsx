const GCP_APIKEY1 = import.meta.env.VITE_GCP_APIKEY1;

//returns lat long for desired city
export const GetCityCoords = async (query) => {
    const city = query.split('_')[0];
    const res = await fetch(`http://localhost:3000/api/coords?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    return data.results[0]?.geometry?.location || null;
};

export default GetCityCoords;