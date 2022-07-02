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
      hide-default-footer
      @page-count="pageCount = $event"
      sort-by="status"
      class="ml-16"
    >
      <template v-slot:top v-if="!isMobile">
        <v-toolbar flat color="white">
          <v-toolbar-title>Loại phòng</v-toolbar-title>
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
        </v-toolbar>
      </template>
      <template v-slot:[`item.typeName`]="{ item }">
        <div class="d-flex justify-space-between">
          <div>{{ item.typeName }}</div>
          <div>
            <v-icon color="green">mdi-check-circle</v-icon>
          </div>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon>
          <v-icon @click="showTypeEditor(item)"> mdi-pencil </v-icon>
        </v-btn>
        <v-btn icon class="ml-5" @click="getHostelTypeUrl(item.typeId)">
          <v-icon> preview </v-icon>
        </v-btn>
        <!-- <v-icon class="ml-5" @click="deleteItem(item)"> mdi-delete </v-icon> -->
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="desserts">Tải lại</v-btn>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination v-model="page" :length="pageCount" color="#6C98C6"></v-pagination>
    </div>
    <HostelTypeViewerAndEditor
      :type="typeViewer.selectedType"
      :show="typeViewer.show"
      v-on:close="closeTypeEditor"
    />
  </div>
</template>

<script>
import HostelTypeViewerAndEditor from './HostelTypeViewerAndEditor.vue';

export default {
  name: 'HostelType',
  props: ['typesData'],
  components: { HostelTypeViewerAndEditor },
  data: () => ({
    typeViewer: {
      selectedType: null,
      show: false,
    },
    types: [],
    expanded: [],
    page: 1,
    pageCount: 0,
    itemsPerPage: 8,
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
    editedIndex: -1,
    editedItem: {
      typeName: '',
      superficiality: 0,
      capacity: 0,
      price: 0,
      status: '',
    },
    defaultItem: {
      typeName: '',
      superficiality: 0,
      capacity: 0,
      price: 0,
      status: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Tạo mới phòng trọ' : 'Cập nhật thông tin phòng trọ';
    },
    desserts() {
      return this.types.map((typeElement) => {
        let roomEmptyList = [];
        let roomFullList = [];
        const id = typeElement.typeId;
        const ten = typeElement.title;
        const dientich = typeElement.superficiality;
        const nguoi = typeElement.capacity;
        const gia = typeElement.price;
        const trangthai = typeElement.typeStatus.statusName;

        const mapper = typeElement.rooms.map((roomItem) => {
          const tinhtrang = roomItem.available;
          const tenid = roomItem.roomId;
          const tenphong = roomItem.roomName;

          const tong2 = {
            roomId: tenid,
            roomName: tenphong,
            available: tinhtrang,
            typeIds: roomItem.typeId,
          };
          return tong2;
        });
        roomEmptyList = mapper.filter((item) => item.tinhtrang);
        roomFullList = mapper.filter((item) => !item.tinhtrang);
        const tong = {
          typeId: id,
          typeName: ten,
          superficiality: dientich,
          capacity: nguoi,
          price: `${gia} triệu`,
          status: trangthai,
          roomEm: roomEmptyList,
          roomFu: roomFullList,
        };
        return tong;
      });
    },
    isMobile() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return true;
        case 'sm':
          return true;
        default:
          return false;
      }
    },
  },
  methods: {
    getHostelTypeUrl(typeId) {
      window.open(`${window.location.origin}/detail/${typeId}`);
    },
    showTypeEditor(dessertItem) {
      const { typeId } = dessertItem;
      const type = this.typesData.find((t) => t.typeId === Number(typeId));
      this.typeViewer.selectedType = type;
      this.typeViewer.show = true;
    },
    closeTypeEditor() {
      this.typeViewer.show = false;
    },
    clicked(value) {
      this.expanded.push(value);
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
  watch: {
    typesData: {
      immediate: true,
      // eslint-disable-next-line
      handler(val, oldVal) {
        this.types = val;
      },
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
#style-1::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
</style>
