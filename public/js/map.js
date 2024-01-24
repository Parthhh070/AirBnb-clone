mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  center: coordinates, //long , lat
  zoom: 9,
});

console.log(coordinates);
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);

