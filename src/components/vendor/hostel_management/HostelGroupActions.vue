<template>
  <v-card class="ml-16 d-flex flex-md-row flex-column">
    <v-card-title
      >{{ groupData.groupName }}
      <v-menu offset-y v-if="isMobile">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-dialog v-model="nameDialog.show" max-width="400px">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-on:click="showChangeGroupName" v-on="on" v-bind="attrs">
                <v-list-item-title>Đổi tên</v-list-item-title>
              </v-list-item>
            </template>
            <v-card class="pa-2">
              <v-card-title>Đổi tên</v-card-title>
              <v-text-field
                placeholder="Tên mới"
                v-model="groupUp.groupName"
                class="ma-3"
              ></v-text-field>
              <v-card-actions class="d-flex justify-center">
                <v-btn color="grey darken-1" text @click="nameDialog.show = false">
                  Hủy
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="
                    nameDialog.show = false;
                    updateHostelGroup();
                  "
                >
                  Đổi tên
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="serviceDialog.show"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-on:click="showManageService" v-on="on" v-bind="attrs">
                <v-list-item-title>Quản lí dịch vụ</v-list-item-title>
              </v-list-item>
            </template>
            <v-toolbar dark color="#727CF5">
              <v-btn icon dark @click="serviceDialog.show = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >Dịch vụ của
                <span class="font-weight-bold">{{ groupData.groupName }}</span></v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  dark
                  text
                  @click="
                    serviceDialog.show = false;
                    updateService();
                  "
                >
                  <v-icon left>sync</v-icon>
                  Lưu thay đổi</v-btn
                >
              </v-toolbar-items>
            </v-toolbar>
            <v-card class="ma-4">
              <ServiceEditor :groupService="groupData.services" :create="false" :update="true" />
            </v-card>
          </v-dialog>
          <v-list-item v-on:click="showManagePolicy">
            <v-list-item-title>Quản lí nội quy</v-list-item-title>
          </v-list-item>
          <v-dialog
            v-model="typeDialog.show"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item v-on:click="showCreateNewType" v-bind="attrs" v-on="on">
                <v-list-item-title>Tạo loại phòng mới</v-list-item-title>
              </v-list-item>
            </template>
            <v-toolbar dark color="#727CF5">
              <v-btn icon dark @click="closeAddType()">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title
                >Tạo nhà trọ mới của
                <span class="font-weight-bold">{{ groupData.groupName }}</span></v-toolbar-title
              >
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  dark
                  text
                  @click="
                    typeDialog.show = false;
                    createType();
                  "
                >
                  <v-icon left>add</v-icon>
                  Tạo ngay</v-btn
                >
              </v-toolbar-items>
            </v-toolbar>
            <v-card class="ma-4">
              <v-container fluid>
                <div class="hidden-sm-and-up">
                  <v-col cols="12" sm="4">
                    <!-- Info -->
                    <span class="text-h6"><v-icon>info</v-icon> Thông tin cơ bản</span>
                    <v-text-field
                      v-model="type.title"
                      hide-details
                      prefix="Tên loại phòng:"
                      prepend-icon="closed_caption"
                    />
                    <v-text-field
                      type="number"
                      v-model="type.price"
                      prefix="Giá:"
                      suffix="triệu"
                      prepend-icon="local_offer"
                    ></v-text-field>
                    <v-text-field
                      type="number"
                      v-model="type.deposit"
                      prefix="Tiền đặt cọc:"
                      suffix="triệu"
                      prepend-icon="local_offer"
                    ></v-text-field>
                    <v-text-field
                      type="number"
                      v-model="type.superficiality"
                      prefix="Diện tích:"
                      prepend-icon="crop"
                      suffix="m²"
                    ></v-text-field>
                    <v-text-field
                      type="number"
                      v-model="type.capacity"
                      suffix="người ở"
                      prepend-icon="group"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <!-- facility -->
                    <div>
                      <span class="text-h6"><v-icon>king_bed</v-icon> Tiện ích</span>
                      <!-- <div>index {{ facilitiesIndex}}</div>
                                  <div>id {{ getFacilityFromIndex}}</div> -->
                      <v-row>
                        <v-chip-group column multiple v-model="facilitiesIndex" class="ml-3">
                          <v-chip
                            v-for="facility in getFacilitiesData"
                            :key="facility.facilityId"
                            filter
                            outlined
                          >
                            {{ facility.facilityName }}
                          </v-chip>
                        </v-chip-group>
                      </v-row>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <!-- room -->
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
                                <v-btn color="blue darken-1" text @click="close">
                                  Hủy
                                </v-btn>
                                <v-btn color="blue darken-1" text @click="save">
                                  Tạo
                                </v-btn>
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
                        <v-icon small @click="deleteItem(item)">
                          mdi-delete
                        </v-icon>
                      </template>
                      <template v-slot:no-data>
                        Không có phòng trọ
                      </template>
                    </v-data-table>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <!-- image -->
                    <div class="d-flex flex-row flex-wrap align-center justify-center">
                      <v-dialog v-model="dialog.show" width="350">
                        <v-card height="350" :loading="isFileUploading">
                          <div class="d-flex flex-column align-center justify-center">
                            <input
                              type="file"
                              @change="onFileChange"
                              ref="fileSelect"
                              multiple
                              lang="vi"
                              accept="image/*"
                              class="ma-2"
                            />
                            <div class="d-flex flex-wrap" style="height: 250px; overflow-y: auto;">
                              <v-img
                                v-for="url in upload.imageUrls"
                                :key="url"
                                :src="url"
                                height="100"
                                width="100"
                                class="ma-1 elevation-2"
                              ></v-img>
                            </div>
                          </div>
                          <v-card-actions>
                            <v-spacer />
                            <v-btn
                              color="primary"
                              v-if="this.upload.imageUrls.length > 0"
                              @click="uploadImages"
                            >
                              <v-icon>cloud_upload</v-icon> Tải lên
                            </v-btn>
                            <v-spacer />
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <span
                        class="text-h6"
                        v-if="this.upload.imageUrls && this.upload.imageUrls.length > 0"
                        ><v-icon left>insert_photo</v-icon>Hình ảnh</span
                      >
                      <v-row>
                        <v-col cols="12">
                          <v-btn class="ml-2" @click="openImageUploadDialog" depressed>
                            <v-icon>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                          >
                        </v-col>
                        <v-col cols="12">
                          <div
                            style="height: 300px; overflow-y: auto;"
                            class="d-flex flex-row flex-wrap align-start justify-start"
                          >
                            <div v-for="image in upload.imageUrls" :key="image">
                              <v-img
                                :src="image"
                                :lazy-src="image"
                                aspect-ratio="1"
                                class="grey lighten-2 ma-2"
                                height="120"
                                width="120"
                              >
                                <template v-slot:placeholder>
                                  <v-row class="fill-height ma-0" align="center" justify="center">
                                    <v-progress-circular
                                      indeterminate
                                      color="grey lighten-5"
                                    ></v-progress-circular>
                                  </v-row>
                                </template>
                                <v-row class="fill-height ma-0" align="center" justify="center">
                                  <v-btn icon depressed color="blue-grey">
                                    <v-icon color="red">delete_forever</v-icon>
                                  </v-btn>
                                </v-row>
                              </v-img>
                            </div>
                          </div>
                        </v-col>
                      </v-row>

                      <v-snackbar
                        v-model="snackBarMixin.show"
                        :multi-line="snackBarMixin.multiLine"
                        :timeout="snackBarMixin.timeout"
                        :absolute="snackBarMixin.absolute"
                        :color="snackBarMixin.color"
                      >
                        {{ snackBarMixin.message }}

                        <template v-slot:action="{ attrs }">
                          <v-btn
                            color="red"
                            text
                            v-bind="attrs"
                            @click="snackBarMixin.show = false"
                          >
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </div>
                  </v-col>
                </div>
              </v-container>
            </v-card>
          </v-dialog>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-actions class="d-flex flex-row flex-wrap" v-if="!isMobile">
      <v-dialog v-model="nameDialog.show" max-width="400px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            depressed
            outlined
            rounded
            color="green"
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            small
          >
            <v-icon left>edit</v-icon>
            Đổi tên
          </v-btn>
        </template>
        <v-card class="pa-2">
          <v-card-title>Đổi tên</v-card-title>
          <v-text-field
            placeholder="Tên mới"
            v-model="groupUp.groupName"
            class="ma-3"
          ></v-text-field>
          <v-card-actions class="d-flex justify-center">
            <v-btn color="grey darken-1" text @click="nameDialog.show = false">
              Hủy
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="
                nameDialog.show = false;
                updateHostelGroup();
              "
            >
              Đổi tên
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="serviceDialog.show"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            depressed
            outlined
            rounded
            color="blue"
            v-bind="attrs"
            v-on="on"
            class="ma-1"
            small
          >
            <v-icon left>local_laundry_service</v-icon>
            Quản lí dịch vụ
          </v-btn>
        </template>
        <v-toolbar dark color="#727CF5">
          <v-btn icon dark @click="serviceDialog.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >Dịch vụ của
            <span class="font-weight-bold">{{ groupData.groupName }}</span></v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="
                serviceDialog.show = false;
                updateService();
              "
            >
              <v-icon left>sync</v-icon>
              Lưu thay đổi</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-card class="ma-4">
          <ServiceEditor :groupService="groupData.services" :create="false" :update="true" />
        </v-card>
      </v-dialog>
      <v-btn depressed outlined rounded class="ma-1" color="red" small>
        <v-icon left>rule</v-icon>
        Nội quy
      </v-btn>
      <v-dialog
        v-model="typeDialog.show"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            depressed
            outlined
            rounded
            class="ma-1"
            color="amber"
            small
            v-on="on"
            v-bind="attrs"
          >
            <v-icon left>add</v-icon>
            Tạo nhà trọ mới
          </v-btn>
        </template>
        <v-toolbar dark color="#727CF5">
          <v-btn icon dark @click="closeAddType()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title
            >Tạo nhà trọ mới của
            <span class="font-weight-bold">{{ groupData.groupName }}</span></v-toolbar-title
          >
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="
                typeDialog.show = false;
                createType();
              "
            >
              <v-icon left>add</v-icon>
              Tạo ngay</v-btn
            >
          </v-toolbar-items>
        </v-toolbar>
        <v-card class="ma-4">
          <v-container fluid>
            <v-row class="hidden-sm-and-down">
              <v-col cols="1" />
              <v-col cols="10" class="mt-5">
                <v-card>
                  <v-row class="ma-1">
                    <v-col cols="6">
                      <v-row>
                        <v-col cols="12">
                          <span class="text-h6"><v-icon>info</v-icon> Thông tin cơ bản</span>
                          <v-text-field
                            v-model="type.title"
                            hide-details
                            prefix="Tên loại phòng:"
                            prepend-icon="closed_caption"
                          />
                          <v-text-field
                            type="number"
                            v-model="type.price"
                            prefix="Giá:"
                            suffix="triệu"
                            prepend-icon="local_offer"
                          ></v-text-field>
                          <v-text-field
                            type="number"
                            v-model="type.deposit"
                            prefix="Tiền đặt cọc:"
                            suffix="triệu"
                            prepend-icon="local_offer"
                          ></v-text-field>
                          <v-text-field
                            type="number"
                            v-model="type.superficiality"
                            prefix="Diện tích:"
                            prepend-icon="crop"
                            suffix="m²"
                          ></v-text-field>
                          <v-text-field
                            type="number"
                            v-model="type.capacity"
                            suffix="người ở"
                            prepend-icon="group"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                          <!-- facility -->
                          <div>
                            <span class="text-h6"><v-icon>king_bed</v-icon> Tiện ích</span>
                            <!-- <div>index {{ facilitiesIndex}}</div>
                              <div>id {{ getFacilityFromIndex}}</div> -->
                            <v-row>
                              <v-chip-group column multiple v-model="facilitiesIndex" class="ml-3">
                                <v-chip
                                  v-for="facility in getFacilitiesData"
                                  :key="facility.facilityId"
                                  filter
                                  outlined
                                >
                                  {{ facility.facilityName }}
                                </v-chip>
                              </v-chip-group>
                            </v-row>
                          </div>
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
                                    <v-btn
                                      color="#727CF5"
                                      dark
                                      class="mb-2"
                                      v-bind="attrs"
                                      v-on="on"
                                    >
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
                                      <v-btn color="blue darken-1" text @click="close">
                                        Hủy
                                      </v-btn>
                                      <v-btn color="blue darken-1" text @click="save">
                                        Tạo
                                      </v-btn>
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
                              <v-icon small @click="deleteItem(item)">
                                mdi-delete
                              </v-icon>
                            </template>
                            <template v-slot:no-data>
                              Không có phòng trọ
                            </template>
                          </v-data-table>
                        </v-col>
                        <v-col cols="12">
                          <!-- image -->
                          <div class="d-flex flex-row flex-wrap align-center justify-center">
                            <v-dialog v-model="dialog.show" width="350">
                              <v-card height="350" :loading="isFileUploading">
                                <div class="d-flex flex-column align-center justify-center">
                                  <input
                                    type="file"
                                    @change="onFileChange"
                                    ref="fileSelect"
                                    multiple
                                    lang="vi"
                                    accept="image/*"
                                    class="ma-2"
                                  />
                                  <div
                                    class="d-flex flex-wrap"
                                    style="height: 250px; overflow-y: auto;"
                                  >
                                    <v-img
                                      v-for="url in upload.imageUrls"
                                      :key="url"
                                      :src="url"
                                      height="100"
                                      width="100"
                                      class="ma-1 elevation-2"
                                    ></v-img>
                                  </div>
                                </div>
                                <v-card-actions>
                                  <v-spacer />
                                  <v-btn
                                    color="primary"
                                    v-if="this.upload.imageUrls.length > 0"
                                    @click="uploadImages"
                                  >
                                    <v-icon>cloud_upload</v-icon> Tải lên
                                  </v-btn>
                                  <v-spacer />
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                            <span
                              class="text-h6"
                              v-if="this.upload.imageUrls && this.upload.imageUrls.length > 0"
                              ><v-icon left>insert_photo</v-icon>Hình ảnh</span
                            >
                            <!-- <span class="text-h6"
                                ><v-icon left>insert_photo</v-icon>Hình ảnh</span
                              > -->
                            <v-row>
                              <v-col cols="12">
                                <v-btn class="ml-2" @click="openImageUploadDialog" depressed>
                                  <v-icon>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                                >
                              </v-col>
                              <v-col cols="12">
                                <div
                                  style="height: 300px; overflow-y: auto;"
                                  class="d-flex flex-row flex-wrap align-start justify-start"
                                >
                                  <div v-for="image in upload.imageUrls" :key="image">
                                    <v-img
                                      :src="image"
                                      :lazy-src="image"
                                      aspect-ratio="1"
                                      class="grey lighten-2 ma-2"
                                      height="120"
                                      width="120"
                                    >
                                      <template v-slot:placeholder>
                                        <v-row
                                          class="fill-height ma-0"
                                          align="center"
                                          justify="center"
                                        >
                                          <v-progress-circular
                                            indeterminate
                                            color="grey lighten-5"
                                          ></v-progress-circular>
                                        </v-row>
                                      </template>
                                      <v-row
                                        class="fill-height ma-0"
                                        align="center"
                                        justify="center"
                                      >
                                        <v-btn icon depressed color="blue-grey">
                                          <v-icon color="red">delete_forever</v-icon>
                                        </v-btn>
                                      </v-row>
                                    </v-img>
                                  </div>
                                </div>
                              </v-col>
                            </v-row>

                            <v-snackbar
                              v-model="snackBarMixin.show"
                              :multi-line="snackBarMixin.multiLine"
                              :timeout="snackBarMixin.timeout"
                              :absolute="snackBarMixin.absolute"
                              :color="snackBarMixin.color"
                            >
                              {{ snackBarMixin.message }}

                              <template v-slot:action="{ attrs }">
                                <v-btn
                                  color="red"
                                  text
                                  v-bind="attrs"
                                  @click="snackBarMixin.show = false"
                                >
                                  Close
                                </v-btn>
                              </template>
                            </v-snackbar>
                          </div>
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
                <!-- Info -->
                <span class="text-h6"><v-icon>info</v-icon> Thông tin cơ bản</span>
                <v-text-field
                  v-model="type.title"
                  hide-details
                  prefix="Tên loại phòng:"
                  prepend-icon="closed_caption"
                />
                <v-text-field
                  type="number"
                  v-model="type.price"
                  prefix="Giá:"
                  suffix="triệu"
                  prepend-icon="local_offer"
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model="type.deposit"
                  prefix="Tiền đặt cọc:"
                  suffix="triệu"
                  prepend-icon="local_offer"
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model="type.superficiality"
                  prefix="Diện tích:"
                  prepend-icon="crop"
                  suffix="m²"
                ></v-text-field>
                <v-text-field
                  type="number"
                  v-model="type.capacity"
                  suffix="người ở"
                  prepend-icon="group"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="4">
                <!-- facility -->
                <div>
                  <span class="text-h6"><v-icon>king_bed</v-icon> Tiện ích</span>
                  <!-- <div>index {{ facilitiesIndex}}</div>
                              <div>id {{ getFacilityFromIndex}}</div> -->
                  <v-row>
                    <v-chip-group column multiple v-model="facilitiesIndex" class="ml-3">
                      <v-chip
                        v-for="facility in getFacilitiesData"
                        :key="facility.facilityId"
                        filter
                        outlined
                      >
                        {{ facility.facilityName }}
                      </v-chip>
                    </v-chip-group>
                  </v-row>
                </div>
              </v-col>
              <v-col cols="12" sm="4">
                <!-- room -->
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
                            <v-btn color="blue darken-1" text @click="close">
                              Hủy
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                              Tạo
                            </v-btn>
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
                    <v-icon small @click="deleteItem(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <template v-slot:no-data>
                    Không có phòng trọ
                  </template>
                </v-data-table>
              </v-col>
              <v-col cols="12" sm="4">
                <!-- image -->
                <div class="d-flex flex-row flex-wrap align-center justify-center">
                  <v-dialog v-model="dialog.show" width="350">
                    <v-card height="350" :loading="isFileUploading">
                      <div class="d-flex flex-column align-center justify-center">
                        <input
                          type="file"
                          @change="onFileChange"
                          ref="fileSelect"
                          multiple
                          lang="vi"
                          accept="image/*"
                          class="ma-2"
                        />
                        <div class="d-flex flex-wrap" style="height: 250px; overflow-y: auto;">
                          <v-img
                            v-for="url in upload.imageUrls"
                            :key="url"
                            :src="url"
                            height="100"
                            width="100"
                            class="ma-1 elevation-2"
                          ></v-img>
                        </div>
                      </div>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          color="primary"
                          v-if="this.upload.imageUrls.length > 0"
                          @click="uploadImages"
                        >
                          <v-icon>cloud_upload</v-icon> Tải lên
                        </v-btn>
                        <v-spacer />
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <span
                    class="text-h6"
                    v-if="this.upload.imageUrls && this.upload.imageUrls.length > 0"
                    ><v-icon left>insert_photo</v-icon>Hình ảnh</span
                  >
                  <v-row>
                    <v-col cols="12">
                      <v-btn class="ml-2" @click="openImageUploadDialog" depressed>
                        <v-icon>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                      >
                    </v-col>
                    <v-col cols="12">
                      <div
                        style="height: 300px; overflow-y: auto;"
                        class="d-flex flex-row flex-wrap align-start justify-start"
                      >
                        <div v-for="image in upload.imageUrls" :key="image">
                          <v-img
                            :src="image"
                            :lazy-src="image"
                            aspect-ratio="1"
                            class="grey lighten-2 ma-2"
                            height="120"
                            width="120"
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <v-progress-circular
                                  indeterminate
                                  color="grey lighten-5"
                                ></v-progress-circular>
                              </v-row>
                            </template>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-btn icon depressed color="blue-grey">
                                <v-icon color="red">delete_forever</v-icon>
                              </v-btn>
                            </v-row>
                          </v-img>
                        </div>
                      </div>
                    </v-col>
                  </v-row>

                  <v-snackbar
                    v-model="snackBarMixin.show"
                    :multi-line="snackBarMixin.multiLine"
                    :timeout="snackBarMixin.timeout"
                    :absolute="snackBarMixin.absolute"
                    :color="snackBarMixin.color"
                  >
                    {{ snackBarMixin.message }}

                    <template v-slot:action="{ attrs }">
                      <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false">
                        Close
                      </v-btn>
                    </template>
                  </v-snackbar>
                </div>
              </v-col>
            </div>
          </v-container>
        </v-card>
      </v-dialog>
      <!-- <v-snackbar
        v-model="snackBarMixin.show"
        :multi-line="snackBarMixin.multiLine"
        :timeout="snackBarMixin.timeout"
        :absolute="snackBarMixin.absolute"
        :color="snackBarMixin.color"
      >
        {{ snackBarMixin.message }}

        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar> -->
    </v-card-actions>
  </v-card>
