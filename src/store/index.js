import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cities: [
      {
        name: 'new york',
        count: 3,
      },
      {
        name: 'washington',
        count: 3,
      },
      {
        name: 'london',
        count: 3,
      },
      {
        name: 'jacksonville',
        count: 3,
      },
      {
        name: 'sao paulo',
        count: 3,
      },
      {
        name: 'lagos',
        count: 3,
      },
      {
        name: 'tripoli',
        count: 3,
      },
      {
        name: 'istanbul',
        count: 3,
      },
      {
        name: 'cairo',
        count: 3,
      },
    ],
    shift: false,
  },
  getters: {
  },
  mutations: {
    addCity (state, city) {
      state.cities.push(city)
    },
    setShift (state, shift) {
      state.shift = shift
    },
  },
  actions: {
    addCity ({ commit }, city) {
      commit('addCity')
    },
    setShift ({ commit }, shift) {
      commit('setShift', shift)
    },
  },
  modules: {
  },
})
