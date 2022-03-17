console.log('hello from the client side :D');
const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoiYnJpYW5tdXR1cmkyIiwiYSI6ImNsMHV6Yjd6ejBpdm0zaWtiOHlpZDJvdjcifQ.k1ZdrX4Rrh9hImeWJnWO2w';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});