</template>
<script>
// import { delete } from 'vue/types/umd';
import { mapActions, mapState } from 'vuex';
import fileMixins from '../../mixins/file';
import snackBarMixin from '../../mixins/snackBar';
import ServiceEditor from './HostelGroupServiceEditor.vue';

export default {
  name: 'HostelGroupAction',
  props: ['groupData'],
  mixins: [fileMixins, snackBarMixin],
  components: { ServiceEditor },
  data: () => ({
    nameDialog: {
      show: false,
      name: '',
    },
    serviceDialog: {
      show: false,
    },
    typeDialog: {
      show: false,
    },
    optionsForGroup: [
      { title: 'Đổi tên', action: 'showChangeGroupName' },
      { title: 'Quản lí dịch vụ', action: 'showManageService' },
      { title: 'Nội quy', action: 'showManagePolicy' },
      { title: 'Tạo nhà trọ mới', action: 'showCreateNewType' },
    ],
    groupUp: {
      groupId: 0,
      curfewTime: '',
      downPayment: 0,
      groupName: '',
      imgUrl: '',
      managerName: '',
      managerPhone: '',
      ownerJoin: false,
    },
    serviceUp: {},
    type: {
      capacity: null,
      categoryId: null,
      deposit: null,
      facilityIds: [],
      groupId: null,
      imageUrls: [null],
      price: null,
      roomNames: [null],
      statusId: null,
      superficiality: null,
      title: null,
      typeId: null,
    },
    typeDemo: [
      {
        capacity: null,
        categoryId: null,
        deposit: null,
        facilityIds: [],
        groupId: null,
        imageUrls: [null],
        price: null,
        roomNames: [null],
        statusId: null,
        superficiality: null,
        title: null,
        typeId: null,
      },
    ],
    facilitiesIndex: [],
    dialog: {
      show: false,
      files: null,
    },
    upload: {
      imageUrls: [],
    },
    dialogR: false,
    dialogDelete: false,
    headers: [
      {
        text: 'Tên phòng',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Chức năng', value: 'actions', sortable: false },
    ],
    rooms: [],
    editedIndex: -1,
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),
  methods: {
    ...mapActions({
      updateGroup: 'vendor/group/updateHostelGroup',
      getAllFacilities: 'renter/common/getAllFacilities1',
      createHostelType: 'vendor/group/createHostelType',
    }),
    closeAddType() {
      this.typeDialog.show = false;
      this.type = this.typeDemo;
    },
    showChangeGroupName() {
      this.nameDialog.show = true;
      console.log(`alo${this.nameDialog.show}`);
    },
    updateHostelGroup() {
      this.groupUp.groupId = this.groupData.groupId;
      this.groupUp.curfewTime = this.groupData.curfewTime;
      this.groupUp.downPayment = this.groupData.downPayment;
      this.groupUp.imgUrl = this.groupData.imgUrl;
      this.groupUp.managerName = this.groupData.managerName;
      this.groupUp.managerPhone = this.groupData.managerPhone;
      this.groupUp.ownerJoin = this.groupData.ownerJoin;

      console.log(this.groupUp);
      // this.updateGroup(this.groupUp).then(() => this.checkUpdateGroup());
      this.updateGroup(this.groupUp);
    },
    checkUpdateGroup() {
      if (this.groups.success) {
        this.showSnackBar('Đổi tên thành công', {
          color: 'green',
        });
      } else {
        this.showSnackBar('Đổi tên thất bại', { color: 'red' });
      }
    },
    showManageService() {
      this.serviceDialog.show = true;
    },
    updateService() {},
    showManagePolicy() {},
    showCreateNewType() {
      this.typeDialog.show = true;
    },
    // image
    openImageUploadDialog() {
      this.dialog.show = true;
      this.$nextTick(() => this.$refs.fileSelect.click());
    },
    onFileChange(e) {
      console.log(e.target.files);
      const { files } = e.target;
      this.files = files;
      this.upload.imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    },
    uploadImages() {
      const fd = new FormData();
      Array.from(this.files).forEach((file) => {
        fd.append('files', file, file.data);
      });
      this.uploadFile(fd)
        .then(() => {
          this.upload.imageUrls = this.listUploadedFiles;
          this.dialog.show = false;
          this.showSnackBar('Tải ảnh lên thành công', { color: 'green' });
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
    // room
    editItem(item) {
      this.editedIndex = this.rooms.indexOf(item);
      this.editedItem = { ...item };
      this.dialogR = true;
    },

    deleteItem(item) {
      this.editedIndex = this.rooms.indexOf(item);
      this.editedItem = { ...item };
      // this.dialogDelete = true;
      this.deleteItemConfirm();
    },

    deleteItemConfirm() {
      this.rooms.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialogR = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem };
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.rooms[this.editedIndex], this.editedItem);
      } else {
        this.rooms.push(this.editedItem);
      }
      this.close();
    },
    // create type
    getRooms() {
      return this.rooms.map((item) => item.name);
    },
    createType() {
      this.type.categoryId = 1;
      this.type.facilityIds = this.getFacilityFromIndex;
      this.type.groupId = this.groupData.groupId;
      this.type.imageUrls = this.upload.imageUrls;
      this.type.roomNames = this.getRooms();
      this.type.statusId = 1;
      console.log(JSON.stringify(this.type));
      this.createHostelType(this.type);
    },
  },
  watch: {
    upload: {
      handler() {
        this.$emit('newValues', this.upload.imageUrls);
      },
      deep: true,
    },
    dialog(val) {
      return val || this.close();
    },
    dialogDelete(val) {
      return val || this.closeDelete();
    },
  },
  computed: {
    ...mapState({
      groups: (state) => state.vendor.group.groups,
      facilities: (state) => state.renter.common.facilities,
    }),
    getFacilityFromIndex() {
      return this.facilitiesIndex.map((item) => this.getFacilitiesData[item].facilityId);
    },
    getFacilitiesData() {
      return this.facilities.data;
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
    formTitle() {
      return this.editedIndex === -1 ? 'Tạo phòng' : 'Cập nhật phòng';
    },
  },
  created() {
    if (this.facilities.data.length === 0) {
      this.getAllFacilities();
    }
  },
};
</script>
