const myState = () => ({
  groups: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
    isCreating: false,
    isUpdating: false,
  },
  types: {
    data: [],
    isLoading: false,
    isUpdating: false,
    isCreating: false,
    success: null,
    error: null,
  },
  rooms: {
    data: [],
    isLoading: false,
    success: null,
    error: null,
  },
  schedules: {
    data: {},
    isLoading: false,
    success: null,
    error: null,
  },
  newGroup: {
    services: [],
    statePrice: [],
    newServices: [],
    avatar: null,
    regulations: [],
    newRegulations: [],
    groupName: '',
    categoryId: null,
    ownerJoin: false,
    curfewTime: {
      limit: false,
      startTime: '',
      endTime: '',
    },
    managerName: null,
    managerPhone: null,
    downPayment: 0,
    buildingNo: '',
    latitude: 0,
    longitude: 0,
    address: null,
    schedules: [],
    appendixContract: null,
    types: [],
    errorHostelRoom: [],
  },
  newType: {},
  newRoom: {
    data: {
      typeId: null,
      roomName: null,
      available: true,
    },
    isLoading: false,
    success: null,
    error: null,
  },
  creatRooms: {
    rooms: [],
    isCreating: false,
    error: null,
    success: null,
  },
  createType: {
    data: {
      title: '',
      price: '',
      priceUnit: 'triệu',
      superficiality: '',
      deposit: 1,
      capacity: '',
      rooms: [],
      image: [],
      facilityIds: [],
      newFacilities: [],
      error: [],
    },
  },
});

