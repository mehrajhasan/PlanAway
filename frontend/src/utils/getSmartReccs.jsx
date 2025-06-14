import { GetCityCoords } from './getCityCoords';
import { GetPlaces } from './getPlaces';
import { GetSeason } from './getSeason';

//returns smart reccs
export const GetSmartReccs = async (cityQuery,tag) => {
    try{
        //get coords from each city
        const city = cityQuery.split('_')[0];
        const coords = await GetCityCoords(city);

        if(!coords){
            return [];
        }

        //fetch season
        const month = new Date().getMonth();
        const season = GetSeason(month,coords.lat);

        //take query and fetch results from getPlaces 
        const query = `${season} ${tag}`;
        const results = await GetPlaces(city, query);

        //get three random cached ideas
        const randomized = results.sort(() => 0.5 - Math.random()).slice(0, 3);
        return randomized;
    }
    catch(err){
        console.error("Smart recommendations failed:", err);
        return [];
    }
}

export default GetSmartReccs;