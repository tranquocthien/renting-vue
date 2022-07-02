<template>
  <div>
    <div>
      <label>
        <gmap-autocomplete @place_changed="setPlace"></gmap-autocomplete>
        <button @click="addMarker">Search</button>
      </label>
      <br />
    </div>
    <br />
  </div>
</template>

<script>
export default {
  name: 'googleMap',
  data() {
    return {
      // mặc định là Montreal
      center: { lat: 45.508, lng: -73.587 },
      markers: [],
      places: [],
      currentPlace: null,
    };
  },

  // mounted() {
  //   this.geolocate();
  // },

  methods: {
    // nhận địa điểm thông qua autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    addMarker() {
      if (this.currentPlace) {
        alert(
          `lat:${this.currentPlace.geometry.location.lat()},lng:${this.currentPlace.geometry.location.lng()}`,
        );
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
  },
};
</script>
