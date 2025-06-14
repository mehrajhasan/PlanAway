//returns season for specific/accurate reccs

export const GetSeason = (month, lat) => {
    //general idea of seasons
    const north = lat > 0; //northern hemi
    if (north) {
        if ([11, 0, 1].includes(month)) return "winter";
        if ([2, 3, 4].includes(month)) return "spring";
        if ([5, 6, 7].includes(month)) return "summer";
        if ([8, 9, 10].includes(month)) return "fall";
    } else {    //southern hemi
        if ([11, 0, 1].includes(month)) return "summer";
        if ([2, 3, 4].includes(month)) return "fall";
        if ([5, 6, 7].includes(month)) return "winter";
        if ([8, 9, 10].includes(month)) return "spring";
    }
};

export default GetSeason;