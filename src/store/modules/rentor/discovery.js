const myState = () => ({
  stats: {
    streets: {
      data: [],
      streetIds: [],
      isLoading: false,
      error: undefined,
      success: undefined,
    },
    district: {
      data: null,
      isLoading: false,
      success: null,
      error: null,
    },
    province: {
      data: [],
      isLoading: true,
      success: null,
      error: null,
    },
  },
});

const getters = {
  getStatsByIds: (state) => (ids) => {
    const res = state.stats.streets.data.filter((street) => ids.includes(street.streetId));
    return res;
  },
  getAverage: (state) => (ids) => {
    const res = state.stats.streets.data.filter((street) => ids.includes(street.streetId));
    const init = {
      area: 0,
      room: 0,
      price: 0,
    };
    const summary = res.reduce((acc, curr) => {
      acc.area += curr.avgSuperficiality * curr.count;
      acc.room += curr.count;
      acc.price += curr.avgPrice * curr.count;
      return acc;
    }, init);
    return {
      price: (summary.price / summary.room).toFixed(2),
      area: (summary.area / summary.room).toFixed(2),
    };
  },
};
const mutationTypes = {
  GET_STREET_STATS_REQUEST: 'GET_STREET_STATS_REQUEST',
  GET_STREET_STATS_SUCCESS: 'GET_STREET_STATS_SUCCESS',
  GET_STREET_STATS_FAILURE: 'GET_STREET_STATS_FAILURE',

  GET_DISTRICT_STATS_REQUEST: 'GET_DISTRICT_STATS_REQUEST',
  GET_DISTRICT_STATS_SUCCESS: 'GET_DISTRICT_STATS_SUCCESS',
  GET_DISTRICT_STATS_FAILURE: 'GET_DISTRICT_STATS_FAILURE',

  GET_PROVINCE_STATS_REQUEST: 'GET_PROVINCE_STATS_REQUEST',
  GET_PROVINCE_STATS_SUCCESS: 'GET_PROVINCE_STATS_SUCCESS',
  GET_PROVINCE_STATS_FAILURE: 'GET_PROVINCE_STATS_FAILURE',
};
const mutations = {
  GET_STREET_STATS_REQUEST(state) {
    state.stats.streets.isLoading = true;
  },
  GET_STREET_STATS_SUCCESS(state, stats) {
    state.stats.streets.data = stats;
    state.stats.streets.success = true;
    state.stats.streets.isLoading = false;
  },
  GET_STREET_STATS_FAILURE(state, error) {
    state.stats.streets.error = error;
    state.stats.streets.success = false;
    state.stats.streets.isLoading = false;
  },

  GET_DISTRICT_STATS_REQUEST(state) {
    state.stats.district.isLoading = true;
  },
  GET_DISTRICT_STATS_SUCCESS(state, data) {
    state.stats.district.data = data;
    state.stats.district.isLoading = false;
    state.stats.district.success = true;
  },
  GET_DISTRICT_STATS_FAILURE(state, error) {
    state.stats.district.isLoading = false;
    state.stats.district.error = error;
  },

  GET_PROVINCE_STATS_REQUEST(state) {
    state.stats.province.isLoading = true;
  },
  GET_PROVINCE_STATS_SUCCESS(state, data) {
    state.stats.province.data = data;
    state.stats.province.isLoading = false;
    state.stats.province.success = true;
  },
  GET_PROVINCE_STATS_FAILURE(state, error) {
    state.stats.province.isLoading = false;
    state.stats.province.error = error;
  },
};
const actions = {
  async getStreetStats({ commit, state }, streetIds) {
    const currentIds = state.stats.streets.streetIds;
    const notDuplicateIds = streetIds.filter((id) => !currentIds.includes(id));
    currentIds.push(notDuplicateIds);
    try {
      commit(mutationTypes.GET_STREET_STATS_REQUEST);
      const res = await window.axios.get(
        `/api/v1/statistic?streetIds=${notDuplicateIds.join(',')}`,
      );
      commit(mutationTypes.GET_STREET_STATS_SUCCESS, res.data.data);
    } catch (error) {
      commit(mutationTypes.GET_STREET_STATS_FAILURE, error);
    }
  },

  async getDistrictStatistic({ commit }, districtId) {
    try {
      commit(mutationTypes.GET_DISTRICT_STATS_REQUEST);
      const response = await window.axios.get(`/api/v1/statistic?ids=${districtId}`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_DISTRICT_STATS_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_DISTRICT_STATS_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_DISTRICT_STATS_FAILURE, error);
    }
  },
  async getProvinceStatistic({ commit }, districts) {
    // param: list districtIds
    try {
      commit(mutationTypes.GET_PROVINCE_STATS_REQUEST);
      let districtIdsStr = '';
      districts.districts.forEach((element) => {
        districtIdsStr += `&ids=${element.districtId}`;
      });
      const response = await window.axios.get(`/api/v1/statistic?${districtIdsStr}`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_PROVINCE_STATS_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_PROVINCE_STATS_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_PROVINCE_STATS_FAILURE, error);
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
