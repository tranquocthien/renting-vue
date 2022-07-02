<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :search="search"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      :single-expand="singleExpand"
      :expanded.sync="expanded"
      show-expand
      item-key="typeName"
      hide-default-footer
      @page-count="pageCount = $event"
      sort-by="calories"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title style="fontsize: 20px">Loại phòng</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark fab small text class="mb-2" v-bind="attrs" v-on="on" color="#EF7239">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.name" label="Dessert name"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.calories" label="Calories"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.fat" label="Fat (g)"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.carbs" label="Carbs (g)"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.protein" label="Protein (g)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Hủy</v-btn>
                <v-btn color="blue darken-1" text @click="save">Lưu</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
        <v-icon class="ml-5" @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">More info about {{ item.typeName }}</td> </template
      >s
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" color="#6C98C6"></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HostelRoom',
  props: ['groups', 'groupId', 'typeId'],
  components: {},
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    search: '',
    dialog: false,
    singleExpand: true,
    headers: [
      {
        text: 'Tên loại phòng',
        align: 'start',
        sortable: false,
        value: 'typeName',
      },
      { text: 'Diện tích (m²)', value: 'superficiality' },
      { text: 'Người', value: 'capacity' },
      { text: 'Giá tiền', value: 'price' },
      { text: 'Trạng thái', value: 'status', sortable: false },
      { value: 'actions', sortable: false },
      { value: 'data-table-expand', sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      roomName: '',
      superficiality: 0,
      capacity: 0,
      price: 0,
    },
    defaultItem: {
      roomName: '',
      superficiality: 0,
      capacity: 0,
      price: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tạo mới phòng trọ' : 'Cập nhật thông tin phòng trọ';
    },
    // initialize() {
    //   return this.groups.forEach((element) => {
    //     if (element.groupId === this.groupId) {
    //       element.types.forEach((element1) => {
    //         if (element1.typeId === this.typeId) {
    //           element1.rooms.forEach((element2) => {
    //             const ten = element2.roomName;
    //             const dientich = element1.superficiality;
    //             const nguoi = element1.capacity;
    //             const gia = element1.price;
    //             const tong = {
    //               roomName: ten,
    //               superficiality: dientich,
    //               capacity: nguoi,
    //               price: `${gia} triệu`,
    //             };
    //             this.desserts.push(tong);
    //           });
    //         }
    //       });
    //     }
    //   });
    // },
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.desserts = [
        {
          typeName: 'Frozen Yogurt1',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt2',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt3',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt4',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt5',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt6',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt7',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt8',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt9',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt10',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
        {
          typeName: 'Frozen Yogurt11',
          superficiality: 159,
          capacity: 6.0,
          price: 24,
          status: 'Cho thuê',
        },
      ];
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = { ...item };
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.desserts.indexOf(item);
      //   confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1);
      this.desserts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
<style>
th {
  font-size: 19px !important;
}
td {
  font-size: 18px !important;
}
</style>
