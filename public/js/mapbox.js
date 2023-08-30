/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidHJvbmduaDIwMDMiLCJhIjoiY2xqZHd3NGV0MDZpZzNyb3c4ZHcxeDd5NiJ9.1v-c3XkyMVQ6qe_X8sDBsw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/trongnh2003/cljdyko7w003g01qzgl7n5pn4',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const ele = document.createElement('div');
    ele.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: ele,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add Popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100,
    },
  });
};