const myGetters = {
  findGroupById: (state) => (id) => {
    const result = state.groups.data.filter((group) => group.groupId === id);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  },
  findTypesById: (state) => (id) => {
    const result = state.types.data.filter((type) => type.typeId === id);
    if (result.length > 0) {
      return result[0];
    }
    return null;
  },
  findRoomsById: (state) => (id) => {
    const result = state.rooms.data.find((room) => room.roomId === id);
    return result;
  },
};
const mutationTypes = {
  SET_NEW_GROUP_VALUE: 'SET_NEW_GROUP_VALUE',
  SET_CREATE_TYPE_VALUE: 'SET_CREATE_TYPE_VALUE',
  SET_NEW_ROOM_VALUE: 'SET_NEW_ROOM_VALUE',
  SET_CREAT_ROOMS_VALUE: 'SET_CREAT_ROOMS_VALUE',
  GET_GROUPS_REQUEST: 'GET_GROUPS_REQUEST',
  GET_GROUPS_SUCCESS: 'GET_GROUPS_SUCCESS',
  GET_GROUPS_FAILURE: 'GET_GROUPS_FAILURE',

  CREATE_HOSTEL_GROUP_REQUEST: 'CREATE_HOSTEL_GROUP_REQUEST',
  CREATE_HOSTEL_GROUP_SUCCESS: 'CREATE_HOSTEL_GROUP_SUCCESS',
  CREATE_HOSTEL_GROUP_FAILURE: 'CREATE_HOSTEL_GROUP_FAILURE',

  UPDATE_HOSTEL_GROUP_REQUEST: 'UPDATE_HOSTEL_GROUP_REQUEST',
  UPDATE_HOSTEL_GROUP_SUCCESS: 'UPDATE_HOSTEL_GROUP_SUCCESS',
  UPDATE_HOSTEL_GROUP_FAILURE: 'UPDATE_HOSTEL_GROUP_FAILURE',

  GET_TYPES_REQUEST: 'GET_TYPES_REQUEST',
  GET_TYPES_SUCCESS: 'GET_TYPES_SUCCESS',
  GET_TYPES_FAILURE: 'GET_TYPES_FAILURE',

  CREATE_HOSTEL_TYPE_REQUEST: 'CREATE_HOSTEL_TYPE_REQUEST',
  CREATE_HOSTEL_TYPE_SUCCESS: 'CREATE_HOSTEL_TYPE_SUCCESS',
  CREATE_HOSTEL_TYPE_FAILURE: 'CREATE_HOSTEL_TYPE_FAILURE',

  CREATE_LIST_HOSTEL_TYPE_REQUEST: 'CREATE_LIST_HOSTEL_TYPE_REQUEST',
  CREATE_LIST_HOSTEL_TYPE_SUCCESS: 'CREATE_LIST_HOSTEL_TYPE_SUCCESS',
  CREATE_LIST_HOSTEL_TYPE_FAILURE: 'CREATE_LIST_HOSTEL_TYPE_FAILURE',

  UPDATE_HOSTEL_TYPE_REQUEST: 'UPDATE_HOSTEL_TYPE_REQUEST',
  UPDATE_HOSTEL_TYPE_SUCCESS: 'UPDATE_HOSTEL_TYPE_SUCCESS',
  UPDATE_HOSTEL_TYPE_FAILURE: 'UPDATE_HOSTEL_TYPE_FAILURE',

  GET_ROOMS_REQUEST: 'GET_ROOMS_REQUEST',
  GET_ROOMS_SUCCESS: 'GET_ROOMS_SUCCESS',
  GET_ROOMS_FAILURE: 'GET_ROOMS_FAILURE',

  GET_GROUP_SCHEDULES_REQUEST: 'GET_GROUP_SCHEDULES_REQUEST',
  GET_GROUP_SCHEDULES_SUCCESS: 'GET_GROUP_SCHEDULES_SUCCESS',
  GET_GROUP_SCHEDULES_FAILURE: 'GET_GROUP_SCHEDULES_FAILURE',

  CREATE_ROOMS_REQUEST: 'CREATE_ROOMS_REQUEST',
  CREATE_ROOMS_SUCCESS: 'CREATE_ROOMS_SUCCESS',
  CREATE_ROOMS_FAILURE: 'CREATE_ROOMS_FAILURE',
};
const mutations = {
  SET_NEW_GROUP_VALUE: (state, newGroup) => {
    state.newGroup = newGroup;
  },
  SET_CREATE_TYPE_VALUE: (state, type) => {
    state.createType.data = type;
  },
  SET_NEW_ROOM_VALUE: (state, newType) => {
    state.newRoom.data = newType;
  },
  SET_CREAT_ROOMS_VALUE: (state, rooms) => {
    state.creatRooms.rooms = rooms;
  },
  GET_GROUPS_REQUEST(state) {
    state.groups.isLoading = true;
  },
  GET_TYPES_REQUEST(state) {
    state.types.isLoading = true;
  },
  GET_ROOMS_REQUEST(state) {
    state.rooms.isLoading = true;
  },
  GET_GROUPS_SUCCESS(state, groups) {
    state.groups.data = groups;
    state.groups.isLoading = false;
    state.groups.success = true;
  },
  GET_TYPES_SUCCESS(state, types) {
    state.types.data = types;
    state.types.isLoading = false;
    state.types.success = true;
  },
  GET_ROOMS_SUCCESS(state, rooms) {
    state.rooms.data = rooms;
    state.rooms.isLoading = false;
    state.rooms.success = true;
  },
  GET_GROUPS_FAILURE(state, error) {
    state.groups.isLoading = false;
    state.groups.success = false;
    state.groups.error = error;
  },
  GET_TYPES_FAILURE(state, error) {
    state.types.isLoading = false;
    state.types.success = false;
    state.types.error = error;
  },
  GET_ROOMS_FAILURE(state, error) {
    state.rooms.isLoading = false;
    state.rooms.success = false;
    state.types.error = error;
  },
  GET_GROUP_SCHEDULES_REQUEST(state) {
    state.schedules.isLoading = true;
  },
  GET_GROUP_SCHEDULES_SUCCESS(state, schedules, hostelGroupId) {
    state.schedules.isLoading = false;
    state.schedules.success = true;
    state.schedules.data[hostelGroupId] = schedules;
  },
  GET_GROUP_SCHEDULES_FAILURE(state, error) {
    state.schedules.isLoading = false;
    state.schedules.error = error;
    state.schedules.success = false;
  },

  CREATE_HOSTEL_GROUP_REQUEST: (state) => {
    state.groups.isCreating = true;
    state.groups.success = false;
    state.groups.error = null;
  },
  CREATE_HOSTEL_GROUP_SUCCESS: (state, createdNewGroup) => {
    state.groups.isCreating = false;
    const newGroup = {
      address: createdNewGroup[0].address,
      appendixContract: createdNewGroup[0].appendixContract,
      buildingNo: createdNewGroup[0].buildingNo,
      category: createdNewGroup[0].category,
      curfewTime: createdNewGroup[0].curfewTime,
      downPayment: createdNewGroup[0].downPayment,
      groupId: createdNewGroup[0].groupId,
      groupName: createdNewGroup[0].groupName,
      imgUrl: createdNewGroup[0].imgUrl,
      latitude: createdNewGroup[0].latitude,
      longitude: createdNewGroup[0].longitude,
      managerName: createdNewGroup[0].managerName,
      managerPhone: createdNewGroup[0].managerPhone,
      ownerJoin: createdNewGroup[0].ownerJoin,
      regulations: createdNewGroup[0].regulations,
      schedules: createdNewGroup[0].schedules,
      services: createdNewGroup[0].services,
      types: [],
      vendorId: createdNewGroup.vendorId,
    };
    state.groups.data.unshift(newGroup);
    state.groups.success = true;
  },
  CREATE_HOSTEL_GROUP_FAILURE: (state, error) => {
    state.groups.isCreating = false;
    state.groups.error = error;
  },

  CREATE_LIST_HOSTEL_TYPE_REQUEST: (state) => {
    state.types.isCreating = true;
    state.types.success = false;
    state.types.error = null;
  },
  CREATE_LIST_HOSTEL_TYPE_SUCCESS: (state, createdNewType) => {
    state.types.isCreating = false;
    console.log(createdNewType);
    const { groups } = state;
    const { groupId } = createdNewType[0];
    console.log(groups, createdNewType, groupId);
    const indexOfGroup = groups.data.findIndex((group) => group.groupId === groupId);
    console.log(indexOfGroup);
    console.log(state.groups.data[indexOfGroup].types);
    createdNewType.forEach((item) => {
      state.groups.data[indexOfGroup].types.unshift(item);
    });
    state.types.isCreating = false;
    state.types.success = true;
    state.types.success = true;
  },
  CREATE_LIST_HOSTEL_TYPE_FAILURE: (state, error) => {
    state.types.isCreating = false;
    state.types.error = error;
  },

  UPDATE_HOSTEL_GROUP_REQUEST: (state) => {
    state.groups.isUpdating = true;
    state.groups.success = null;
    state.groups.error = null;
  },
  UPDATE_HOSTEL_GROUP_SUCCESS: (state, updateGroup) => {
    state.groups.isUpdating = false;
    state.groups.data = updateGroup;
    state.groups.success = true;
  },
  UPDATE_HOSTEL_GROUP_FAILURE: (state, error) => {
    state.groups.isUpdating = false;
    state.groups.success = false;
    state.groups.error = error;
  },

  CREATE_HOSTEL_TYPE_REQUEST: (state) => {
    state.types.isCreating = true;
    state.types.success = false;
    state.types.error = null;
  },
  CREATE_HOSTEL_TYPE_SUCCESS: (state, createdNewType) => {
    console.log(createdNewType);
    const { groups } = state;
    const { groupId } = createdNewType[0];
    console.log(groups, createdNewType, groupId);
    const indexOfGroup = groups.data.findIndex((group) => group.groupId === groupId);
    console.log(indexOfGroup);
    console.log(state.groups.data[indexOfGroup].types);
    state.groups.data[indexOfGroup].types.unshift(createdNewType[0]);
    // state.types.data.unshift(createdNewType);
    state.types.isCreating = false;
    state.types.success = true;
  },
  CREATE_HOSTEL_TYPE_FAILURE: (state, error) => {
    state.types.isCreating = false;
    state.types.error = error;
  },

  CREATE_ROOMS_REQUEST: (state) => {
    state.creatRooms.isCreating = true;
    state.creatRooms.success = false;
    state.creatRooms.error = null;
  },
  CREATE_ROOMS_SUCCESS: (state, createdRooms) => {
    state.creatRooms.isCreating = false;
    const { groups } = state;
    const { rooms, typeId, groupId } = createdRooms;
    console.log(groups);
    const indexOfGroup = groups.data.findIndex((group) => group.groupId === groupId);
    const indexOfType = groups.data[indexOfGroup].types.findIndex((type) => type.typeId === typeId);
    console.log(rooms, typeId, groupId);
    console.log(indexOfGroup, indexOfType);
    rooms.forEach((room) => {
      console.log(groups.data[indexOfGroup].types);
      state.groups.data[indexOfGroup].types[indexOfType].rooms.push(room);
    });
    console.log(state.groups.data);
    state.creatRooms.success = true;
  },
  CREATE_ROOMS_FAILURE: (state, error) => {
    state.creatRooms.isCreating = false;
    state.creatRooms.success = false;
    state.creatRooms.error = error;
  },
};

