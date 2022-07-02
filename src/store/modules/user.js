const myState = () => ({
  user: {
    data: null,
    isLoading: false,
    isUpdating: false,
    success: null,
    error: null,
  },
  contracts: {
    data: [],
    page: [1],
    size: 50,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    newlyCreated: null,
    success: null,
    error: null,
  },
  bookings: {
    data: [],
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    success: null,
    error: null,
    newlyCreated: null,
  },
  deals: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
    newlyCreated: null,
  },
  notifications: {
    data: [],
    isCreating: false,
    success: null,
    error: null,
    new: null,
  },
  feedback: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
    feedbackUpdate: null,
  },
  requests: {
    data: [],
    isLoading: false,
    isCreating: false,
    error: null,
    success: null,
  },
});

const myGetters = {
  // get lasted deal
  findLastedDeal: (state) => (renterId, vendorId, typeId) => {
    let result = state.deals.data.filter((deal) => {
      console.log(state.deals.data);
      if (
        deal.renter.userId === renterId &&
        deal.vendor.userId === vendorId &&
        deal.type.typeId === typeId &&
        deal.status === 'CREATED'
      ) {
        return true;
      }
      return false;
    });
    result = result.sort((deal1, deal2) => deal1.creationTime - deal2.creationTime);
    console.log(`lasted deal: ${result[0]}`);
    return result[0];
  },
  findPendingBooking: (state) => (renterId, vendorId, typeId) => {
    const result = state.bookings.data.filter((booking) => {
      if (
        booking.renter.renterId === renterId &&
        booking.vendor.vendorId === vendorId &&
        booking.type.typeId === typeId &&
        booking.status === 'INCOMING'
      ) {
        return true;
      }
      return false;
    });
    console.log(`pending booking ${result[0]}`);
    return result[0];
  },
  findDealById: (state) => (id) => {
    const result = state.deals.data.filter((deal) => deal.dealId === id);
    return result[0];
  },
  findBookingById: (state) => (id) => {
    const result = state.bookings.data.find((booking) => booking.bookingId === Number(id));
    return result;
  },
  findContractById: (state) => (id) => {
    console.log('find contract id', id);
    const contract = state.contracts.data.find((c) => c.contractId === Number(id));
    return contract;
  },
};
const mutationTypes = {
  CREATE_ROOM_REQUEST_REQUEST: 'CREATE_ROOM_REQUEST_REQUEST',
  CREATE_ROOM_REQUEST_SUCCESS: 'CREATE_ROOM_REQUEST_SUCCESS',
  CREATE_ROOM_REQUEST_FAILURE: 'CREATE_ROOM_REQUEST_FAILURE',

  GET_USER_REQUEST: 'GET_USER_REQUEST',
  GET_USER_SUCCESS: 'GET_USER_SUCCESS',
  GET_USER_FAILURE: 'GET_USER_FAILURE',

  UPDATE_USER_REQUEST: 'UPDATE_USER_REQUEST',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILURE: 'UPDATE_USER_FAILURE',

  CLEAR_USER_DATA: 'CLEAR_USER_DATA',

  GET_CONTRACTS_REQUEST: 'GET_CONTRACTS_REQUEST',
  GET_CONTRACTS_SUCCESS: 'GET_CONTRACTS_SUCCESS',
  GET_CONTRACTS_FAILURE: 'GET_CONTRACTS_FAILURE',

  GET_BOOKINGS_REQUEST: 'GET_BOOKINGS_REQUEST',
  GET_BOOKINGS_SUCCESS: 'GET_BOOKINGS_SUCCESS',
  GET_BOOKINGS_FAILURE: 'GET_BOOKINGS_FAILURE',

  GET_BOOKING_REQUEST: 'GET_BOOKING_REQUEST',
  GET_BOOKING_SUCCESS: 'GET_BOOKING_SUCCESS',
  GET_BOOKING_FAILURE: 'GET_BOOKING_FAILURE',

  CREATE_BOOKING_REQUEST: 'CREATE_BOOKING_REQUEST',
  CREATE_BOOKING_SUCCESS: 'CREATE_BOOKING_SUCCESS',
  CREATE_BOOKING_FAILURE: 'CREATE_BOOKING_FAILURE',

  GET_DEALS_REQUEST: 'GET_DEALS_REQUEST',
  GET_DEALS_SUCCESS: 'GET_DEALS_SUCCESS',
  GET_DEALS_FAILURE: 'GET_DEALS_FAILURE',

  CREATE_DEAL_REQUEST: 'CREATE_DEAL_REQUEST',
  CREATE_DEAL_SUCCESS: 'CREATE_DEAL_SUCCESS',
  CREATE_DEAL_FAILURE: 'CREATE_DEAL_FAILURE',

  GET_DEAL_REQUEST: 'GET_DEAL_REQUEST',
  GET_DEAL_SUCCESS: 'GET_DEAL_SUCCESS',
  GET_DEAL_FAILURE: 'GET_DEAL_FAILURE',

  CANCEL_DEAL_REQUEST: 'CANCEL_DEAL_REQUEST',
  CANCEL_DEAL_SUCCESS: 'CANCEL_DEAL_SUCCESS',
  CANCEL_DEAL_FAILURE: 'CANCEL_DEAL_FAILURE',

  CANCEL_BOOKING_REQUEST: 'CANCEL_BOOKING_REQUEST',
  CANCEL_BOOKING_SUCCESS: 'CANCEL_BOOKING_SUCCESS',
  CANCEL_BOOKING_FAILURE: 'CANCEL_BOOKING_FAILURE',

  DONE_BOOKING_REQUEST: 'DONE_BOOKING_REQUEST',
  DONE_BOOKING_SUCCESS: 'DONE_BOOKING_SUCCESS',
  DONE_BOOKING_FAILURE: 'DONE_BOOKING_FAILURE',

  CLEAR_NEWLY_CREATED_BOOKING: 'CLEAR_NEWLY_CREATED_BOOKING',

  REGISTER_USER_REQUEST: 'REGISTER_USER_REQUEST',
  REGISTER_USER_SUCCESS: 'REGISTER_USER_SUCCESS',
  REGISTER_USER_FAILURE: 'REGISTER_USER_FAILURE',

  CREATE_CONTRACT_REQUEST: 'CREATE_CONTRACT_REQUEST',
  CREATE_CONTRACT_SUCCESS: 'CREATE_CONTRACT_SUCCESS',
  CREATE_CONTRACT_FAILURE: 'CREATE_CONTRACT_FAILURE',

  UPDATE_CONTRACT_REQUEST: 'UPDATE_CONTRACT_REQUEST',
  UPDATE_CONTRACT_SUCCESS: 'UPDATE_CONTRACT_SUCCESS',
  UPDATE_CONTRACT_FAILURE: 'UPDATE_CONTRACT_FAILURE',

  ACTIVATE_CONTRACT_REQUEST: 'ACTIVATE_CONTRACT_REQUEST',
  ACTIVATE_CONTRACT_SUCCESS: 'ACTIVATE_CONTRACT_SUCCESS',
  ACTIVATE_CONTRACT_FAILURE: 'ACTIVATE_CONTRACT_FAILURE',

  GET_ONE_CONTRACT_REQUEST: 'GET_ONE_CONTRACT_REQUEST',
  GET_ONE_CONTRACT_SUCCESS: 'GET_ONE_CONTRACT_SUCCESS',
  GET_ONE_CONTRACT_FAILURE: 'GET_ONE_CONTRACT_FAILURE',

  SEND_NOTIFICATION_REQUEST: 'SEND_NOTIFICATION_REQUEST',
  SEND_NOTIFICATION_SUCCESS: 'SEND_NOTIFICATION_SUCCESS',
  SEND_NOTIFICATION_FAILURE: 'SEND_NOTIFICATION_FAILURE',

  ADD_NOTIFICATION_LOCAL_REQUEST: 'ADD_NOTIFICATION_LOCAL_REQUEST',
  ADD_NOTIFICATION_LOCAL_SUCCESS: 'ADD_NOTIFICATION_LOCAL_SUCCESS',
  ADD_NOTIFICATION_LOCAL_FAILURE: 'ADD_NOTIFICATION_LOCAL_FAILURE',

  CREATE_FEEDBACK_REQUEST: 'CREATE_FEEDBACK_REQUEST',
  CREATE_FEEDBACK_SUCCESS: 'CREATE_FEEDBACK_SUCCESS',
  CREATE_FEEDBACK_FAILURE: 'CREATE_FEEDBACK_FAILURE',

  DELETE_FEEDBACK_REQUEST: 'DELETE_FEEDBACK_REQUEST',
  DELETE_FEEDBACK_SUCCESS: 'DELETE_FEEDBACK_SUCCESS',
  DELETE_FEEDBACK_FAILURE: 'DELETE_FEEDBACK_FAILURE',

  UPDATE_FEEDBACK_REQUEST: 'UPDATE_FEEDBACK_REQUEST',
  UPDATE_FEEDBACK_SUCCESS: 'UPDATE_FEEDBACK_SUCCESS',
  UPDATE_FEEDBACK_FAILURE: 'UPDATE_FEEDBACK_FAILURE',

  GET_ROOM_REQUESTS_REQUEST: 'GET_ROOM_REQUESTS_REQUEST',
  GET_ROOM_REQUESTS_SUCCESS: 'GET_ROOM_REQUESTS_SUCCESS',
  GET_ROOM_REQUESTS_FAILURE: 'GET_ROOM_REQUESTS_FAILURE',
};
const mutations = {
  CREATE_ROOM_REQUEST_REQUEST(state) {
    state.requests.isCreating = true;
  },
  CREATE_ROOM_REQUEST_SUCCESS(state, request) {
    state.requests.isCreating = false;
    state.requests.data.unshift(request);
    state.requests.success = true;
  },
  CREATE_ROOM_REQUEST_FAILURE(state, error) {
    state.requests.isCreating = false;
    state.requests.error = error;
    state.requests.success = true;
  },
  CLEAR_USER_DATA(state) {
    state.user.data = null;
    state.user.isLoading = false;
    state.user.success = false;
    state.notifications.data = [];
  },
  GET_USER_REQUEST(state) {
    state.user.isLoading = true;
    state.user.success = null;
    state.user.error = null;
  },
  GET_USER_SUCCESS(state, user) {
    state.user.data = user;
    console.log(user);
    state.user.isLoading = false;
    state.user.success = true;
  },
  GET_USER_FAILURE(state, error) {
    state.user.isLoading = false;
    state.user.success = false;
    state.user.error = error;
  },
  GET_CONTRACTS_REQUEST(state) {
    state.contracts.isLoading = true;
    state.contracts.error = null;
    state.contracts.success = null;
  },
  GET_CONTRACTS_SUCCESS(state, contracts) {
    state.contracts.data = contracts;
    state.contracts.isLoading = false;
    state.contracts.success = true;
  },
  GET_CONTRACTS_FAILURE(state, error) {
    state.contracts.isLoading = false;
    state.contracts.success = false;
    state.contracts.error = error;
  },
  GET_ONE_CONTRACT_REQUEST(state) {
    state.contracts.isLoading = true;
    state.contracts.error = null;
    state.contracts.success = null;
  },
  GET_ONE_CONTRACT_SUCCESS(state, contract) {
    const oldContractIndex = state.contracts.data.findIndex(
      (c) => Number(c.contractId) === Number(contract.contractId),
    );
    if (oldContractIndex > -1) {
      state.contracts.data.splice(oldContractIndex, 1, contract);
    } else {
      state.contracts.data.unshift(contract);
    }
    state.contracts.isLoading = false;
    state.contracts.success = true;
  },
  GET_ONE_CONTRACT_FAILURE(state, error) {
    state.contracts.isLoading = false;
    state.contracts.success = false;
    state.contracts.error = error;
  },
  GET_BOOKINGS_REQUEST(state) {
    state.bookings.isLoading = true;
    state.bookings.success = null;
    state.bookings.error = null;
  },
  GET_BOOKINGS_SUCCESS(state, booking) {
    state.bookings.data = booking;
    state.bookings.isLoading = false;
    state.bookings.success = true;
  },
  GET_BOOKINGS_FAILURE(state, error) {
    state.bookings.isLoading = false;
    state.bookings.success = false;
    state.bookings.error = error;
  },
  GET_BOOKING_REQUEST(state) {
    state.bookings.isLoading = true;
    state.bookings.success = null;
    state.bookings.error = null;
  },
  GET_BOOKING_SUCCESS(state, booking) {
    state.bookings.data.unshift(booking);
    state.bookings.isLoading = false;
    state.bookings.success = true;
  },
  GET_BOOKING_FAILURE(state, error) {
    state.bookings.isLoading = false;
    state.bookings.success = false;
    state.bookings.error = error;
  },
  CREATE_BOOKING_REQUEST(state) {
    state.bookings.isLoading = true;
    state.bookings.success = null;
    state.bookings.error = null;
  },
  CREATE_BOOKING_SUCCESS(state, booking) {
    state.bookings.data.push(booking);
    state.bookings.newlyCreated = booking;
    state.bookings.isLoading = false;
    state.bookings.success = true;
  },
  CREATE_BOOKING_FAILURE(state, error) {
    state.bookings.isLoading = false;
    state.bookings.success = false;
    state.bookings.error = error;
  },
  REGISTER_USER_REQUEST(state) {
    state.user.isLoading = true;
  },
  REGISTER_USER_SUCCESS(state, renter) {
    state.user.data = renter;
    state.user.isLoading = false;
    state.user.success = true;
  },
  REGISTER_USER_FAILURE(state, error) {
    state.user.isLoading = false;
    state.user.success = false;
    state.user.error = error;
  },
  GET_DEALS_REQUEST(state) {
    state.deals.isLoading = false;
    state.deals.success = null;
    state.deals.error = null;
  },
  GET_DEALS_SUCCESS(state, deals) {
    state.deals.data = deals;
    state.deals.isLoading = false;
    state.deals.success = true;
  },
  GET_DEALS_FAILURE(state, error) {
    state.deals.isLoading = false;
    state.deals.success = false;
    state.deals.error = error;
  },
  CREATE_DEAL_REQUEST(state) {
    state.deals.isLoading = false;
  },
  CREATE_DEAL_SUCCESS(state, deal) {
    state.deals.data.push(deal);
    state.deals.newlyCreated = deal;
    state.deals.success = true;
    state.deals.isLoading = false;
  },
  CREATE_DEAL_FAILURE(state, error) {
    state.deals.success = false;
    state.deals.error = error;
  },
  GET_DEAL_REQUEST(state) {
    state.deals.isLoading = false;
  },
  GET_DEAL_SUCCESS(state, deal) {
    state.deals.data.push(deal);
    state.deals.newlyCreated = deal;
    state.deals.success = true;
    state.deals.isLoading = false;
  },
  GET_DEAL_FAILURE(state, error) {
    state.deals.success = false;
    state.deals.error = error;
  },
  CANCEL_DEAL_REQUEST(state) {
    state.deals.isLoading = true;
    state.bookings.success = null;
    state.bookings.error = null;
  },
  CANCEL_DEAL_SUCCESS(state, dealId) {
    state.deals.isLoading = false;
    state.deals.success = true;
    const res = state.deals.data.filter((deal) => deal.dealId === dealId);
    res[0].status = 'CANCEL';
  },
  CANCEL_DEAL_FAILURE(state, error) {
    state.deals.isLoading = false;
    state.deals.error = error;
  },
  CANCEL_BOOKING_REQUEST(state) {
    state.bookings.isLoading = true;
  },
  CANCEL_BOOKING_SUCCESS(state, newBooking) {
    const { bookingId } = newBooking;
    state.bookings.isLoading = false;
    state.bookings.success = true;
    const res = state.bookings.data.filter((book) => book.bookingId === bookingId);
    res[0].status = 'CANCELLED';
  },
  CANCEL_BOOKING_FAILURE(state, error) {
    state.bookings.isLoading = false;
    state.bookings.error = error;
  },
  DONE_BOOKING_REQUEST(state) {
    state.bookings.isUpdating = true;
    state.bookings.success = null;
    state.bookings.error = null;
  },
  DONE_BOOKING_SUCCESS(state, bookingId) {
    state.bookings.isUpdating = false;
    state.bookings.success = true;
    const res = state.bookings.data.find((book) => book.bookingId === bookingId);
    res.status = 'DONE';
  },
  DONE_BOOKING_FAILURE(state, error) {
    state.bookings.isUpdating = false;
    state.bookings.error = error;
  },
  UPDATE_USER_REQUEST(state) {
    state.user.isLoading = true;
    state.user.isUpdating = true;
    state.user.error = null;
    state.user.success = null;
  },
  UPDATE_USER_SUCCESS(state, user) {
    state.user.data = user;
    state.user.success = true;
    state.user.isLoading = false;
    state.user.isUpdating = false;
  },
  UPDATE_USER_FAILURE(state, error) {
    state.user.error = error;
    state.user.success = false;
    state.user.isLoading = false;
    state.user.isUpdating = false;
  },
  CLEAR_NEWLY_CREATED_BOOKING(state) {
    state.bookings.newlyCreated = null;
  },
  CREATE_CONTRACT_REQUEST(state) {
    state.contracts.isCreating = true;
    state.contracts.error = null;
    state.contracts.success = null;
    state.contracts.newlyCreated = null;
  },
  CREATE_CONTRACT_SUCCESS(state, contract) {
    state.contracts.isCreating = false;
    state.contracts.data.push(contract);
    state.contracts.newlyCreated = contract;
    state.contracts.success = true;
  },
  CREATE_CONTRACT_FAILURE(state, error) {
    state.contracts.isCreating = false;
    state.contracts.error = error;
    state.contracts.success = false;
  },
  UPDATE_CONTRACT_REQUEST(state) {
    state.contracts.isUpdating = true;
    state.contracts.error = null;
    state.contracts.success = null;
  },
  UPDATE_CONTRACT_SUCCESS(state, contract) {
    const { contractId } = contract;
    state.contracts.isUpdating = false;
    const index = state.contracts.data.findIndex((c) => c.contractId === Number(contractId));
    state.contracts.data[index] = contract;
    state.contracts.success = true;
  },
  UPDATE_CONTRACT_FAILURE(state, error) {
    state.contracts.isUpdating = false;
    state.contracts.error = error;
    state.contracts.success = false;
  },
  ACTIVATE_CONTRACT_REQUEST(state) {
    state.contracts.isUpdating = true;
    state.contracts.error = null;
    state.contracts.success = null;
  },
  ACTIVATE_CONTRACT_SUCCESS(state, contract) {
    const { contractId } = contract;
    state.contracts.isUpdating = false;
    console.log(contractId);
    const index = state.contracts.data.findIndex((c) => c.contractId === Number(contractId));
    state.contracts.data[index] = contract;
    state.contracts.success = true;
  },
  ACTIVATE_CONTRACT_FAILURE(state, error) {
    state.contracts.isUpdating = false;
    state.contracts.error = error;
    state.contracts.success = false;
  },
  SEND_NOTIFICATION_REQUEST(state) {
    state.notifications.isCreating = true;
    state.notifications.error = null;
    state.notifications.success = null;
  },
  SEND_NOTIFICATION_SUCCESS(state) {
    state.notifications.success = true;
  },
  SEND_NOTIFICATION_FAILURE(state, error) {
    state.notifications.error = error;
    state.notifications.success = false;
  },

  ADD_NOTIFICATION_LOCAL_REQUEST(state, noti) {
    state.notifications.new = noti;
  },
  ADD_NOTIFICATION_LOCAL_SUCCESS(state, noti) {
    state.notifications.data.unshift(noti);
  },
  ADD_NOTIFICATION_LOCAL_FAILURE(state, error) {
    state.notifications.error = error;
  },

  CREATE_FEEDBACK_REQUEST(state) {
    state.feedback.isLoading = true;
  },
  CREATE_FEEDBACK_SUCCESS(state, feedback) {
    // state.feedback.data.push(feedback);
    state.feedback.newlyCreated = feedback;
    state.feedback.success = true;
    state.feedback.isLoading = false;
  },
  CREATE_FEEDBACK_FAILURE(state, error) {
    state.feedback.isLoading = true;
    state.feedback.success = false;
    state.feedback.error = error;
  },

  DELETE_FEEDBACK_REQUEST(state) {
    state.feedback.isLoading = true;
  },
  DELETE_FEEDBACK_SUCCESS(state) {
    state.feedback.success = true;
    state.feedback.isLoading = false;
    state.feedback.error = null;
  },
  DELETE_FEEDBACK_FAILURE(state, error) {
    state.feedback.isLoading = true;
    state.feedback.success = false;
    state.feedback.error = error;
  },

  UPDATE_FEEDBACK_REQUEST(state) {
    state.feedback.isLoading = true;
    state.feedback.error = null;
    state.feedback.success = null;
  },
  UPDATE_FEEDBACK_SUCCESS(state, feedback) {
    state.feedback.feedbackUpdate = feedback;
    state.feedback.success = true;
    state.feedback.isLoading = false;
  },
  UPDATE_FEEDBACK_FAILURE(state, error) {
    state.feedback.error = error;
    state.feedback.success = false;
    state.feedback.isLoading = false;
  },

  GET_ROOM_REQUESTS_REQUEST(state) {
    state.requests.isLoading = true;
    state.requests.error = null;
    state.requests.success = null;
  },
  GET_ROOM_REQUESTS_SUCCESS(state, requests) {
    state.requests.isLoading = false;
    state.requests.data = requests;
    state.requests.success = true;
  },
  GET_ROOM_REQUESTS_FAILURE(state, error) {
    state.requests.isLoading = false;
    state.requests.error = error;
    state.requests.success = false;
  },
};

