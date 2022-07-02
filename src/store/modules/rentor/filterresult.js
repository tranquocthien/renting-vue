const myState = {
  search: {
    value: '',
  },
  coordinator: {
    latitude: '',
    longitude: '',
    address: '',
  },
  filter: {
    coordinator: {
      latitude: '',
      longitude: '',
      address: '',
    },
    distance: {
      select: '3km',
      items: ['3km', '5km', '7km', '10km'],
    },
    around: {
      selects: [],
      data: [],
      isLoading: false,
    },
    categories: {
      data: [],
      select: '',
      isLoading: false,
    },
    facility: {
      selects: [],
      data: [],
      isLoading: false,
    },
    price: {
      min: 0,
      max: 15,
      range: [0, 2.5],
      disable: false,
    },
    minArea: {
      select: '',
      items: ['10 m2', '15 m2', '20 m2', '25 m2', '30 m2', '40 m2', '50 m2', '70 m2', '100 m2'],
    },
    schools: {
      select: '',
      items: [],
      isLoading: false,
    },
    hometown: {
      select: '',
      items: [],
      isLoading: false,
    },
    regulations: {
      select: [],
      items: [],
      isLoading: false,
    },
  },
  results: {
    data: {
      types: null,
      groups: null,
      distances: null,
      totalType: Number,
    },
    page: 1,
    isLoading: false,
    error: null,
  },
};
const mutationTypes = {
  SET_FILTER_VALUES: 'SET_FILTER_VALUES',
  SET_SEARCH_VALUE: 'SET_SEARCH_VALUE',
  SET_PAGE: 'SET_PAGE',
  GET_FILTER_RESULT_REQUEST: 'GET_FILTER_RESULT_REQUEST',
  GET_FILTER_RESULT_SUCCESS: 'GET_FILTER_RESULT_SUCCESS',
  GET_FILTER_RESULT_FAILURE: 'GET_FILTER_RESULT_FAILURE',
  // categories
  GET_CATEGORIES_SUCCESS: 'GET_CATEGORIES_SUCCESS',
  GET_CATEGORIES_FAILURE: 'GET_CATEGORIES_FAILURE',
  GET_CATEGORIES_REQUEST: 'GET_CATEGORIES_REQUEST',
  SET_CATEGORIES_SELECT: 'SET_CATEGORIES_SELECT',
  // facilities
  GET_FACILITIES_SUCCESS: 'GET_FACILITIES_SUCCESS',
  GET_FACILITIES_FAILURE: 'GET_FACILITIES_FAILURE',
  GET_FACILITIES_REQUEST: 'GET_FACILITIES_REQUEST',
  // utilities
  GET_UTILITIES_SUCCESS: 'GET_UTILITIES_SUCCESS',
  GET_UTILITIES_FAILURE: 'GET_UTILITIES_FAILURE',
  GET_UTILITIES_REQUEST: 'GET_UTILITIES_REQUEST',
  // school
  GET_SCHOOLS_SUCCESS: 'GET_SCHOOLS_SUCCESS',
  GET_SCHOOLS_FAILURE: 'GET_SCHOOLS_FAILURE',
  GET_SCHOOLS_REQUEST: 'GET_SCHOOLS_REQUEST',
  // provinces
  GET_PROVINCES_SUCCESS: 'GET_PROVINCES_SUCCESS',
  GET_PROVINCES_FAILURE: 'GET_PROVINCES_FAILURE',
  GET_PROVINCES_REQUEST: 'GET_PROVINCES_REQUEST',
  // regulations
  GET_REGULATIONS_SUCCESS: 'GET_REGULATIONS_SUCCESS',
  GET_REGULATIONS_FAILURE: 'GET_REGULATIONS_FAILURE',
  GET_REGULATIONS_REQUEST: 'GET_REGULATIONS_REQUEST',
  // get real distance by gg API
  GET_REAL_DISTANCE_REQUEST: 'GET_REAL_DISTANCE_REQUEST',
  GET_REAL_DISTANCE_SUCCESS: 'GET_REAL_DISTANCE_SUCCESS',
  GET_REAL_DISTANCE_FAILURE: 'GET_REAL_DISTANCE_FAILURE',
};
const mutations = {
  SET_FILTER_VALUES: (state, filterValues) => {
    state.filter = filterValues;
  },
  SET_PAGE: (state, page) => {
    state.results.page = page;
  },
  SET_SEARCH_VALUE: (state, searchValue) => {
    state.search.value = searchValue;
  },
  GET_FILTER_RESULT_REQUEST: (state) => {
    state.results.isLoading = true;
  },
  GET_FILTER_RESULT_SUCCESS: (state, results) => {
    state.results.data = results;
    state.results.isLoading = false;
    state.results.error = null;
  },
  GET_FILTER_RESULT_FAILURE: (state, error) => {
    state.results.data = null;
    state.results.isLoading = false;
    state.results.error = error;
  },
  GET_REAL_DISTANCE_REQUEST: (state) => {
    state.results.isLoading = true;
  },
  GET_REAL_DISTANCE_SUCCESS: (state, distances) => {
    console.log(distances);
    state.results.data.distances = distances;
    state.results.isLoading = false;
    state.results.error = null;
  },
  GET_REAL_DISTANCE_FAILURE: (state, error) => {
    state.results.data = null;
    state.results.isLoading = false;
    state.results.error = error;
  },
  // categories
  GET_CATEGORIES_SUCCESS(state, inputData) {
    state.filter.categories.data = inputData;
    state.filter.categories.select = inputData.filter((c) => c.displayOrder === 1)[0].categoryId;
    state.filter.categories.isLoading = false;
  },
  GET_CATEGORIES_FAILURE(state) {
    state.filter.categories.isLoading = false;
  },
  GET_CATEGORIES_REQUEST(state) {
    state.filter.categories.isLoading = true;
  },
  // facilities
  GET_FACILITIES_SUCCESS(state, inputData) {
    state.filter.facility.data = inputData;
    state.filter.facility.isLoading = false;
  },
  GET_FACILITIES_FAILURE(state) {
    state.filter.facility.isLoading = false;
  },
  GET_FACILITIES_REQUEST(state) {
    state.filter.facility.isLoading = true;
  },
  // UTILITIES
  GET_UTILITIES_SUCCESS(state, inputData) {
    state.filter.around.data = inputData;
    state.filter.around.isLoading = false;
  },
  GET_UTILITIES_FAILURE(state) {
    state.filter.around.isLoading = false;
  },
  GET_UTILITIES_REQUEST(state) {
    state.filter.around.isLoading = true;
  },
  // get all school
  GET_SCHOOLS_SUCCESS(state, inputData) {
    state.filter.schools.items = inputData;
    state.filter.schools.isLoading = false;
  },
  GET_SCHOOLS_FAILURE(state) {
    state.filter.schools.isLoading = false;
  },
  GET_SCHOOLS_REQUEST(state) {
    state.filter.schools.isLoading = true;
  },
  // get all provinces
  GET_PROVINCES_SUCCESS(state, inputData) {
    state.filter.hometown.items = inputData;
    state.filter.hometown.isLoading = false;
  },
  GET_PROVINCES_FAILURE(state) {
    state.filter.hometown.isLoading = false;
  },
  GET_PROVINCES_REQUEST(state) {
    state.filter.hometown.isLoading = true;
  },
  // get all regulations
  GET_REGULATIONS_SUCCESS(state, inputData) {
    state.filter.regulations.items = inputData;
    state.filter.regulations.isLoading = false;
  },
  GET_REGULATIONS_FAILURE(state) {
    state.filter.regulations.isLoading = false;
  },
  GET_REGULATIONS_REQUEST(state) {
    state.filter.regulations.isLoading = true;
  },
};
const getters = {
  getHostelGroupById: (state) => (id) => {
    let result = null;
    if (state.results.data.groups) {
      result = state.results.data.groups.filter((group) => group.groupId === Number(id));
      if (result.length > 0) {
        return result[0];
      }
    }
    return result;
  },
  getHostelTypeById: (state) => (id) => {
    let result = null;
    if (state.results.data.types) {
      result = state.results.data.types.filter((type) => type.typeId === Number(id));
      if (result.length > 0) {
        return result[0];
      }
    }
    return result;
  },
};
const actions = {
  setFilterValue({ commit }, filterValues) {
    commit(mutationTypes.SET_FILTER_VALUES, filterValues);
  },
  setPageValue({ commit }, page) {
    commit(mutationTypes.SET_PAGE, page);
  },
  setSearchValue({ commit }, searchValue) {
    commit(mutationTypes.SET_SEARCH_VALUE, searchValue);
  },
  // async getFilterResult({ commit, state }, params) {
  //   commit(mutationTypes.GET_FILTER_RESULT_REQUEST);
  //   const data = {
  //     around: state.filter.around.selects,
  //     facility: state.filter.around.selects,
  //     price: state.filter.price.select,
  //     area: state.filter.area.select,
  //   };
  //   const convert = {
  //     maxPrice: Number(data.price.split(' ')[0]) * 1000000,
  //     minSuperficiality: data.area.split(' ')[0],
  //     minCapacity: 0,
  //     maxCapacity: 10,
  //     address: state.search.value,
  //   };
  //   let queryString = Object.keys(convert).map((key) => {
  //     if (convert[key]) {
  //       return `${key}=${convert[key]}&`;
  //     }
  //     return '';
  //   });
  //   queryString = `?${queryString.join('')}size=${params.size}&page=${params.page}`;
  //   const res = await window.axios.get(`/api/v1/types${queryString}`);
  //   if (res.status >= 200 && res.status <= 299) {
  //     commit(mutationTypes.GET_FILTER_RESULT_SUCCESS, res.data.data);
  //   } else {
  //     commit(mutationTypes.GET_FILTER_RESULT_FAILURE);
  //   }
  // },
  async searchByCoordinator({ commit }, params) {
    // params = {lat, long}
    try {
      const url = `/api/v1/types?asc=false&distance=5&latitude=${params.lat}&longitude=${params.long}&page=1&size=5&sortBy=score`;
      window.$cookies.set('searchValue', url);
      const res = await window.axios.get(url);
      commit(mutationTypes.GET_FILTER_RESULT_REQUEST);
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_FILTER_RESULT_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_FILTER_RESULT_FAILURE, error);
    }
  },
  // main search
  async filterSearchByCoordinatorResult({ commit }, params) {
    // params = {lat, long, filterProperties}
    try {
      commit(mutationTypes.GET_FILTER_RESULT_REQUEST);
      let url = '';
      if (params.paramsStr) {
        url = params.paramsStr;
      } else {
        // coordinator
        let coordinatorStr = '';
        if (params.filterProperties.coordinator !== '') {
          coordinatorStr = `&latitude=${params.filterProperties.coordinator.latitude}&longitude=${params.filterProperties.coordinator.longitude}`;
        }
        // distance
        let distanceStr = '';
        const distance = params.filterProperties.distance.select.split('km')[0];
        distanceStr = `&distance=${distance}`;
        let facilitiesStr = '';
        params.filterProperties.facility.selects.forEach((element) => {
          facilitiesStr += `&facilityIds=${element}`;
        });
        let utilitiesStr = '';
        params.filterProperties.around.selects.forEach((element) => {
          utilitiesStr += `&uCategoryIds=${element}`;
        });
        // school
        let schoolStr = '';
        if (params.filterProperties.schools.select) {
          schoolStr = `&schoolId=${params.filterProperties.schools.select}`;
        }
        // hometown
        let hometownStr = '';
        if (params.filterProperties.hometown.select) {
          hometownStr = `&provinceId=${params.filterProperties.hometown.select}`;
        }
        // price
        let priceStr = '';
        if (params.filterProperties.price.disable) {
          priceStr = `&maxPrice=${params.filterProperties.price.range[1]}&minPrice=${params.filterProperties.price.range[0]}`;
        }
        // category
        let categoryStr = '';
        if (params.filterProperties.categories.select) {
          categoryStr = `&categoryId=${params.filterProperties.categories.select}`;
        }
        // min area
        let minSuperficialityStr = '';
        if (params.filterProperties.minArea.select !== '') {
          const minSuperficiality = params.filterProperties.minArea.select.split(' ')[0];
          minSuperficialityStr = `&minSuperficiality=${minSuperficiality}`;
        }
        url = `/api/v1/types?asc=false${coordinatorStr}${distanceStr}${utilitiesStr}${facilitiesStr}${priceStr}${categoryStr}${minSuperficialityStr}${schoolStr}${hometownStr}&page=${params.page}&size=${params.size}&sortBy=score`; // eslint-disable-line
      }
      window.$cookies.set('searchValue', url);

      const res = await window.axios.get(url);
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_FILTER_RESULT_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.GET_FILTER_RESULT_FAILURE, res.status);
      }
    } catch (error) {
      commit(mutationTypes.GET_FILTER_RESULT_FAILURE, 500);
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
  async getAllUtilities({ commit }) {
    // no param
    try {
      commit(mutationTypes.GET_UTILITIES_REQUEST);
      const res = await window.axios.get('/api/v1/ucategories');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_UTILITIES_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.GET_UTILITIES_FAILURE);
    }
  },
  async getAllSchools({ commit }) {
    // no param
    try {
      commit(mutationTypes.GET_SCHOOLS_REQUEST);
      const res = await window.axios.get('/api/v1/schools');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_SCHOOLS_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.GET_SCHOOLS_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_SCHOOLS_FAILURE);
    }
  },
  async getAllProvinces({ commit }) {
    // no param
    try {
      commit(mutationTypes.GET_PROVINCES_REQUEST);
      const res = await window.axios.get('/api/v1/provinces?short=true');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_PROVINCES_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.GET_PROVINCES_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_PROVINCES_FAILURE);
    }
  },
  async getAllRegulations({ commit }) {
    // no param
    try {
      commit(mutationTypes.GET_REGULATIONS_REQUEST);
      const res = await window.axios.get('api/v1/regulations');
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.GET_REGULATIONS_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.GET_REGULATIONS_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_REGULATIONS_FAILURE);
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
};
export default {
  namespaced: true,
  state: myState,
  mutations,
  getters,
  actions,
};
