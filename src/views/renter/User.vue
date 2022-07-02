<template>
  <v-container>
    <v-overlay :value="user.isLoading || user.isUpdating" absolute>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar
      v-model="snackBarMixin.show"
      :multi-line="snackBarMixin.multiLine"
      :timeout="snackBarMixin.timeout"
      :absolute="snackBarMixin.absolute"
      :color="snackBarMixin.color"
    >
      {{ snackBarMixin.message }}

      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackBarMixin.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="dialog.show" width="350">
      <v-card height="350" :loading="isFileUploading">
        <div class="d-flex flex-column align-center justify-center">
          <input
            type="file"
            @change="onFileChange"
            ref="fileSelect"
            lang="vi"
            accept="image/*"
            class="ma-2"
          />
          <div class="d-flex flex-wrap" style="height: 250px; overflow-y: auto">
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
          <v-btn color="primary" v-if="this.upload.imageUrls.length > 0" @click="uploadImages">
            <v-icon>cloud_upload</v-icon> Tải lên
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEmptyFields.show" max-width="400">
      <v-card>
        <v-card-title class="d-flex flex-column justify-center px-8">
          Vui lòng điền đầy đủ các trường sau:
        </v-card-title>
        <v-card-text>
          <span v-for="name in showEmptyFields.fields" :key="name"> {{ name }}, </span>
        </v-card-text>
        <v-card-actions>
          <v-btn icon @click="showEmptyFields.show = false">
            <v-icon>clear</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card v-if="!user.isLoading" class="font-nunito mt-10">
      <v-row>
        <v-col cols="12" md="3" class="pt-10">
          <div class="d-flex flex-column justify-center align-center">
            <v-avatar size="128" v-if="!editProfile" class="pb-3">
              <v-img :src="user.data.avatar || noAvatar"> </v-img>
            </v-avatar>
            <v-avatar size="128" v-if="editProfile" class="pb-3">
              <v-img :src="newUser.avatar || noAvatar">
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-btn icon @click="uploadAvatarImage">
                    <v-icon color="white">edit</v-icon>
                  </v-btn>
                </v-row>
              </v-img>
            </v-avatar>
            <v-btn color="#727CF5" v-if="!editProfile" @click="prepareToEditProfile" dark>
              <v-icon left>edit</v-icon> Sửa hồ sơ
            </v-btn>
            <v-btn color="#727CF5" v-if="editProfile" @click="editProfile = false" dark>
              <v-icon left>cancel</v-icon> Hủy
            </v-btn>
          </div>
        </v-col>
        <v-col cols="12" md="9" style="border-left: 1px solid lightgray" class="mt-3 pa-0 py-0">
          <v-row no-gutters class="hidden-sm-and-down">
            <v-col cols="6" class="pl-5">
              <v-row no-gutters v-if="!editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >{{ user.data.role === 'RENTER' ? 'Khách thuê' : '' }}
                        {{ user.data.role === 'VENDOR' ? 'Chủ trọ' : '' }}</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.username }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Năm sinh</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.yearOfBirth }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Quê quán</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.hometown.provinceName }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Trường đại học</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.school.schoolName }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Số điện thoại</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.phone }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Email</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.email }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="editProfile">
                <v-col cols="12" md="8" class="d-flex flex-column justify-center pt-2">
                  <span class="field-name font-weight-medium"
                    >{{ user.data.role === 'RENTER' ? 'Khách thuê' : '' }}
                    {{ user.data.role === 'VENDOR' ? 'Chủ trọ' : '' }}</span
                  >
                  <div>
                    <v-text-field
                      color="#727CF5"
                      v-model="newUser.username"
                      dense
                      solo
                      clearable
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                  <span class="field-name font-weight-medium">Năm sinh</span>
                  <div>
                    <v-text-field
                      color="#727CF5"
                      v-model="newUser.yearOfBirth"
                      type="number"
                      :step="1"
                      :min="1900"
                      solo
                      dense
                      clearable
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                  <span class="field-name font-weight-medium">Quê quán</span>
                  <div>
                    <v-autocomplete
                      v-model="newUser.hometown.provinceId"
                      :items="provinces.items"
                      item-text="provinceName"
                      item-value="provinceId"
                      color="#727CF5"
                      dense
                      solo
                    ></v-autocomplete>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                  <span class="field-name font-weight-medium">Trường đại học</span>
                  <div>
                    <v-autocomplete
                      v-model="newUser.school.schoolId"
                      :items="schools.items"
                      item-text="schoolName"
                      item-value="schoolId"
                      color="#727CF5"
                      dense
                      solo
                    ></v-autocomplete>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                  <span class="field-name font-weight-medium">Email</span>
                  <div>
                    <v-text-field
                      color="#727CF5"
                      v-model="newUser.email"
                      dense
                      solo
                      clearable
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="6" class="pr-5">
              <v-row no-gutters v-if="!editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Số CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.citizenIdNum }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Nơi cấp</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.idIssuedLocation }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Ngày cấp</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{
                          new Date(user.data.idIssuedDate).toLocaleDateString('vi')
                        }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Địa chỉ thường trú</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.householdAddress }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Địa chỉ hiện tại</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.currentAddress }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center pt-2">
                      <span class="field-name font-weight-medium">Số CMND</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          type="number"
                          v-model="newUser.citizenIdNum"
                          dense
                          solo
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                      <span class="field-name font-weight-medium">Nơi cấp</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          v-model="newUser.idIssuedLocation"
                          dense
                          solo
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                      <span class="field-name font-weight-medium">Ngày cấp</span>
                      <div>
                        <v-menu
                          v-model="menu1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="datePicker.value"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              class="pt-0"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            locale="vi-vn"
                            v-model="datePicker.value"
                            color="#727CF5"
                            :no-title="true"
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                      <span class="field-name font-weight-medium">Địa chỉ thường trú</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          v-model="newUser.householdAddress"
                          dense
                          solo
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center">
                      <span class="field-name font-weight-medium">Địa chỉ hiện tại</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          v-model="newUser.currentAddress"
                          dense
                          solo
                          full-width
                          single-line
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pl-3 pt-10 pr-3">
              <v-row no-gutters v-if="!editProfile">
                <v-col cols="6">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt trước CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2 d-flex justify-center pl-3 pr-3"
                      >
                        <p v-if="!user.data.citizenIdFrontImg" class="d-flex justify-center">
                          Thiếu ảnh
                        </p>
                        <v-img
                          height="240"
                          width="260"
                          v-if="user.data.citizenIdFrontImg"
                          :src="user.data.citizenIdFrontImg"
                        >
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt sau CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2 d-flex justify-center pl-3 pr-3"
                      >
                        <p v-if="!user.data.citizenIdBackImg" class="d-flex justify-center">
                          Thiếu ảnh
                        </p>
                        <v-img
                          height="240"
                          width="260"
                          v-if="user.data.citizenIdBackImg"
                          :src="user.data.citizenIdBackImg"
                        >
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="editProfile">
                <v-col cols="6">
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt trước CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="6" class="pt-1">
                      <v-btn v-if="editProfile" @click="uploadFrontIDCardImage" depressed small>
                        <v-icon left>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                      >
                    </v-col>
                    <v-col cols="12" md="10" class="pa-0 py-0 pt-2 pb-2 d-flex justify-center">
                      <v-img
                        height="240"
                        width="260"
                        v-if="newUser.citizenIdFrontImg"
                        :src="newUser.citizenIdFrontImg"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="6">
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt sau CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="6" class="pt-1">
                      <v-btn @click="uploadBackIDCardImage" depressed small>
                        <v-icon left>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                      >
                    </v-col>
                    <v-col cols="12" md="10" class="pa-0 py-0 pt-2 pb-2 d-flex justify-center">
                      <v-img
                        height="240"
                        width="260"
                        v-if="newUser.citizenIdBackImg"
                        :src="newUser.citizenIdBackImg"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="d-flex justify-end pr-9 pb-5 pt-5">
              <v-btn v-if="updatable && editProfile" @click="updateUserInfo" color="#727CF5" dark>
                <v-icon left>update</v-icon> Cập nhật ngay
              </v-btn>
            </v-col>
          </v-row>
          <v-row no-gutters class="hidden-sm-and-up">
            <v-col cols="12" class="pl-5">
              <v-row no-gutters v-if="!editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >{{ user.data.role === 'RENTER' ? 'Khách thuê' : '' }}
                        {{ user.data.role === 'VENDOR' ? 'Chủ trọ' : '' }}</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.username }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Năm sinh</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.yearOfBirth }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Quê quán</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.hometown.provinceName }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Trường đại học</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.school.schoolName }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Số điện thoại</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.phone }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Email</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.email }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="editProfile">
                <v-col cols="12" md="8" class="d-flex flex-column justify-center pt-2 pr-4">
                  <span class="field-name font-weight-medium"
                    >{{ user.data.role === 'RENTER' ? 'Khách thuê' : '' }}
                    {{ user.data.role === 'VENDOR' ? 'Chủ trọ' : '' }}</span
                  >
                  <div>
                    <v-text-field
                      color="#727CF5"
                      v-model="newUser.username"
                      dense
                      solo
                      clearable
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                  <span class="field-name font-weight-medium">Năm sinh</span>
                  <div>
                    <v-text-field
                      color="#727CF5"
                      v-model="newUser.yearOfBirth"
                      type="number"
                      :step="1"
                      :min="1900"
                      solo
                      dense
                      clearable
                    ></v-text-field>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                  <span class="field-name font-weight-medium">Quê quán</span>
                  <div>
                    <v-autocomplete
                      v-model="newUser.hometown.provinceId"
                      :items="provinces.items"
                      item-text="provinceName"
                      item-value="provinceId"
                      color="#727CF5"
                      dense
                      solo
                    ></v-autocomplete>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                  <span class="field-name font-weight-medium">Trường đại học</span>
                  <div>
                    <v-autocomplete
                      v-model="newUser.school.schoolId"
                      :items="schools.items"
                      item-text="schoolName"
                      item-value="schoolId"
                      color="#727CF5"
                      dense
                      solo
                    ></v-autocomplete>
                  </div>
                </v-col>
                <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                  <span class="field-name font-weight-medium">Email</span>
                  <div>
                    <v-text-field
                      color="#727CF5"
                      v-model="newUser.email"
                      dense
                      solo
                      clearable
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pl-5">
              <v-row no-gutters v-if="!editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Số CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.citizenIdNum }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Nơi cấp</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{ user.data.idIssuedLocation }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Ngày cấp</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2"
                        >{{
                          new Date(user.data.idIssuedDate).toLocaleDateString('vi')
                        }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Địa chỉ thường trú</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2 pr-3"
                        >{{ user.data.householdAddress }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="4" class="d-flex justify-start">
                      <v-card-text style="font-size: 16px" class="pa-0 py-0 pt-2 font-weight-medium"
                        >Địa chỉ hiện tại</v-card-text
                      >
                    </v-col>
                    <v-col cols="8" class="d-flex justify-start">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2 pr-3"
                        >{{ user.data.currentAddress }}</v-card-text
                      >
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center pt-2 pr-4">
                      <span class="field-name font-weight-medium">Số CMND</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          type="number"
                          v-model="newUser.citizenIdNum"
                          dense
                          solo
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                      <span class="field-name font-weight-medium">Nơi cấp</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          v-model="newUser.idIssuedLocation"
                          dense
                          solo
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                      <span class="field-name font-weight-medium">Ngày cấp</span>
                      <div>
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="datePicker.value"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              class="pt-0"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            locale="vi-vn"
                            v-model="datePicker.value"
                            color="#727CF5"
                            :no-title="true"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                      <span class="field-name font-weight-medium">Địa chỉ thường trú</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          v-model="newUser.householdAddress"
                          dense
                          solo
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12" md="8" class="d-flex flex-column justify-center pr-4">
                      <span class="field-name font-weight-medium">Địa chỉ hiện tại</span>
                      <div>
                        <v-text-field
                          color="#727CF5"
                          v-model="newUser.currentAddress"
                          dense
                          solo
                          full-width
                          single-line
                          clearable
                        ></v-text-field>
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="pl-3 pt-10 pr-3">
              <v-row no-gutters v-if="!editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt trước CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2 d-flex justify-center pl-3 pr-3"
                      >
                        <p v-if="!user.data.citizenIdFrontImg" class="d-flex justify-center">
                          Thiếu ảnh
                        </p>
                        <v-img
                          height="240"
                          width="260"
                          v-if="user.data.citizenIdFrontImg"
                          :src="user.data.citizenIdFrontImg"
                        >
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt sau CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="12">
                      <v-card-text
                        style="font-size: 16px"
                        class="font-weight-bold pa-0 py-0 pt-2 pb-2 d-flex justify-center pl-3 pr-3"
                      >
                        <p v-if="!user.data.citizenIdBackImg" class="d-flex justify-center">
                          Thiếu ảnh
                        </p>
                        <v-img
                          height="240"
                          width="260"
                          v-if="user.data.citizenIdBackImg"
                          :src="user.data.citizenIdBackImg"
                        >
                          <template v-slot:placeholder>
                            <v-row class="fill-height ma-0" align="center" justify="center">
                              <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                              ></v-progress-circular>
                            </v-row>
                          </template>
                        </v-img>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row no-gutters v-if="editProfile">
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt trước CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="6" class="pt-1">
                      <v-btn v-if="editProfile" @click="uploadFrontIDCardImage" depressed small>
                        <v-icon left>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                      >
                    </v-col>
                    <v-col cols="12" md="10" class="pa-0 py-0 pt-2 pb-2 d-flex justify-center">
                      <v-img
                        height="240"
                        width="260"
                        v-if="newUser.citizenIdFrontImg"
                        :src="newUser.citizenIdFrontImg"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="6">
                      <v-card-text
                        style="font-size: 16px"
                        class="pa-0 py-0 pt-2 font-weight-medium d-flex justify-center"
                        >Mặt sau CMND</v-card-text
                      >
                    </v-col>
                    <v-col cols="6" class="pt-1">
                      <v-btn @click="uploadBackIDCardImage" depressed small>
                        <v-icon left>add_photo_alternate</v-icon>Tải lên ảnh mới</v-btn
                      >
                    </v-col>
                    <v-col cols="12" md="10" class="pa-0 py-0 pt-2 pb-2 d-flex justify-center">
                      <v-img
                        height="240"
                        width="260"
                        v-if="user.data.citizenIdBackImg"
                        :src="user.data.citizenIdBackImg"
                      >
                        <template v-slot:placeholder>
                          <v-row class="fill-height ma-0" align="center" justify="center">
                            <v-progress-circular
                              indeterminate
                              color="grey lighten-5"
                            ></v-progress-circular>
                          </v-row>
                        </template>
                      </v-img>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="d-flex justify-end pr-9 pb-5 pt-5">
              <v-btn v-if="updatable && editProfile" @click="updateUserInfo" color="#727CF5" dark>
                <v-icon left>update</v-icon> Cập nhật ngay
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import snackBarMixin from '../../components/mixins/snackBar';
import fileMixins from '../../components/mixins/file';

export default {
  name: 'User',
  mixins: [snackBarMixin, fileMixins],
  methods: {
    ...mapActions({
      getUser: 'user/getUser',
      updateUser: 'user/updateUser',
      getAllProvinces: 'renter/filterResult/getAllProvinces',
      getAllSchools: 'renter/filterResult/getAllSchools',
    }),
    prepareToEditProfile() {
      this.editProfile = true;
    },
    showEmptyField() {
      this.showEmptyFields.show = true;
      this.showEmptyFields.fields = this.emptyFields;
    },
    updateUserInfo() {
      if (this.emptyFields.length === 0) {
        this.updateUser(this.newUser).then(() => {
          this.updatable = false;
          this.editProfile = false;
          if (this.user.error) {
            this.showSnackBar('Cập nhật thông tin thất bại ', { color: 'red' });
          } else if (this.user.success) {
            this.showSnackBar('Cập nhật thông tin thành công', { color: 'green' });
          }
        });
      } else {
        this.showEmptyField();
      }
    },
    openImageUploadDialog() {
      this.dialog.show = true;
      this.$nextTick(() => this.$refs.fileSelect.click());
    },
    uploadFrontIDCardImage() {
      this.openImageUploadDialog();
      this.dialog.isUploadFrontIDCard = true;
    },
    uploadBackIDCardImage() {
      this.openImageUploadDialog();
      this.dialog.isUploadBackIDCard = true;
    },
    uploadAvatarImage() {
      this.openImageUploadDialog();
      this.dialog.isUploadAvatar = true;
    },
    onFileChange(e) {
      console.log(e.target.files);
      const { files } = e.target;
      this.files = files;
      this.upload.imageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    },
    bindImageUrlToUserObject() {
      if (this.dialog.isUploadBackIDCard) {
        [this.newUser.citizenIdBackImg] = this.upload.imageUrls;
        this.dialog.isUploadBackIDCard = false;
      } else if (this.dialog.isUploadFrontIDCard) {
        [this.newUser.citizenIdFrontImg] = this.upload.imageUrls;
        this.dialog.isUploadFrontIDCard = false;
      } else if (this.dialog.isUploadAvatar) {
        [this.newUser.avatar] = this.upload.imageUrls;
        this.dialog.isUploadAvatar = false;
      }
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
          this.bindImageUrlToUserObject();
        })
        .catch((error) => {
          console.log(error);
          this.showSnackBar('Tải ảnh lên thất bại', { color: 'red' });
        });
    },
    getIssuedDate(date) {
      const dateString = new Date(date).toLocaleDateString('vi');
      return `${dateString.split('/')[2]}-${dateString.split('/')[1]}-${dateString.split('/')[0]}`;
    },
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState({
      provinces: (state) => state.renter.filterResult.filter.hometown,
      schools: (state) => state.renter.filterResult.filter.schools,
    }),
    noAvatar() {
      return 'https://www.seekpng.com/png/full/428-4287240_no-avatar-user-circle-icon-png.png';
    },
    emptyFields() {
      const emptyFields = [];
      const { username } = this.newUser;
      if (!username) {
        emptyFields.push('Tên');
      }
      const { yearOfBirth } = this.newUser;
      if (!yearOfBirth) {
        emptyFields.push('năm sinh');
      }
      const { provinceId } = this.newUser.hometown;
      if (!provinceId) {
        emptyFields.push('quê quán');
      }
      const { schoolId } = this.newUser.school;
      if (!schoolId) {
        emptyFields.push('trường đại học');
      }
      const { email } = this.newUser;
      if (!email) {
        emptyFields.push('email');
      }
      const { citizenIdNum } = this.newUser;
      if (!citizenIdNum) {
        emptyFields.push('số CMNN');
      }
      const { idIssuedLocation } = this.newUser;
      if (!idIssuedLocation) {
        emptyFields.push('nơi cấp CMNN');
      }
      const { idIssuedDate } = this.newUser;
      if (!idIssuedDate) {
        emptyFields.push('ngày cấp CMNN');
      }
      const { householdAddress } = this.newUser;
      if (!householdAddress) {
        emptyFields.push('địa chỉ thường trú');
      }
      const { currentAddress } = this.newUser;
      if (!currentAddress) {
        emptyFields.push('địa chỉ hiện tại');
      }
      const { citizenIdFrontImg } = this.newUser;
      if (!citizenIdFrontImg) {
        emptyFields.push('ảnh mặt trước CMNN');
      }
      const { citizenIdBackImg } = this.newUser;
      if (!citizenIdBackImg) {
        emptyFields.push('ảnh mặt sau CMNN');
      }
      return emptyFields;
    },
  },
  data: () => ({
    showEmptyFields: {
      show: false,
      fields: [],
    },
    editProfile: false,
    newUser: null,
    updatable: false,
    dialog: {
      show: false,
      files: null,
      isUploadFrontIDCard: false,
      isUploadBackIDCard: false,
      isUploadAvatar: false,
    },
    upload: {
      imageUrls: [],
    },
    datePicker: {
      value: '',
    },
    menu2: false,
    menu1: false,
  }),
  watch: {
    newUser: {
      handler(newVal, oldVal) {
        if (oldVal === null) {
          console.log(newVal);
        } else {
          this.updatable = true;
        }
      },
      deep: true,
    },
    datePicker: {
      handler() {
        this.newUser.idIssuedDate = new Date(this.datePicker.value).getTime();
      },
      deep: true,
    },
  },
  created() {
    this.getUser().then(() => {
      this.newUser = { ...this.user.data };
      // this.newUser.school = {};
      // this.newUser.hometown = {};
    });
    this.getAllProvinces();
    this.getAllSchools();
  },
};
</script>
<style scoped>
.font-nunito {
  font-family: 'Nunito', sans-serif !important;
}
</style>