const actions = {
  setNewGroupValue({ commit }, newGroup) {
    commit(mutationTypes.SET_NEW_GROUP_VALUE, newGroup);
  },
  setCreateTypeValue({ commit }, type) {
    commit(mutationTypes.SET_CREATE_TYPE_VALUE, type);
  },
  setNewRoom({ commit }, newRoom) {
    commit(mutationTypes.SET_NEW_ROOM_VALUE, newRoom);
  },
  setCreatRooms({ commit }, rooms) {
    commit(mutationTypes.SET_CREAT_ROOMS_VALUE, rooms);
  },
  async getGroups({ commit }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role === 'vendors') {
      commit(mutationTypes.GET_GROUPS_REQUEST);
      try {
        const res = await window.axios.get(`/api/v1/vendors/${userId}/groups`);
        // commit(mutationTypes.GET_GROUPS_SUCCESS, res.data.data);
        commit(mutationTypes.GET_GROUPS_SUCCESS, res.data.data);
      } catch (error) {
        commit(mutationTypes.GET_GROUPS_FAILURE, error);
      }
    } else {
      throw new Error('cookies userId and role are null');
    }
  },
  async getTypes({ commit, state, getters }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role === 'vendors' && state.groups.data) {
      commit(mutationTypes.GET_TYPES_REQUEST);
      try {
        const groupIds = state.groups.data.map((group) => group.groupId);
        let types = [];
        await Promise.all(
          groupIds.map(async (groupId) => {
            const res = await window.axios.get(`/api/v1/groups/${groupId}/types`);
            types = [...types, ...res.data.data];
            const group = getters.findGroupById(groupId);
            group.types = res.data.data;
          }),
        );
        commit(mutationTypes.GET_TYPES_SUCCESS, types);
      } catch (error) {
        commit(mutationTypes.GET_TYPES_FAILURE, error);
      }
    } else {
      throw new Error('cookies userId and role are null');
    }
  },
  async getRooms({ commit, state, getters }) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role === 'vendors' && state.types.data) {
      commit(mutationTypes.GET_ROOMS_REQUEST);
      try {
        const typeIds = state.types.data.map((type) => type.typeId);
        let rooms = [];
        await Promise.all(
          typeIds.map(async (typeId) => {
            const res = await window.axios.get(`/api/v1/types/${typeId}/rooms`);
            rooms = [...rooms, ...res.data.data];
            const type = getters.findTypesById(typeId);
            type.rooms = res.data.data;
          }),
        );
        commit(mutationTypes.GET_ROOMS_SUCCESS, rooms);
      } catch (error) {
        commit(mutationTypes.GET_ROOMS_FAILURE, error);
      }
    } else {
      throw new Error('cookies userId and role are null');
    }
  },
  async getSchedules({ commit, state }, hostelGroupId) {
    const currentSchedules = state.schedules[hostelGroupId];
    if (!currentSchedules) {
      try {
        commit(mutationTypes.GET_GROUP_SCHEDULES_REQUEST);
        const res = await window.axios.get(`/api/v1/groups/${hostelGroupId}/schedules`);
        if (res.status === 200) {
          commit(mutationTypes.GET_GROUP_SCHEDULES_SUCCESS, res.data.data);
        } else {
          commit(mutationTypes.GET_GROUP_SCHEDULES_FAILURE);
        }
      } catch (error) {
        commit(mutationTypes.GET_GROUP_SCHEDULES_FAILURE, error);
      }
    }
  },
  async createHostelGroup({ commit }, newGroup) {
    try {
      commit(mutationTypes.CREATE_HOSTEL_GROUP_REQUEST);
      const res = await window.axios.post('/api/v1/groups', [newGroup]);
      console.log(res.status);
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.CREATE_HOSTEL_GROUP_SUCCESS, res.data.data);
      } else {
        commit(mutationTypes.CREATE_HOSTEL_GROUP_FAILURE, res.status);
      }
    } catch (error) {
      commit(mutationTypes.CREATE_HOSTEL_GROUP_FAILURE, error);
    }
  },
  async updateHostelGroup({ commit }, group) {
    try {
      commit(mutationTypes.UPDATE_HOSTEL_GROUP_REQUEST);
      const { groupId } = group;
      if (group) {
        const res = await window.axios.put(`/api/v1/groups/${groupId}`, {
          groupId,
          curfewTime: group.curfewTime,
          downPayment: group.downPayment,
          groupName: group.groupName,
          imgUrl: group.imgUrl,
          managerName: group.managerName,
          managerPhone: group.managerPhone,
          ownerJoin: group.ownerJoin,
        });
        if (res.status === 200) {
          commit(mutationTypes.UPDATE_HOSTEL_GROUP_SUCCESS, res.data.data);
        } else {
          const error = new Error('Update fail');
          commit(mutationTypes.UPDATE_HOSTEL_GROUP_FAILURE, error);
        }
      }
    } catch (error) {
      commit(mutationTypes.CREATE_HOSTEL_GROUP_FAILURE, error);
    }
  },
  async createHostelType({ commit }, newType) {
    console.log(newType);
    try {
      commit(mutationTypes.CREATE_HOSTEL_TYPE_REQUEST);
      const { groupId } = newType;
      const res = await window.axios.post(`/api/v1/groups/${groupId}/types`, [newType]);
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.CREATE_HOSTEL_TYPE_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.CREATE_HOSTEL_TYPE_FAILURE, error);
    }
  },

  async createListHostelType({ commit }, types) {
    console.log(types);
    try {
      commit(mutationTypes.CREATE_LIST_HOSTEL_TYPE_REQUEST);
      const { groupID, list } = types;
      const res = await window.axios.post(`/api/v1/groups/${groupID}/types`, list);
      if (res.status >= 200 && res.status <= 299) {
        commit(mutationTypes.CREATE_LIST_HOSTEL_TYPE_SUCCESS, res.data.data);
      }
    } catch (error) {
      commit(mutationTypes.CREATE_ROOMS_FAILURE, error);
    }
  },
  async getTypesByGroupId({ commit }, groupId) {
    const userId = window.$cookies.get('userId');
    const role = window.$cookies.get('role');
    if (userId && role === 'vendors') {
      commit(mutationTypes.GET_TYPES_REQUEST);
      try {
        const response = await window.axios.get(`/api/v1/groups/${groupId}/types`);
        if (response.status >= 200 && response.status <= 299) {
          commit(mutationTypes.GET_TYPES_SUCCESS, response.data.data.type);
          commit(mutationTypes.GET_HOSTEL_GROUP_SUCCESS, response.data.data.group);
        } else {
          commit(mutationTypes.GET_HOSTEL_TYPE_FAILURE);
          commit(mutationTypes.GET_HOSTEL_GROUP_FAILURE);
        }
        // await Promise.all(
        //   groupIds.map(async (groupId) => {
        //     const res = await window.axios.get(`/api/v1/groups/${groupId}/types`);
        //     types = [...types, ...res.data.data];
        //     const group = getters.findGroupById(groupId);
        //     group.types = res.data.data;
        //   }),
        // );
      } catch (error) {
        commit(mutationTypes.GET_TYPES_FAILURE, error);
      }
    } else {
      throw new Error('cookies userId and role are null');
    }
  },
  async createRooms({ commit }, reqObj) {
    try {
      const { rooms, typeId, groupId } = reqObj;
      console.log(rooms);
      commit(mutationTypes.CREATE_ROOMS_REQUEST);
      const res = await window.axios.post(`/api/v1/types/${typeId}/rooms`, rooms);
      if (res.status >= 200 && res.status <= 299) {
        const resObj = {
          rooms,
          typeId,
          groupId,
        };
        commit(mutationTypes.CREATE_ROOMS_SUCCESS, resObj);
      } else {
        commit(mutationTypes.CREATE_ROOMS_FAILURE, 'error');
      }
    } catch (error) {
      commit(mutationTypes.CREATE_ROOMS_FAILURE, error);
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
