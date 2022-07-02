const myState = () => ({
  provinces: {
    data: [],
    isLoading: false,
    error: undefined,
    success: undefined,
  },
  districts: {
    data: [],
  },
  wards: {
    data: [],
  },
  streets: {
    data: [],
  },
  categories: {
    data: [],
    isLoading: false,
  },
  facilities: {
    data: [],
    isLoading: false,
    error: undefined,
    success: undefined,
  },
  services: {
    data: [],
    isLoading: false,
    error: undefined,
    success: undefined,
  },
  rules: {
    data: [],
    isLoading: false,
    error: undefined,
    success: undefined,
  },
  schedule: {
    data: [],
    isLoading: false,
    error: undefined,
    success: undefined,
  },
});
const getters = {
  getCategoryId: (state) => (id) => {
    const result = state.categories.data.find((category) => category.categoryId === Number(id));
    return result;
  },
  getStreetById: (state) => (id) => {
    const res = state.streets.data.find((street) => street.streetId === Number(id));
    return res;
  },
  getWardByStreetId: (state) => (id) => {
    const res = state.wards.data.find((ward) => {
      const res1 = ward.streets.find((street) => street.streetId === Number(id));
      return res1;
    });
    return res;
  },
  getWardById: (state) => (id) => state.wards.data.find((ward) => ward.wardId === Number(id)),
  getDistrictByWardId: (state) => (id) => {
    const res = state.districts.data.find((district) => {
      const res1 = district.wards.find((ward) => ward.wardId === Number(id));
      return res1;
    });
    return res;
  },
  getProvinceByDistrictId: (state) => (id) => {
    const res = state.provinces.data.find((province) => {
      const res1 = province.districts.find((district) => district.districtId === Number(id));
      return res1;
    });
    return res;
  },
};
const mutationTypes = {
  GET_PROVINCES_REQUEST: 'GET_PROVINCES_REQUEST',
  GET_PROVINCES_SUCCESS: 'GET_PROVINCES_SUCCESS',
  GET_PROVINCES_FAILURE: 'GET_PROVINCES_FAILURE',

  GET_CATEGORIES_REQUEST: 'GET_CATEGORIES_REQUEST',
  GET_CATEGORIES_SUCCESS: 'GET_CATEGORIES_SUCCESS',
  GET_CATEGORIES_FAILURE: 'GET_CATEGORIES_FAILURE',

  GET_SERVICES_REQUEST: 'GET_SERVICES_REQUEST',
  GET_SERVICES_SUCCESS: 'GET_SERVICES_SUCCESS',
  GET_SERVICES_FAILURE: 'GET_SERVICES_FAILURE',

  GET_FACILITIES_REQUEST: 'GET_FACILITIES_REQUEST',
  GET_FACILITIES_SUCCESS: 'GET_FACILITIES_SUCCESS',
  GET_FACILITIES_FAILURE: 'GET_FACILITIES_FAILURE',

  GET_RULES_REQUEST: 'GET_RULES_REQUEST',
  GET_RULES_SUCCESS: 'GET_RULES_SUCCESS',
  GET_RULES_FAILURE: 'GET_RULES_FAILURE',

  GET_SCHEDULE_REQUEST: 'GET_SCHEDULE_REQUEST',
  GET_SCHEDULE_SUCCESS: 'GET_SCHEDULE_SUCCESS',
  GET_SCHEDULE_FAILURE: 'GET_SCHEDULE_FAILURE',
};
const mutations = {
  GET_CATEGORIES_REQUEST(state) {
    state.categories.isLoading = true;
  },
  GET_CATEGORIES_SUCCESS(state, categories) {
    state.categories.data = categories;
    state.categories.isLoading = false;
  },
  GET_CATEGORIES_FAILURE(state) {
    state.categories.isLoading = false;
  },

  GET_PROVINCES_REQUEST(state) {
    state.provinces.isLoading = true;
  },
  GET_PROVINCES_SUCCESS(state, provinces) {
    // get all districts from provinces
    let districts = provinces.map((province) => province.districts);
    districts = districts.flat();
    // get all wards from districts
    let wards = districts.map((district) => district.wards);
    wards = wards.flat();
    // get all streets from wards
    let streets = wards.map((ward) => ward.streets);
    streets = streets.flat();
    // set data
    state.provinces.data = provinces;
    state.districts.data = districts;
    state.wards.data = wards;
    state.streets.data = streets;
    state.provinces.isLoading = false;
  },
  GET_PROVINCES_FAILURE(state) {
    state.provinces.isLoading = false;
  },

  GET_FACILITIES_SUCCESS(state, inputData) {
    state.facilities.data = inputData;
    state.facilities.isLoading = false;
    state.facilities.success = true;
  },
  GET_FACILITIES_FAILURE(state, error) {
    state.facilities.isLoading = false;
    state.facilities.error = error;
    state.facilities.success = false;
  },
  GET_FACILITIES_REQUEST(state) {
    state.facilities.isLoading = true;
  },

  GET_SERVICES_SUCCESS(state, inputData) {
    state.services.data = inputData;
    state.services.isLoading = false;
    state.services.success = true;
  },
  GET_SERVICES_FAILURE(state, error) {
    state.services.isLoading = false;
    state.services.error = error;
    state.services.success = false;
  },
  GET_SERVICES_REQUEST(state) {
    state.services.isLoading = true;
  },
  GET_RULES_REQUEST(state) {
    state.rules.isLoading = true;
  },
  GET_RULES_SUCCESS(state, rules) {
    state.rules.isLoading = false;
    state.rules.data = rules;
    state.rules.success = true;
  },
  GET_RULES_FAILURE(state, error) {
    state.rules.isLoading = false;
    state.rules.error = error;
    state.rules.success = false;
  },
  GET_SCHEDULE_REQUEST(state) {
    state.schedule.isLoading = true;
  },
  GET_SCHEDULE_SUCCESS(state, schedule) {
    state.schedule.isLoading = false;
    state.schedule.data = schedule;
    state.schedule.success = true;
  },
  GET_SCHEDULE_FAILURE(state, error) {
    state.schedule.isLoading = false;
    state.schedule.error = error;
    state.schedule.success = false;
  },
};
const actions = {
  async getCategories({ commit, state }) {
    if (state.categories.data.length === 0 && !state.categories.isLoading) {
      commit(mutationTypes.GET_CATEGORIES_REQUEST);
      const res = await window.axios.get('/api/v1/categories');
      if (res.status === 200) {
        commit(mutationTypes.GET_CATEGORIES_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.GET_PROVINCES_FAILURE);
      }
    }
  },
  async getProvinces({ commit, state }) {
    if (state.provinces.data.length === 0 && !state.provinces.isLoading) {
      commit(mutationTypes.GET_PROVINCES_REQUEST);
      const res = await window.axios.get('/api/v1/provinces');
      if (res.status === 200) {
        commit(mutationTypes.GET_PROVINCES_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.GET_PROVINCES_FAILURE);
      }
    }
  },

  async getAllFacilities1({ commit }) {
    try {
      commit(mutationTypes.GET_FACILITIES_REQUEST);
      const res = await window.axios.get('/api/v1/facilities');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_FACILITIES_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_FACILITIES_FAILURE, error);
    }
  },

  async getAllServices1({ commit }) {
    console.log('get all serverice');
    try {
      commit(mutationTypes.GET_SERVICES_REQUEST);
      const res = await window.axios.get('/api/v1/services');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_SERVICES_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_SERVICES_FAILURE, error);
    }
  },
  async getAllRules({ commit }) {
    try {
      commit(mutationTypes.GET_RULES_REQUEST);
      const res = await window.axios.get('/api/v1/regulations');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_RULES_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_RULES_FAILURE, error);
    }
  },
  async getAllSchedule({ commit }) {
    try {
      commit(mutationTypes.GET_SCHEDULE_REQUEST);
      const res = await window.axios.get('/api/v1/schedules');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_SCHEDULE_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_SERVICES_FAILURE, error);
    }
  },
};
export default {
  namespaced: true,
  state: myState,
  mutations,
  getters,
  actions,
};
