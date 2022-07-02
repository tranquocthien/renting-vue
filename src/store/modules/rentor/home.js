const myState = () => ({
  searchType: {
    isOptional: false,
    nameAddress: '',
    school: '',
    hometown: '',
  },
  hostelTypes: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
  hostelGroups: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
  facilities: {
    data: [],
    isLoading: false,
  },
  services: {
    data: [],
    isLoading: false,
  },
  topView: {
    data: [],
    isLoading: false,
  },
  topViewHostelGroup: {
    data: [],
    isLoading: false,
  },
  categories: {
    data: [],
    isLoading: false,
  },
  districts: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
});
const getters = {
  getHostelGroupById: (state) => (id) => {
    const result = state.hostelGroups.data.filter((group) => group.groupId === id);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  },
  getHostelTypeById: (state) => (id) => {
    const result = state.hostelTypes.data.filter((type) => type.typeId === Number(id));
    if (result.length > 0) {
      return result[0];
    }
    return null;
  },
  getTopViewHostelGroupById: (state) => (id) => {
    const result = state.topViewHostelGroup.data.filter((group) => group.groupId === id);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  },
};
const mutationTypes = {
  SET_SEARCH_TYPE_VALUE: 'SET_SEARCH_TYPE_VALUE',
  SET_SEARCH_OPTIONAL_NAME_ADDRESS: 'SET_SEARCH_OPTIONAL_NAME_ADDRESS',
  SET_SEARCH_OPTIONAL_SCHOOL: 'SET_SEARCH_OPTIONAL_SCHOOL',
  SET_SEARCH_HOMETOWN: 'SET_SEARCH_HOMETOWN',

  GET_HOSTEL_TYPES_SUCCESS: 'GET_HOSTEL_TYPES_SUCCESS',
  GET_HOSTEL_TYPES_FAILURE: 'GET_HOSTEL_TYPES_FAILURE',
  GET_HOSTEL_TYPES_REQUEST: 'GET_HOSTEL_TYPES_REQUEST',

  GET_TOP_VIEW_SUCCESS: 'GET_TOP_VIEW_SUCCESS',
  GET_TOP_VIEW_FAILURE: 'GET_TOP_VIEW_FAILURE',
  GET_TOP_VIEW_REQUEST: 'GET_TOP_VIEW_REQUEST',

  GET_CATEGORIES_SUCCESS: 'GET_CATEGORIES_SUCCESS',
  GET_CATEGORIES_FAILURE: 'GET_CATEGORIES_FAILURE',
  GET_CATEGORIES_REQUEST: 'GET_CATEGORIES_REQUEST',

  GET_FACILITIES_SUCCESS: 'GET_FACILITIES_SUCCESS',
  GET_FACILITIES_FAILURE: 'GET_FACILITIES_FAILURE',
  GET_FACILITIES_REQUEST: 'GET_FACILITIES_REQUEST',

  GET_DISTRICTS_SUCCESS: 'GET_DISTRICTS_SUCCESS',
  GET_DISTRICTS_FAILURE: 'GET_DISTRICTS_FAILURE',
  GET_DISTRICTS_REQUEST: 'GET_DISTRICTS_REQUEST',
};
const mutations = {
  SET_SEARCH_TYPE_VALUE: (state, isOptional) => {
    state.searchType.isOptional = isOptional;
  },
  SET_SEARCH_OPTIONAL_NAME_ADDRESS: (state, nameAddress) => {
    state.searchType.nameAddress = nameAddress;
  },
  SET_SEARCH_OPTIONAL_SCHOOL: (state, school) => {
    state.searchType.school = school;
  },
  SET_SEARCH_HOMETOWN: (state, hometown) => {
    state.searchType.hometown = hometown;
  },
  // hostel type
  GET_HOSTEL_TYPES_SUCCESS(state, inputData) {
    state.hostelTypes.data = inputData.types;
    state.hostelTypes.isLoading = false;
    state.hostelGroups.data = inputData.groups;
    state.hostelGroups.isLoading = false;
    state.hostelTypes.success = true;
    state.hostelGroups.success = true;
  },
  GET_HOSTEL_TYPES_FAILURE(state, error) {
    state.hostelTypes.isLoading = false;
    state.hostelGroups.isLoading = false;
    state.hostelGroups.data = [];
    state.hostelTypes.data = [];
    state.hostelTypes.error = error;
    state.hostelGroups.error = error;
  },
  GET_HOSTEL_TYPES_REQUEST(state) {
    state.hostelTypes.isLoading = true;
    state.hostelGroups.isLoading = true;
  },
  // top view
  GET_TOP_VIEW_SUCCESS(state, inputData) {
    state.topView.data = inputData.types;
    state.topView.isLoading = false;
    state.topViewHostelGroup.data = inputData.groups;
    state.topView.isLoading = false;
  },
  GET_TOP_VIEW_FAILURE(state, error) {
    state.topView.isLoading = false;
    state.topViewHostelGroup.isLoading = false;
    state.topView.data = [];
    state.topViewHostelGroup.data = [];
    state.topView.error = error;
    state.topViewHostelGroup.error = error;
  },
  GET_TOP_VIEW_REQUEST(state) {
    state.topView.isLoading = true;
    state.topViewHostelGroup.isLoading = true;
  },
  // categories
  GET_CATEGORIES_SUCCESS(state, inputData) {
    state.categories.data = inputData;
    state.categories.isLoading = false;
  },
  GET_CATEGORIES_FAILURE(state) {
    state.categories.isLoading = false;
  },
  GET_CATEGORIES_REQUEST(state) {
    state.categories.isLoading = true;
  },
  GET_FACILITIES_SUCCESS(state, inputData) {
    state.facility.data = inputData;
    state.facility.isLoading = false;
  },
  GET_FACILITIES_FAILURE(state) {
    state.facility.isLoading = false;
  },
  GET_FACILITIES_REQUEST(state) {
    state.facility.isLoading = true;
  },
  // get all districts in HCM city
  GET_DISTRICTS_REQUEST(state) {
    state.districts.isLoading = true;
  },
  GET_DISTRICTS_SUCCESS(state, data) {
    state.districts.data = data;
    state.districts.isLoading = false;
    state.districts.success = true;
  },
  GET_DISTRICTS_FAILURE(state, error) {
    state.districts.isLoading = false;
    state.districts.error = error;
  },
};
const actions = {
  setSearchTypeValue({ commit }, isOptional) {
    commit(mutationTypes.SET_SEARCH_TYPE_VALUE, isOptional);
  },
  setNameAddress({ commit }, nameAddress) {
    commit(mutationTypes.SET_SEARCH_OPTIONAL_NAME_ADDRESS, nameAddress);
  },
  setSchool({ commit }, school) {
    commit(mutationTypes.SET_SEARCH_OPTIONAL_SCHOOL, school);
  },
  setHometown({ commit }, hometown) {
    commit(mutationTypes.SET_SEARCH_HOMETOWN, hometown);
  },
  async getHostelTypes({ commit }, params) {
    // params = { page, size }
    try {
      commit(mutationTypes.GET_HOSTEL_TYPES_REQUEST);
      const response = await window.axios.get(
        `/api/v1/types?page=${params.page}&size=${params.size}`,
      );
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_HOSTEL_TYPES_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_HOSTEL_TYPES_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_HOSTEL_TYPES_FAILURE, error);
    }
  },
  async getTopViewHostelTypes({ commit }, params) {
    // params = { size }
    try {
      commit(mutationTypes.GET_TOP_VIEW_REQUEST);
      const response = await window.axios.get(`/api/v1/types?sortBy=view&size=${params.size}`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_TOP_VIEW_SUCCESS, response.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_TOP_VIEW_FAILURE, error);
    }
  },
  async getAllCategories({ commit }) {
    // no param
    try {
      commit(mutationTypes.GET_CATEGORIES_REQUEST);
      const response = await window.axios.get('/api/v1/categories');
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_CATEGORIES_SUCCESS, response.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_CATEGORIES_FAILURE);
    }
  },
  async getAllFacilities({ commit }) {
    // no param
    try {
      commit(mutationTypes.GET_FACILITIES_REQUEST);
      const res = await window.axios.get('/api/v1/facilities');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_FACILITIES_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_FACILITIES_FAILURE);
    }
  },
  async getAllDistricts({ commit }, provinceId) {
    try {
      commit(mutationTypes.GET_DISTRICTS_REQUEST);
      const response = await window.axios.get(`api/v1/provinces/${provinceId}`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_DISTRICTS_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_DISTRICTS_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_DISTRICTS_FAILURE, error);
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
