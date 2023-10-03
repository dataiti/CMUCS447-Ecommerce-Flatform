import axios from "axios";

const getPlaceMapApi = async ({ address }) => {
  const res = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${address?.exactAddress}, ${address?.district}, ${address?.ward}, ${address?.province}.json?access_token=${process.env.REACT_APP_MAPBOX_KEY}`
  );
  if (res && res.data) {
    return res.data;
  }
};

const getPlaceGoogleMapApi = async ({ address }) => {
  const res = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address="Đà Nẵng"&key=AIzaSyAgTGUKefvQALME8djrEuCbvhVzCe5tRvA`
  );
  if (res && res.data) {
    return res.data;
  }
};

export { getPlaceMapApi, getPlaceGoogleMapApi };
