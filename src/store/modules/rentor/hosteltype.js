const myState = () => ({
  hostelType: {
    data: null,
    isLoading: false,
    success: null,
    error: null,
  },
  hostelGroup: {
    data: null,
    isLoading: false,
    success: null,
    error: null,
  },
  schedules: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
  suggestedTypes: {
    data: {
      types: null,
      groups: null,
      totalType: Number,
      totalGroup: Number,
    },
    page: 1,
    isLoading: false,
    success: null,
    error: null,
  },
  feedback: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
});

const getters = {
  getHostelGroupById: (state) => (id) => {
    let result = null;
    if (state.suggestedTypes.data.groups) {
      result = state.suggestedTypes.data.groups.find((group) => group.groupId === Number(id));
    }
    return result;
  },
  // eslint-disable-next-line
  isLoading: (state) =>
    // eslint-disable-next-line
    state.hostelGroup.isLoading || state.hostelType.isLoading || state.schedules.isLoading,
};

const mutationTypes = {
  GET_HOSTEL_TYPE_REQUEST: 'GET_HOSTEL_TYPE_REQUEST',
  GET_HOSTEL_TYPE_SUCCESS: 'GET_HOSTEL_TYPE_SUCCESS',
  GET_HOSTEL_TYPE_FAILURE: 'GET_HOSTEL_TYPE_FAILURE',

  UPDATE_HOSTEL_TYPE_REQUEST: 'UPDATE_HOSTEL_TYPE_REQUEST',
  UPDATE_HOSTEL_TYPE_SUCCESS: 'UPDATE_HOSTEL_TYPE_SUCCESS',
  UPDATE_HOSTEL_TYPE_FAILURE: 'UPDATE_HOSTEL_TYPE_FAILURE',

  GET_HOSTEL_GROUP_REQUEST: 'GET_HOSTEL_GROUP_REQUEST',
  GET_HOSTEL_GROUP_SUCCESS: 'GET_HOSTEL_GROUP_SUCCESS',
  GET_HOSTEL_GROUP_FAILURE: 'GET_HOSTEL_GROUP_FAILURE',

  GET_SCHEDULES_REQUEST: 'GET_SCHEDULES_REQUEST',
  GET_SCHEDULES_SUCCESS: 'GET_SCHEDULES_SUCCESS',
  GET_SCHEDULES_FAILURE: 'GET_SCHEDULES_FAILURE',

  GET_SUGGESTED_TYPE_REQUEST: 'GET_SUGGESTED_TYPE_REQUEST',
  GET_SUGGESTED_TYPE_SUCCESS: 'GET_SUGGESTED_TYPE_SUCCESS',
  GET_SUGGESTED_TYPE_FAILURE: 'GET_SUGGESTED_TYPE_FAILURE',

  GET_FEEDBACK_REQUEST: 'GET_FEEDBACK_REQUEST',
  GET_FEEDBACK_SUCCESS: 'GET_FEEDBACK_SUCCESS',
  GET_FEEDBACK_FAILURE: 'GET_FEEDBACK_FAILURE',

  SET_FEEDBACKS_VALUES: 'SET_FEEDBACKS_VALUES',
};

const mutations = {
  GET_HOSTEL_TYPE_REQUEST(state) {
    state.hostelType.isLoading = true;
  },
  GET_HOSTEL_GROUP_REQUEST(state) {
    state.hostelGroup.isLoading = true;
  },
  GET_HOSTEL_TYPE_SUCCESS(state, hostelType) {
    state.hostelType.data = hostelType;
    state.hostelType.isLoading = false;
    state.hostelType.success = true;
  },
  UPDATE_HOSTEL_TYPE_REQUEST(state) {
    state.hostelType.isLoading = true;
    state.hostelType.success = true;
    state.hostelType.error = null;
  },
  UPDATE_HOSTEL_TYPE_SUCCESS(state, type) {
    state.hostelType.data = type;
    state.hostelType.isLoading = false;
    state.hostelType.success = true;
  },
  UPDATE_HOSTEL_TYPE_FAILURE(state, error) {
    state.hostelType.error = error;
    state.hostelType.isLoading = false;
    state.hostelType.success = false;
  },
  GET_HOSTEL_GROUP_SUCCESS(state, hostelGroup) {
    state.hostelGroup.data = hostelGroup;
    state.hostelGroup.isLoading = false;
    state.hostelGroup.success = true;
  },
  GET_HOSTEL_TYPE_FAILURE(state, error) {
    state.hostelType.isLoading = false;
    state.hostelType.error = error;
  },
  GET_HOSTEL_GROUP_FAILURE(state, error) {
    state.hostelGroup.isLoading = false;
    state.hostelGroup.error = error;
  },
  GET_SCHEDULES_REQUEST(state) {
    state.schedules.isLoading = true;
  },
  GET_SCHEDULES_SUCCESS(state, schedules) {
    state.schedules.data = schedules;
    state.schedules.isLoading = false;
    state.schedules.success = true;
  },
  GET_SCHEDULES_FAILURE(state, error) {
    state.schedules.isLoading = false;
    state.schedules.error = error;
  },

  GET_SUGGESTED_TYPE_REQUEST(state) {
    state.suggestedTypes.isLoading = true;
  },
  GET_SUGGESTED_TYPE_SUCCESS(state, data) {
    state.suggestedTypes.data = data;
    state.suggestedTypes.isLoading = false;
    state.suggestedTypes.success = true;
    state.suggestedTypes.error = null;
  },
  GET_SUGGESTED_TYPE_FAILURE(state, error) {
    state.suggestedTypes.error = error;
    state.suggestedTypes.data = null;
  },

  GET_FEEDBACK_REQUEST(state) {
    state.feedback.isLoading = true;
  },
  GET_FEEDBACK_SUCCESS(state, data) {
    state.feedback.data = data;
    state.feedback.isLoading = false;
    state.feedback.success = true;
    state.feedback.error = null;
  },
  GET_FEEDBACK_FAILURE(state, error) {
    state.feedback.error = error;
    state.feedback.data = null;
  },
  SET_FEEDBACKS_VALUES: (state, list) => {
    state.feedback.data = list;
  },
};

