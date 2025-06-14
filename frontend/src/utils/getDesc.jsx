export const GetDesc = (place) => {
  const { types = [], rating, user_ratings_total = 0 } = place;

  const mainType = types.find((t) =>
    ["restaurant", "bar", "cafe", "museum", "night_club", "park", "art_gallery", "tourist_attraction"].includes(t)
  );

  const typeEmoji = {
    restaurant: "🍽️",
    bar: "🍸",
    cafe: "☕",
    museum: "🏛️",
    night_club: "🎉",
    park: "🌳",
    art_gallery: "🖼️",
    tourist_attraction: "📸",
  };

  const emoji = typeEmoji[mainType] || "📍";

  if (rating && user_ratings_total) {
    return `${emoji} ${capitalize(mainType)} rated ${rating} stars (${user_ratings_total}+ reviews)`;
  }

  if (mainType) {
    return `${emoji} ${capitalize(mainType.replace("_", " "))}`;
  }

  return `${emoji} Local spot`;
};

const capitalize = (word) => word?.charAt(0).toUpperCase() + word?.slice(1);

export default GetDesc;