<template>
  <v-app>
    <v-main>
      <v-container class="fill-height d-flex justify-center align-center">
        <v-row class="d-flex justify-center align-center red" style="position: relative">
          <v-col cols="11" xl="4" lg="4" sm="8" md="4" class="pa-0" style="position: absolute">
            <!-- account -->
            <v-card
              style="width: 100%; box-shadow: 0 0 35px 0 rgba(154, 161, 171, 0.15) !important"
              class="pb-4"
            >
              <div
                class="py-4 d-flex align-center"
                style="
                  background-color: #727cf5 !important;
                  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
                "
              >
                <div
                  style="height: 55px; width: 55px; border-radius: 50%"
                  class="white d-flex flex-column justify-center align-center ml-5"
                >
                  <v-img
                    alt="Hostel Renting"
                    class="shrink ml-1"
                    contain
                    src="@/assets/logo-sac.png"
                    transition="scale-transition"
                    max-width="50"
                    max-height="35"
                  />
                </div>
                <span class="font-nunito font-weight-bold ml-14" style="font-size: 1.5rem"
                  >nhà trọ SAC</span
                >
              </div>
              <v-card-text class="d-flex flex-column">
                <span
                  class="align-self-center font-weight-bold font-nunito brow-text"
                  style="font-size: 1.125rem"
                  >ĐĂNG NHẬP</span
                >
                <v-form
                  ref="formUsernamePassword"
                  v-model="valid.usernamePassword"
                  :lazy-validation="lazy.usernamePassword"
                  class="pa-4 d-flex flex-column"
                >
                  <v-text-field
                    class="register py-0"
                    v-model="phone"
                    solo
                    label="Nhập số điện thoại"
                    prepend-icon="mdi mdi-phone"
                    color="#727cf5"
                    :rules="[rules.phoneNumber]"
                  ></v-text-field>
                  <v-text-field
                    class="register py-0"
                    v-model="password"
                    solo
                    label="Nhập mật khẩu"
                    prepend-icon="mdi mdi-shield-lock-outline"
                    :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPass ? 'text' : 'password'"
                    @click:append="showPass = !showPass"
                    color="#727cf5"
                    :rules="[rules.required, rules.password.minLength]"
                    hint="Ít nhất 6 kí tự"
                  ></v-text-field>
                  <span class="red--text font-nunito" style="font-size: 0.9rem; font-weight: 400">{{
                    message
                  }}</span>
                  <span
                    class="ml-auto font-nunito text-muted"
                    style="font-size: 0.75rem; font-weight: 400"
                    >Quên mật khẩu</span
                  >
                  <v-btn
                    min-width="100%"
                    :disabled="!valid.usernamePassword"
                    class="bg-primary white--text font-nunito align-self-center text-body-2 py-5 bt-primary-hover d-flex align-center mt-2"
                    :loading="loging"
                    @click="login(false)"
                  >
                    <v-icon small class="mr-2">mdi mdi-account-arrow-right-outline</v-icon>Đăng nhập
                  </v-btn>
                </v-form>
                <span
                  class="font-nunito text-gray align-self-center mt-1"
                  style="font-size: 16px !important"
                  >Đăng nhập bằng</span
                >
              </v-card-text>
              <v-card-actions class="d-flex justify-center mt-n2">
                <v-btn disabled outlined fab color="#39afd1" x-small class="register mx-2">
                  <v-icon small class="icon-phone">mdi mdi-phone</v-icon>
                </v-btn>
                <v-btn disabled outlined fab color="#727cf5" x-small class="register mx-2">
                  <v-icon small class="icon-fb">mdi mdi-facebook</v-icon>
                </v-btn>
                <v-btn disabled outlined fab color="#fa5c7c" x-small class="register mx-2">
                  <v-icon small class="icon-gmail">mdi mdi-google</v-icon>
                </v-btn>
              </v-card-actions>
              <v-card-text class="d-flex justify-center align-center py-0">
                <span class="text-muted">Chưa có tài khoản?</span>
                <v-btn text link color="#727cf5" @click="register()">Đăng ký</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- <div>
          <v-card class="elevation-12" width="300">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Đăng nhập</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Số điện thoại"
                  name="Số điện thoại"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="phone"
                  hide-details="auto"
                  validate-on-blur
                  :rules="[rules.empty, rules.phone]"
                ></v-text-field>

                <v-text-field
                  validate-on-blur
                  id="password"
                  hide-details="auto"
                  v-model="password"
                  label="Mật khẩu"
                  name="Mật khẩu"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[rules.empty]"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn to="/register" dark class="green lighten-3">
                <v-icon>create</v-icon>Tạo tài khoản mới
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :loading="loging" @click="login">Đăng nhập</v-btn>
            </v-card-actions>
            <v-card-text class="red--text">{{ message }}</v-card-text>
          </v-card>
        </div> -->
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import authenticationMixins from '../components/mixins/authentication';

export default {
  name: 'login',
  mixins: [authenticationMixins],
  data: () => ({
    prevRoute: null,
    phone: '',
    password: '',
    showPass: false,
    message: '',
    rules: {
      empty: (value) => value.length > 0 || 'Không được để trống.',
      phone: (value) => Number.isInteger(Number(value)) === true || 'Phải là số điện thoại',
      required: (value) => !!value || 'Xin đừng để trống!',
      password: {
        minLength: (value) => value.length >= 6 || 'Ít nhất 6 kí tự',
      },
      phoneNumber: (value) => {
        const pattern = /^[0]{1}[0-9]{8,10}$/;
        return pattern.test(value) || 'Số điện thoại không hợp lệ';
      },
    },
    valid: {
      usernamePassword: true,
    },
    lazy: {
      usernamePassword: false,
    },
  }),
  computed: {},
  methods: {
    validateFormUsernamePassword() {
      this.$refs.formUsernamePassword.validate();
    },
    register() {
      this.$router.push('/register');
    },
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from; // eslint-disable-line
    });
  },
};
</script>
<style scoped></style>
