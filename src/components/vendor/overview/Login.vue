<template>
  <div>
    <h3>Đăng nhập bằng google account</h3>
    <button @click="login">Đăng nhập bằng google</button>
  </div>
</template>
<script>
import firebase from 'firebase';

export default {
  name: 'login',
  methods: {
    login() {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // eslint-disable-next-line
          var token = new Token();
          token = result.credential.accessToken;
          // The signed-in user info.
          // eslint-disable-next-line
          var user = new User();
          user = result.user;

          // this.$router.push('/vendor');
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          // eslint-disable-next-line
          var errorCode = new ErrorCode();
          errorCode = error.code;

          // eslint-disable-next-line
          var errorMessage = new ErrorMessage();
          errorMessage = error.message;
          // The email of the user's account used.
          // eslint-disable-next-line
          var email = new Email();
          email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          // eslint-disable-next-line
          var credential = new Credential();
          credential = error.credential;
          // ...
        });
    },
  },
};
</script>
