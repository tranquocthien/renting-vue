<template>
  <v-dialog
    v-model="show"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    class="hidden-md-and-up"
  >
    <v-card v-if="type">
      <v-toolbar dark color="#727CF5">
        <v-btn icon dark @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ type.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialog = false"> Lưu thay đổi </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid>
        <v-row class="hidden-sm-and-down">
          <v-col cols="1" />
          <v-col cols="10" class="mt-5">
            <v-card>
              <v-row class="ma-1">
                <v-col cols="6">
                  <v-row>
                    <v-col cols="12">
                      <HostelTypeInfoEditor :type="type" />
                    </v-col>
                    <v-col cols="12">
                      <HostelTypeFacilityEditor :type="type" />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-row>
                    <v-col cols="12">
                      <v-data-table
                        :headers="headers"
                        :items="rooms"
                        class="elevation-1"
                        hide-default-footer
                        locale="vi-VN"
                      >
                        <template v-slot:top>
                          <v-toolbar flat>
                            <v-toolbar-title>Phòng</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-dialog v-model="dialogR" max-width="500px">
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn color="#727CF5" dark class="mb-2" v-bind="attrs" v-on="on">
                                  Thêm phòng
                                </v-btn>
                              </template>
                              <v-card>
                                <v-card-title>
                                  <span class="headline">{{ formTitle }}</span>
                                </v-card-title>

                                <v-card-text>
                                  <v-container>
                                    <v-row>
                                      <v-col cols="12">
                                        <v-text-field
                                          v-model="editedItem.name"
                                          label="Tên phòng"
                                          solo
                                        ></v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-container>
                                </v-card-text>

                                <v-card-actions>
                                  <v-spacer></v-spacer>
                                  <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
                                  <v-btn color="blue darken-1" text @click="save"> Tạo </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <!-- <v-dialog v-model="dialogDelete" max-width="500px">
                                        <v-card>
                                          <v-card-title class="headline">Bạn thật sự muốn xóa</v-card-title>
                                          <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="blue darken-1" text @click="closeDelete">Hủy</v-btn>
                                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">Đồng ý</v-btn>
                                            <v-spacer></v-spacer>
                                          </v-card-actions>
                                        </v-card>
                                      </v-dialog> -->
                          </v-toolbar>
                        </template>
                        <template v-slot:item.actions="{ item }">
                          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
                        </template>
                        <template v-slot:no-data> Không có phòng trọ </template>
                      </v-data-table>
                    </v-col>
                    <v-col cols="12">
                      <ImageEditor :oldImages="type.typeImages" :mode="create" />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="1" />
        </v-row>
        <div class="hidden-sm-and-up">
          <v-col cols="12" sm="4">
            <HostelTypeInfoEditor :type="type" />
          </v-col>
          <v-col cols="12" sm="4">
            <HostelTypeFacilityEditor :type="type" />
          </v-col>
          <v-col cols="12" sm="4">
            <ImageEditor :images="type.typeImages" />
          </v-col>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
import ImageEditor from './ImageEditor.vue';
import HostelTypeInfoEditor from './HostelTypeInfoEditor.vue';
import HostelTypeFacilityEditor from './HostelTypeFacilityEditor.vue';

export default {
  name: 'HotelTypeViewerAndEditor',
  props: ['show', 'type'],
  components: { ImageEditor, HostelTypeInfoEditor, HostelTypeFacilityEditor },
};
</script>