const actions = {
  async getRoomRequests({ commit }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role) {
      try {
        commit(mutationTypes.GET_ROOM_REQUESTS_REQUEST);
        const res = await window.axios.get(`/api/v1/renters/${userId}/requests`);
        if (res.status === 200) {
          commit(mutationTypes.GET_ROOM_REQUESTS_SUCCESS, res.data.data);
        } else {
          commit(
            mutationTypes.GET_ROOM_REQUESTS_FAILURE,
            new Error('response with status code != 200'),
          );
        }
      } catch (error) {
        commit(mutationTypes.GET_ROOM_REQUESTS_FAILURE, error);
      }
    } else {
      console.log('User are not logged in, cannot get user data');
    }
  },
  async createRoomRequest({ commit }, request) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role) {
      try {
        commit(mutationTypes.CREATE_ROOM_REQUEST_REQUEST);
        const res = await window.axios.post(`/api/v1/renters/${userId}/requests`, request);
        if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.CREATE_ROOM_REQUEST_SUCCESS, res.data.data);
        } else {
          commit(
            mutationTypes.CREATE_ROOM_REQUEST_FAILURE,
            new Error('response with status code != 200'),
          );
        }
      } catch (error) {
        commit(mutationTypes.CREATE_ROOM_REQUEST_FAILURE, error);
      }
    } else {
      console.log('User are not logged in, cannot get user data');
    }
  },
  async login({ commit }, params) {
    // params {phone, password}
    commit(mutationTypes.GET_USER_REQUEST);
    let res = null;
    try {
      const { phone, password, getTokenIdFromFirebase } = params;
      res = await window.axios.post('/api/v1/login', { phone, password });
      if (res.status === 200) {
        const userData = res.data.data;
        const { jwtToken } = userData;
        const { idToken, refreshToken } = await getTokenIdFromFirebase(jwtToken);
        userData.idToken = idToken;
        userData.refreshToken = refreshToken;
        commit(mutationTypes.GET_USER_SUCCESS, userData);
      } else {
        commit(mutationTypes.GET_USER_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_USER_FAILURE, error);
    }
  },
  async clearUserData({ commit }) {
    commit(mutationTypes.CLEAR_USER_DATA);
  },
  async getUser({ commit }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role) {
      try {
        commit(mutationTypes.GET_USER_REQUEST);
        const res = await window.axios.get(`/api/v1/${role}/${userId}`);
        if (res.status === 200) {
          commit(mutationTypes.GET_USER_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.GET_USER_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.GET_USER_FAILURE, error);
      }
    } else {
      console.log('User are not logged in, cannot get user data');
    }
  },
  async updateUser({ commit, state }, newUser) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.UPDATE_USER_REQUEST);
        const res = await window.axios.put(`/api/v1/${role}/${userId}`, newUser);
        if (res.status === 200) {
          commit(mutationTypes.UPDATE_USER_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.UPDATE_USER_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.UPDATE_USER_FAILURE, error);
      }
    } else {
      throw new Error('userId, role or user.data null');
    }
  },
  async updateUserFirebaseToken({ commit, state }, firebaseToken) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.UPDATE_USER_REQUEST);
        const res = await window.axios.put(`/api/v1/${role}/${userId}/token`, { firebaseToken });
        if (res.status === 200) {
          commit(mutationTypes.UPDATE_USER_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.UPDATE_USER_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.UPDATE_USER_FAILURE, error);
      }
    } else {
      throw new Error('userId, role or user.data null');
    }
  },
  async getBookings({ commit, state }) {
    console.log(window.$cookies);
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.GET_BOOKINGS_REQUEST);
        const res = await window.axios.get(`/api/v1/${role}/${userId}/bookings`);
        if (res.status === 200) {
          commit(mutationTypes.GET_BOOKINGS_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.GET_BOOKINGS_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.GET_BOOKINGS_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get bookings');
    }
  },
  async getContracts({ commit, state }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.GET_CONTRACTS_REQUEST);
        const res = await window.axios.get(`/api/v1/${role}/${userId}/contracts?sortBy=updatedAt&asc=false`);
        if (res.status === 200) {
          commit(mutationTypes.GET_CONTRACTS_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.GET_CONTRACTS_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.GET_CONTRACTS_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get contracts');
    }
  },
  async getOneBooking({ commit, state }, bookingId) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        const currentIds = state.bookings.data.map((booking) => booking.bookingId);
        if (!currentIds.includes(bookingId)) {
          commit(mutationTypes.GET_BOOKING_REQUEST);
          const res = await window.axios.get(`/api/v1/bookings/${bookingId}`);
          if (res.status === 200) {
            res.data.data.new = true;
            commit(mutationTypes.GET_BOOKING_SUCCESS, res.data.data);
          } else {
            commit(mutationTypes.GET_BOOKING_FAILURE);
          }
        } else {
          console.log('this booking is already in store');
        }
      } catch (error) {
        commit(mutationTypes.GET_BOOKING_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get a new booking');
    }
  },
  insertOneBooking({ commit, state }, booking) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.GET_BOOKING_REQUEST);
        const editBooking = { ...booking, new: true };
        commit(mutationTypes.GET_BOOKING_SUCCESS, editBooking);
      } catch (error) {
        commit(mutationTypes.GET_BOOKING_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get a new booking');
    }
  },
  async createBooking({ commit, state }, booking) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.CREATE_BOOKING_REQUEST);
        const res = await window.axios.post('/api/v1/bookings', booking);
        if (res.status === 201) {
          commit(mutationTypes.CREATE_BOOKING_SUCCESS, res.data.data);
        }
      } catch (error) {
        commit(mutationTypes.CREATE_BOOKING_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get a new booking');
    }
  },
  async getDeals({ commit, state }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.GET_DEALS_REQUEST);
        const res = await window.axios.get(`/api/v1/${role}/${userId}/deals`);
        if (res.status === 200) {
          commit(mutationTypes.GET_DEALS_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.GET_DEALS_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.GET_DEALS_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get deals');
    }
  },
  async createDeal({ commit, state }, deal) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.CREATE_DEAL_REQUEST);
        const res = await window.axios.post('/api/v1/deals', deal);
        if (res.status === 201) {
          commit(mutationTypes.CREATE_DEAL_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.CREATE_DEAL_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.CREATE_DEAL_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get deals');
    }
  },
  async getDeal({ commit, state }, dealIds) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    const currentIds = state.deals.data.map((deal) => deal.dealId);
    const newIds = dealIds.filter((newId) => !currentIds.includes(newId));
    if (newIds.lenght > 0) {
      if (userId && role && state.user.data) {
        try {
          commit(mutationTypes.GET_DEAL_REQUEST);
          const res = await window.axios.get(`/api/v1/deals/${newIds[0]}`);
          if (res.status === 200) {
            commit(mutationTypes.GET_DEAL_SUCCESS, res.data.data);
          } else {
            commit(mutationTypes.GET_DEAL_FAILURE);
          }
        } catch (error) {
          commit(mutationTypes.GET_DEAL_FAILURE, error);
        }
      } else {
        throw new Error('You have to login before get deals');
      }
    } else {
      console.log('not a new deal');
    }
  },
  async cancelDeal({ commit, state }, dealId) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        const deal = state.deals.data.filter((item) => item.dealId === dealId)[0];
        if (deal) {
          commit(mutationTypes.CANCEL_DEAL_REQUEST);
          const res = await window.axios.put('/api/v1/deals', {
            dealId,
            renterId: deal.renter.renterId,
            vendorId: deal.vendor.vendorId,
            typeId: deal.type.typeId,
            status: 'CANCELED',
            offeredPrice: deal.offeredPrice,
          });
          if (res.status === 200) {
            commit(mutationTypes.CANCEL_DEAL_SUCCESS, res.data.data);
          }
        } else {
          console.log('deal is null');
        }
      } catch (error) {
        commit(mutationTypes.CANCEL_DEAL_FAILURE, error);
      }
    } else {
      throw new Error('you are not loged in');
    }
  },
  async cancelBooking({ commit, state }, bookingId) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        const booking = state.bookings.data.filter((item) => item.bookingId === bookingId)[0];
        if (booking) {
          commit(mutationTypes.CANCEL_BOOKING_REQUEST);
          const res = await window.axios.put(`/api/v1/bookings/${bookingId}`, {
            bookingId,
            dealId: booking.deal ? booking.deal.dealId : null,
            typeId: booking.type.typeId,
            renterId: booking.renter.renterId,
            vendorId: booking.vendor.vendorId,
            status: 'CANCELLED',
            meetTime: booking.meetTime,
            qrCode: booking.qrCode,
          });
          if (res.status === 200) {
            commit(mutationTypes.CANCEL_BOOKING_SUCCESS, res.data.data);
          }
        } else {
          console.log(`booking ${bookingId} is not existed in store`);
        }
      } catch (error) {
        commit(mutationTypes.CREATE_BOOKING_FAILURE, error);
      }
    } else {
      throw new Error('you are not loged in');
    }
  },
  async updateBookingStatus({ commit, state }, content) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    commit(mutationTypes.DONE_BOOKING_REQUEST);
    if (userId && role && state.user.data) {
      try {
        const { bookingId, qrCode } = content;
        console.log(bookingId, qrCode);
        const booking = state.bookings.data.find((item) => item.bookingId === Number(bookingId));
        if (booking) {
          const res = await window.axios.put(`/api/v1/bookings/${bookingId}`, {
            bookingId: Number(bookingId),
            dealId: booking.deal ? booking.deal.dealId : null,
            typeId: booking.type.typeId,
            renterId: booking.renter.renterId,
            vendorId: booking.vendor.vendorId,
            status: 'DONE',
            meetTime: booking.meetTime,
            qrCode,
          });
          console.log(res);
          if (res.status === 200) {
            commit(mutationTypes.DONE_BOOKING_SUCCESS, Number(bookingId));
          }
        } else {
          const error = new Error(`booking ${bookingId} is not existed in store`);
          console.log(error);
          commit(mutationTypes.DONE_BOOKING_FAILURE, error);
        }
      } catch (error) {
        commit(mutationTypes.DONE_BOOKING_FAILURE, error);
      }
    } else {
      const error = new Error('you are not loged in');
      commit(mutationTypes.DONE_BOOKING_FAILURE, error);
    }
  },
  updateBookingStatusLocal({ commit, state }, bookingId) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    commit(mutationTypes.DONE_BOOKING_REQUEST);
    if (userId && role && state.user.data) {
      try {
        const booking = state.bookings.data.filter((item) => item.bookingId === bookingId)[0];
        if (booking) {
          booking.status = 'DONE';
          commit(mutationTypes.DONE_BOOKING_SUCCESS, bookingId);
        } else {
          const error = new Error(`booking ${bookingId} is not existed in store`);
          console.log(error);
          commit(mutationTypes.DONE_BOOKING_FAILURE, error);
        }
      } catch (error) {
        commit(mutationTypes.DONE_BOOKING_FAILURE, error);
      }
    } else {
      const error = new Error('you are not loged in');
      commit(mutationTypes.DONE_BOOKING_FAILURE, error);
    }
  },
  clearNewlyCreatedBooking({ commit }) {
    commit(mutationTypes.CLEAR_NEWLY_CREATED_BOOKING);
  },
  async registerRenter({ commit }, renter) {
    try {
      commit(mutationTypes.REGISTER_USER_REQUEST);
      const response = await window.axios.post('/api/v1/renters/register', renter);
      if (response.status >= 200 && response.status <= 299) {
        console.log(response.data.data);
        commit(mutationTypes.REGISTER_USER_SUCCESS, response.data.data);
      }
      if (response.status === 409) {
        commit(mutationTypes.REGISTER_USER_FAILURE, 'Số điện thoại này đã được đăng kí');
      }
    } catch (error) {
      commit(mutationTypes.REGISTER_USER_FAILURE, error);
    }
  },
  async registerVendor({ commit }, vendor) {
    try {
      commit(mutationTypes.REGISTER_USER_REQUEST);
      const response = await window.axios.post('/api/v1/vendors/register', vendor);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.REGISTER_USER_SUCCESS, response.data.data);
      }
      if (response.status === 409) {
        commit(mutationTypes.REGISTER_USER_FAILURE, 'Số điện thoại này đã được đăng kí');
      }
    } catch (error) {
      commit(mutationTypes.REGISTER_USER_FAILURE, error);
    }
  },
  async createContract({ commit, state }, contract) {
    try {
      commit(mutationTypes.CREATE_CONTRACT_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!userId && !state.user.data) {
        const error = new Error('Loggin to create contract');
        commit(mutationTypes.CREATE_CONTRACT_FAILURE, error);
      } else if (role !== 'vendors') {
        const error = new Error('Only vendor have permission to create contract');
        commit(mutationTypes.CREATE_CONTRACT_FAILURE, error);
      } else {
        const res = await window.axios.post('/api/v1/contracts', contract);
        if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.CREATE_CONTRACT_SUCCESS, res.data.data);
        } else {
          const error = new Error('Cannot receive response from server');
          commit(mutationTypes.CREATE_CONTRACT_FAILURE, error);
        }
      }
    } catch (error) {
      commit(mutationTypes.CREATE_CONTRACT_FAILURE, error);
    }
  },
  async updateContract({ commit, state }, contract) {
    try {
      commit(mutationTypes.UPDATE_CONTRACT_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!role && !userId && !state.user.data) {
        const error = new Error('Loggin to update contract');
        commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
      } else {
        console.log(JSON.stringify(contract));

        const { contractId } = contract;
        const res = await window.axios.put(`/api/v1/contracts/${contractId}`, contract);
        if (!res) {
          const error = new Error('Cannot receive response from server');
          commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
        } else if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.UPDATE_CONTRACT_SUCCESS, contractId);
        }
      }
    } catch (error) {
      commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
    }
  },
  async activateContract({ commit, state }, payload) {
    try {
      console.log('activate contract');
      commit(mutationTypes.ACTIVATE_CONTRACT_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!role && !userId && !state.user.data) {
        const error = new Error('Loggin to activate contract');
        commit(mutationTypes.ACTIVATE_CONTRACT_FAILURE, error);
      } else {
        const { contractId, qrCode, status } = payload;
        const res = await window.axios.put(`/api/v1/contracts/confirm/${contractId}`, { qrCode, status });
        if (!res) {
          const error = new Error('Cannot receive response from server');
          commit(mutationTypes.ACTIVATE_CONTRACT_FAILURE, error);
        } else if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.ACTIVATE_CONTRACT_SUCCESS, res.data.data);
        }
      }
    } catch (error) {
      commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
    }
  },
  async updateContractLocal({ commit, state }, contractId) {
    try {
      commit(mutationTypes.UPDATE_CONTRACT_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!userId && !state.user.data) {
        const error = new Error('Loggin to activate contract');
        commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
      } else if (role !== 'vendors') {
        const error = new Error('Only vendor have permission to update contract locally');
        commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
      } else {
        commit(mutationTypes.UPDATE_CONTRACT_SUCCESS, contractId);
      }
    } catch (error) {
      commit(mutationTypes.UPDATE_CONTRACT_FAILURE, error);
    }
  },
  async getOneContract({ commit, state }, contractId) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role && state.user.data) {
      try {
        commit(mutationTypes.GET_ONE_CONTRACT_REQUEST);
        const res = await window.axios.get(`/api/v1/contracts/${contractId}`);
        if (res.status === 200) {
          commit(mutationTypes.GET_ONE_CONTRACT_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.GET_ONE_CONTRACT_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.GET_ONE_CONTRACT_FAILURE, error);
      }
    } else {
      throw new Error('You have to login before get contracts');
    }
  },
  async sendNotification({ commit }, payload) {
    // payload = {title, body, action, id, receiver}
    // receiver of format: renters|vendors-id
    // vendors-1
    // eslint-disable-next-line
    const { title, body, action, id, vendorId, renterId, icon } = payload;
    commit(mutationTypes.SEND_NOTIFICATION_REQUEST);
    try {
      const noti = {
        vendorId,
        renterId,
        data: {
          title,
          body,
          action,
          id,
          icon,
        },
      };
      await window.axios.post('/api/v1/notification/token', noti);
      commit(mutationTypes.SEND_NOTIFICATION_SUCCESS);
    } catch (error) {
      commit(mutationTypes.SEND_NOTIFICATION_FAILURE, error);
    }
  },
  addNotificationLocal({ commit }, noti) {
    try {
      commit(mutationTypes.ADD_NOTIFICATION_LOCAL_REQUEST);
      commit(mutationTypes.ADD_NOTIFICATION_LOCAL_SUCCESS, noti);
    } catch (error) {
      commit(mutationTypes.ADD_NOTIFICATION_LOCAL_FAILURE, error);
    }
  },
  async sendFeedback({ commit, state }, feedback) {
    try {
      commit(mutationTypes.CREATE_FEEDBACK_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!userId && !state.user.data) {
        const error = new Error('Loggin to send feedback');
        commit(mutationTypes.CREATE_FEEDBACK_FAILURE, error);
      } else if (role !== 'renters') {
        const error = new Error('Only renter have permission to send feedback');
        commit(mutationTypes.CREATE_FEEDBACK_FAILURE, error);
      } else {
        const res = await window.axios.post('/api/v1/feedbacks', feedback);
        if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.CREATE_FEEDBACK_SUCCESS, res.data.data);
        } else {
          const error = new Error('Cannot receive response from server');
          commit(mutationTypes.CREATE_FEEDBACK_FAILURE, error);
        }
      }
    } catch (error) {
      commit(mutationTypes.CREATE_FEEDBACK_FAILURE, error);
    }
  },
  async deleteFeedback({ commit, state }, feedbackId) {
    try {
      commit(mutationTypes.DELETE_FEEDBACK_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!userId && !state.user.data) {
        const error = new Error('Loggin to remove feedback');
        commit(mutationTypes.DELETE_FEEDBACK_FAILURE, error);
      } else if (role !== 'renters') {
        const error = new Error('Only owner  have permission to remove feedback');
        commit(mutationTypes.DELETE_FEEDBACK_FAILURE, error);
      } else {
        const res = await window.axios.delete(`/api/v1/feedbacks/${feedbackId}`);
        if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.DELETE_FEEDBACK_SUCCESS);
        } else {
          const error = new Error('Cannot receive response from server');
          commit(mutationTypes.DELETE_FEEDBACK_FAILURE, error);
        }
      }
    } catch (error) {
      commit(mutationTypes.CREATE_FEEDBACK_FAILURE, error);
    }
    return feedbackId;
  },
  async updateFeedback({ commit, state }, feedback) {
    try {
      commit(mutationTypes.UPDATE_FEEDBACK_REQUEST);
      const userId = window.$cookies.get('userId');
      const role = window.$cookies.get('role');
      if (!userId && !state.user.data) {
        const error = new Error('Loggin to update feedback');
        commit(mutationTypes.UPDATE_FEEDBACK_FAILURE, error);
      } else if (role !== 'renters') {
        const error = new Error('Only owner have permission to feedback');
        console.log(feedback);
        commit(mutationTypes.UPDATE_FEEDBACK_FAILURE, error);
      } else {
        const res = await window.axios.put(`/api/v1/feedbacks/${feedback.feedbackId}`, {
          feedback,
        });
        if (!res) {
          const error = new Error('Cannot receive response from server');
          commit(mutationTypes.UPDATE_FEEDBACK_FAILURE, error);
        } else if (res.status >= 200 && res.status <= 299) {
          commit(mutationTypes.UPDATE_FEEDBACK_SUCCESS, res.data.data);
        }
      }
    } catch (error) {
      commit(mutationTypes.UPDATE_FEEDBACK_FAILURE, error);
    }
  },
};

export default {
  namespaced: true,
  state: myState,
  mutations,
  getters: myGetters,
  actions,
};
