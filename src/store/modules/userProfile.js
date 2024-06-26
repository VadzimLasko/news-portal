import userProfileApi from "@/api/userProfile.js";

const state = {
  data: null,
  isLoading: false,
  error: null,
};

export const mutationTypes = {
  getUserProfileStart: "[userProfile] Get userProfile start",
  getUserProfileSuccess: "[userProfile] Get userProfile success",
  getUserProfileFailure: "[userProfile] Get userProfile failure",
};

export const actionTypes = {
  getUserProfile: "[userProfile] Get userProfile",
};

const mutations = {
  [mutationTypes.getUserProfileStart](state) {
    state.isLoading = true;
    state.data = null;
  },
  [mutationTypes.getUserProfileSuccess](state, payload) {
    state.isLoading = false;
    state.data = payload;
  },
  [mutationTypes.getUserProfileFailure](state, payload) {
    state.isLoading = false;
    state.error = payload;
  },
};

const actions = {
  async [actionTypes.getUserProfile]({ commit }, { slug }) {
    try {
      commit(mutationTypes.getUserProfileStart);
      let userProfile = await userProfileApi.getUserProfile(slug);
      commit(mutationTypes.getUserProfileSuccess, userProfile);
      return userProfile;
    } catch (error) {
      commit(mutationTypes.getUserProfileFailure, error.response.data.errors);
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
