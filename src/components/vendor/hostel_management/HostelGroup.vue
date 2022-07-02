<template>
  <div>
    <v-card height="100%" class="overflow-y-hidden" elevation="0">
      <vue-scroll v-if="groups.length > 0">
        <v-list nav dense>
          <v-list-item-group v-model="itemGroup" color="primary">
            <v-list-item
              dense
              v-for="(item, i) in groups"
              :key="i"
              v-on:click="getGroupItem(item.groupId)"
            >
              <v-list-item-avatar>
                <v-avatar :color="getColor(i)" size="36">
                  <span class="white--text headline">{{ getShortName(item.groupName) }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ item.groupName }}</v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-action class="d-flex flex-row">
                <v-btn color="red" icon dark small @click="$emit('delete', item.groupId)">
                  <v-icon dark>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </vue-scroll>
      <template v-if="groups.length == 0">
        <v-list>
          <v-list-item>
            <v-list-item-title>Danh sách khu trọ đang trống</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-card>
  </div>
</template>

<script>

export default {
  name: 'HostelGroup',
  props: ['groups'],
  methods: {
    getGroupItem(item) {
      this.groupItem = item;
      this.$emit('getIdSelected', this.groupItem);
    },
    getShortName(fullName) {
      const tokens = fullName.split(' ');
      return tokens.reverse()[0].substring(0, 1);
    },
    getRandomInt(inMin, inMax) {
      const min = Math.ceil(inMin);
      const max = Math.floor(inMax);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomColor() {
      const rand = this.getRandomInt(0, this.colors.length - 1);
      return this.colors[rand];
    },
    getColor(index) {
      const colorIndex = index % this.colors.length;
      return this.colors[colorIndex];
    },
  },
  data: () => ({
    miniVariant: true,
    groupItem: null,
    itemGroup: null,
    colors: [
      'red',
      'purple',
      'indigo',
      'blue',
      'cyan',
      'teal',
      'green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'brown',
      'blue-grey',
    ],
  }),
  mounted() {
    if (this.groups.length > 0) {
      this.itemGroup = 0;
    }
  },
};
</script>
