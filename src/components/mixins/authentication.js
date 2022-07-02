import { mapActions } from 'vuex';
import firebase from '../../config/firebase';
import pushNotiMixins from './pushNotification';

const { auth } = firebase;

const authenticationMixins = {
  data: () => ({
    loging: false,
  }),
  mixins: [pushNotiMixins],
  computed: {
    userData() {
      return this.$store.state.user.user.data;
    },
    loginSuccess() {
      return this.$store.state.user.user.success;
    },
  },
  methods: {
    ...mapActions({
      loginRequest: 'user/login',
    }),
    logout() {
      auth
        .signOut()
        .then(() => {
          this.$cookies.remove('role');
          this.$cookies.remove('userId');
          this.$cookies.remove('jwt');
          this.$cookies.remove('firebaseIdToken');
          this.$cookies.remove('messagingToken');
          this.clearUserData();
          this.$router.push('/');
        })
        .catch((error) => console.log(error));
    },
    async getTokenIdFromFirebase(jwtToken) {
      try {
        await auth.setPersistence(firebase.authNamespace.Auth.Persistence.LOCAL);
        await auth.signInWithCustomToken(jwtToken);
        const { currentUser } = auth;
        console.log('firebase user data:', currentUser);
        const idToken = await currentUser.getIdToken(true);
        console.log(idToken);
        const { refreshToken } = currentUser;
        return { idToken, refreshToken };
      } catch (error) {
        console.log('firebase login error: ', error);
      }
      return null;
    },
    async afterLogin(keepCurrentRoute) {
      if (this.loginSuccess) {
        const { jwtToken, idToken, refreshToken } = this.userData;
        this.$cookies.set('jwt', jwtToken);
        // const idToken = await this.getTokenIdFromFirebase(jwtToken);
        this.$cookies.set('firebaseIdToken', idToken);
        this.$cookies.set('firebaseRefreshToken', refreshToken);
        let role = 'admin';
        const id = this.userData.userId;
        switch (this.userData.role) {
          case 'VENDOR':
            role = 'vendors';
            break;
          case 'RENTER':
            role = 'renters';
            break;
          default:
            break;
        }
        this.$cookies.set('role', role);
        this.$cookies.set('userId', id);
        if (!keepCurrentRoute) {
          console.log(this.$route.params);
          const { nextUrl, preUrl } = this.$route.params;
          if (nextUrl) {
            this.$router.push(nextUrl);
          } else {
            switch (role) {
              case 'vendors':
                this.$router.push('/vendor');
                break;
              case 'renters':
                this.$router.push(preUrl || '/');
                break;
              case 'admin':
                this.$router.push('/admin');
                break;
              default:
                this.$router.push('/');
            }
          }
        }
        this.doGetMessagingToken();
      } else {
        this.message = 'Số điện thoại hoặc mật khẩu không đúng!';
      }
    },
    async login(keepCurrentRoute) {
      this.loging = true;
      await this.loginRequest({
        phone: this.phone,
        password: this.password,
        getTokenIdFromFirebase: this.getTokenIdFromFirebase,
      });
      await this.afterLogin(keepCurrentRoute);
      this.loging = false;
    },
  },
};

export default authenticationMixins;