const actions = {
  async updateHostelType({ commit }, input) {
    try {
      commit(mutationTypes.UPDATE_HOSTEL_TYPE_REQUEST);
      const res = await window.axios.patch(`/api/v1/types/${input.typeId}`, input);
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.UPDATE_HOSTEL_TYPE_SUCCESS, res.data.data);
      } else {
        const e = new Error('Something went wrong when update Hostel type');
        commit(mutationTypes.UPDATE_HOSTEL_TYPE_FAILURE, e);
      }
    } catch (error) {
      commit(mutationTypes.UPDATE_HOSTEL_TYPE_FAILURE, error);
    }
  },
  async getTypeAndGroup({ commit }, typeId) {
    try {
      commit(mutationTypes.GET_HOSTEL_TYPE_REQUEST);
      commit(mutationTypes.GET_HOSTEL_GROUP_REQUEST);
      const response = await window.axios.get(`/api/v1/types?typeId=${typeId}`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_HOSTEL_TYPE_SUCCESS, response.data.data.type);
        commit(mutationTypes.GET_HOSTEL_GROUP_SUCCESS, response.data.data.group);
      } else {
        commit(mutationTypes.GET_HOSTEL_TYPE_FAILURE);
        commit(mutationTypes.GET_HOSTEL_GROUP_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_HOSTEL_TYPE_FAILURE, error);
      commit(mutationTypes.GET_HOSTEL_GROUP_FAILURE, error);
    }
  },
  async getSchedules({ commit }, groupId) {
    try {
      commit(mutationTypes.GET_SCHEDULES_REQUEST);
      const response = await window.axios.get(`/api/v1/groups/${groupId}/schedules`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_SCHEDULES_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_SCHEDULES_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_SCHEDULES_FAILURE, error);
    }
  },
  async getSuggestedTypes({ commit }, params) {
    try {
      commit(mutationTypes.GET_SUGGESTED_TYPE_REQUEST);
      let paramStr = '';
      if (params.universityId) {
        paramStr += `&schoolId=${params.universityId}`;
      }
      if (params.provinceId) {
        paramStr += `&provinceId=${params.provinceId}`;
      }
      const response = await window.axios.get(
        `/api/v1/types?asc=false${paramStr}&size=${params.size}`,
      );
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_SUGGESTED_TYPE_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_SUGGESTED_TYPE_FAILURE, response.status);
      }
    } catch (error) {
      commit(mutationTypes.GET_SCHEDULES_FAILURE, 500);
    }
  },
  async getFeedbacks({ commit }, typeId) {
    try {
      commit(mutationTypes.GET_FEEDBACK_REQUEST);
      const response = await window.axios.get(`/api/v1/types/${typeId}/feedbacks`);
      if (response.status >= 200 && response.status <= 299) {
        commit(mutationTypes.GET_FEEDBACK_SUCCESS, response.data.data);
      } else {
        commit(mutationTypes.GET_FEEDBACK_FAILURE);
      }
    } catch (error) {
      commit(mutationTypes.GET_FEEDBACK_FAILURE, error);
    }
  },
  setFeedbacks({ commit }, list) {
    commit(mutationTypes.SET_FEEDBACKS_VALUES, list);
  },
};

export default {
  namespaced: true,
  state: myState,
  mutations,
  getters,
  actions,
};
