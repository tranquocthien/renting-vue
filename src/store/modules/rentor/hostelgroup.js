const myState = () => ({
  hostelGroup: {
    data: null,
    isLoading: false,
    success: null,
    error: null,
  },
  hostelTypes: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
  filter: {
    facilitiesIds: [],
    categoriesIds: [],
    range: [],
    minSuperficiality: '',
    disabledPrice: '',
  },
  filterResult: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
  utilities: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
});
const mutationTypes = {
  GET_HOSTEL_GROUP_REQUEST: 'GET_HOSTEL_GROUP_REQUEST',
  GET_HOSTEL_GROUP_SUCCESS: 'GET_HOSTEL_GROUP_SUCCESS',
  GET_HOSTEL_GROUP_FAILURE: 'GET_HOSTEL_GROUP_FAILURE',

  GET_HOSTEL_TYPES_SUCCESS: 'GET_HOSTEL_TYPES_SUCCESS',
  GET_HOSTEL_TYPES_FAILURE: 'GET_HOSTEL_TYPES_FAILURE',
  GET_HOSTEL_TYPES_REQUEST: 'GET_HOSTEL_TYPES_REQUEST',

  GET_FILTER_RESULT_SUCCESS: 'GET_FILTER_RESULT_SUCCESS',
  GET_FILTER_RESULT_FAILURE: 'GET_FILTER_RESULT_FAILURE',
  GET_FILTER_RESULT_REQUEST: 'GET_FILTER_RESULT_REQUEST',

  GET_UTILITES_REQUEST: 'GET_UTILITES_REQUEST',
  GET_UTILITES_SUCCESS: 'GET_UTILITES_SUCCESS',
  GET_UTILITES_FAILURE: 'GET_UTILITES_FAILURE',

  SET_FILTER_VALUES: 'SET_FILTER_VALUES',
};
const mutations = {
  // get group information
  GET_HOSTEL_GROUP_REQUEST(state) {
    state.hostelGroup.isLoading = true;
  },
  GET_HOSTEL_GROUP_SUCCESS(state, hostelGroup) {
    state.hostelGroup.data = hostelGroup;
    state.hostelGroup.isLoading = false;
    state.hostelGroup.success = true;
  },
  GET_HOSTEL_GROUP_FAILURE(state, error) {
    state.hostelGroup.isLoading = false;
    state.hostelGroup.error = error;
  },
  // get all hostel types of group
  GET_HOSTEL_TYPES_REQUEST(state) {
    state.hostelTypes.isLoading = true;
  },
  GET_HOSTEL_TYPES_SUCCESS(state, hostelGroup) {
    state.hostelTypes.data = hostelGroup;
    state.hostelTypes.isLoading = false;
    state.hostelTypes.success = true;
  },
  GET_HOSTEL_TYPES_FAILURE(state, error) {
    state.hostelTypes.isLoading = false;
    state.hostelTypes.error = error;
  },
  // get filter result
  GET_FILTER_RESULT_REQUEST(state) {
    state.filterResult.isLoading = true;
  },
  GET_FILTER_RESULT_SUCCESS(state, filterResult) {
    state.filterResult.data = filterResult;
    state.filterResult.isLoading = false;
    state.filterResult.success = true;
  },
  GET_FILTER_RESULT_FAILURE(state, error) {
    state.filterResult.isLoading = false;
    state.filterResult.error = error;
  },
  // get nearby utilities
  GET_UTILITES_REQUEST(state) {
    state.utilities.isLoading = true;
  },
  GET_UTILITES_SUCCESS(state, utilities) {
    state.utilities.data = utilities;
    state.utilities.isLoading = false;
    state.utilities.success = true;
  },
  GET_UTILITES_FAILURE(state, error) {
    state.utilities.isLoading = false;
    state.utilities.error = error;
  },
  // setter
  SET_FILTER_VALUES: (state, filterValues) => {
    state.filter = filterValues;
  },

  CREATE_HOSTEL_GROUP_REQUEST: (state) => {
    state.hostelGroup.isCreating = true;
  },
  CREATE_HOSTEL_GROUP_SUCCESS: (state, createdNewGroup) => {
    state.hostelGroup.isCreating = false;
    state.hostelGroup.data.unshift(createdNewGroup);
    state.hostelGroup.success = true;
  },
  CREATE_HOSTEL_GROUP_FAILURE: (state, error) => {
    state.hostelGroup.isCreating = false;
    state.hostelGroup.error = error;
  },
};

const actions = {
  setFilterValue({ commit }, filterValues) {
    commit(mutationTypes.SET_FILTER_VALUES, filterValues);
  },
  async getHostelGroup({ commit }, groupId) {
    try {
      commit(mutationTypes.GET_HOSTEL_GROUP_REQUEST);
      const response = await window.axios.get(`/api/v1/groups/${groupId}`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_HOSTEL_GROUP_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_HOSTEL_GROUP_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_HOSTEL_GROUP_FAILURE, error);
    }
  },
  async getAllHostelTypes({ commit }, groupId) {
    try {
      commit(mutationTypes.GET_HOSTEL_TYPES_REQUEST);
      const response = await window.axios.get(`/api/v1/groups/${groupId}/types`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_HOSTEL_TYPES_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_HOSTEL_TYPES_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_HOSTEL_TYPES_FAILURE, error);
    }
  },
  async getNearByUtilities({ commit }, param) {
    // param: longitude, latitude, distance
    try {
      commit(mutationTypes.GET_UTILITES_REQUEST);
      const response = await window.axios.get(
        `/api/v1/utilities?distance=${param.distance}&latitude=${param.latitude}&longitude=${param.longitude}`,
      );
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_UTILITES_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_UTILITES_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_UTILITES_FAILURE, error);
    }
  },
  // eslint-disable max-len
  filterHostelType({ commit }, param) {
    try {
      commit(mutationTypes.GET_FILTER_RESULT_REQUEST);
      const { filterParam } = param;
      const { types } = param;
      let result = types;
      if (filterParam) {
        if (filterParam.categoriesIds.length !== 0) {
          console.log('vao');
          result = result.filter((c) => filterParam.categoriesIds.includes(c.category.categoryId));
        }
        if (filterParam.facilitiesIds.length !== 0) {
          result = result.filter((f) => {
            const fIds = filterParam.facilitiesIds;
            return fIds.every((i) => f.facilities.find((fi) => fi.facilityId === i));
          });
        }
        if (filterParam.disabledPrice) {
          result = result.filter(
            (p) => filterParam.range[0] <= p.price && filterParam.range[1] >= p.price,
          );
        }
        if (filterParam.minSuperficiality) {
          const minSuperficiality = filterParam.minSuperficiality.split(' ')[0];
          result = result.filter((p) => p.superficiality >= minSuperficiality);
        }
      }
      commit(mutationTypes.GET_FILTER_RESULT_SUCCESS, result);
    } catch (error) {
      commit(mutationTypes.GET_FILTER_RESULT_FAILURE, error);
    }
  },
};

export default {
  namespaced: true,
  state: myState,
  mutations,
  actions,
};
