mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y', // style URL mapbox://styles/mapbox/light-v10
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 10, // starting zoom
projection: 'globe' // display the map as a 3D globe
});
map.on('style.load', () => {
map.setFog({}); // Set the default atmosphere style
});

map.addControl(new mapboxgl.NavigationControl())

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h3>${campground.title}</h3><p>${campground.location}</p>`
    )
)
.addTo(map)