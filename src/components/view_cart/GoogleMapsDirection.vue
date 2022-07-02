<template>
  <div id="app">
    <gmap-map ref="map" :center="coords" :zoom="15" style="width: 100%; height: 300px;">
      <gmap-marker :position="this.coords" title="Vị trí của bạn"> </gmap-marker>
      <gmap-marker :position="this.destination" title="Nhà trọ"> </gmap-marker>
    </gmap-map>
  </div>
</template>
<script>
export default {
  name: 'GoogleMapsDirection',
  props: ['dest'],
  data: () => ({
    showMap: true,
    coords: {
      lat: 10.8377466,
      lng: 106.8060503,
    },
    destination: {
      lat: 10.8377466,
      lng: 106.8060503,
    },
  }),
  methods: {
    getDirection() {
      // eslint-disable-next-line
      const directionsServiceM = new google.maps.DirectionsService();
      // eslint-disable-next-line
      const directionsDisplayM = new google.maps.DirectionsRenderer();
      console.log(this.$refs.map);
      directionsDisplayM.setMap(this.$refs.map.$mapObject);

      function calculateAndDisplayRoute(directionsService, directionsDisplay, start, destination) {
        console.log(JSON.stringify(start));
        console.log(JSON.stringify(destination));
        directionsService.route(
          {
            origin: start,
            destination,
            travelMode: 'DRIVING',
          },
          (response, status) => {
            if (status === 'OK') {
              console.log(response);
              directionsDisplay.setDirections(response);
              console.log('ye ye');
            } else {
              console.log(status);
            }
          },
        );
      }

      // google maps API's direction service
      calculateAndDisplayRoute(
        directionsServiceM,
        directionsDisplayM,
        this.coords,
        this.destination,
      );
    },
  },
  created() {
    this.destination.lat = Number(this.dest.lat);
    this.destination.lng = Number(this.dest.lng);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.coords = coords;
        this.$nextTick(() => this.getDirection());
      });
    }
  },
};
</script>
