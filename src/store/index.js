import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cities: [
      {
        name: '* hollow men *',
        count: 4,
        highlight: false,
      },
      {
        name: 'new york',
        count: 3,
        highlight: false,
      },
      {
        name: 'washington',
        count: 3,
        highlight: false,
      },
      {
        name: 'london',
        count: 3,
        highlight: false,
      },
      {
        name: 'jacksonville',
        count: 3,
        highlight: false,
      },
      {
        name: 'sao paulo',
        count: 3,
        highlight: false,
      },
      {
        name: 'lagos',
        count: 3,
        highlight: false,
      },
      {
        name: 'tripoli',
        count: 3,
        highlight: false,
      },
      {
        name: 'istanbul',
        count: 3,
        highlight: false,
      },
      {
        name: 'cairo',
        count: 3,
        highlight: false,
      },
    ],
    shift: false,
    godMode: false,
  },
  getters: {
    getCityByName: state => cityName => {
      return state.cities.find(c => c.name === cityName)
    },
    cities (state) {
      return state.cities.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        } else if (a.name > b.name) {
          return 1
        } else {
          return 0
        }
      })
    },
  },
  mutations: {
    setCities (state, cities) {
      state.cities = cities
    },
    addCity (state, city) {
      state.cities.push(city)
    },
    removeCity (state, cityName) {
      const idx = state.cities.findIndex(c => c.name === cityName)
      state.cities.splice(idx, 1)
    },
    changeCityCount (state, { cityName, count }) {
      const city = state.cities.find(c => c.name === cityName)
      city.count = city.count + count
    },
    setShift (state, shift) {
      state.shift = shift
    },
    setHighlight (state, { cityName, highlight }) {
      const city = state.cities.find(c => c.name === cityName)
      city.highlight = highlight
    },
    toggleGodMode (state) {
      state.godMode = !state.godMode
    },
  },
  actions: {
    setCities ({ commit }, cities) {
      commit('setCities', cities)
    },
    addCity ({ commit }, city) {
      commit('addCity', city)
    },
    removeCity ({ commit }, cityName) {
      commit('removeCity', cityName)
    },
    changeCityCount ({ commit }, { cityName, count }) {
      commit('changeCityCount', { cityName, count })
    },
    setShift ({ commit }, shift) {
      commit('setShift', shift)
    },
    setHighlight ({ commit }, { cityName, highlight }) {
      commit('setHighlight', { cityName, highlight })
    },
    toggleGodMode ({ commit }) {
      commit('toggleGodMode')
    },
  },
  modules: {
  },
})
