import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    carsList: [],
  },
  mutations: {
    setCarsList(state, cars) {
      state.carsList = cars;
    },
  },
  actions: {
    async fetchCarsList({ commit }) {
      try {
        const { data } = await axios.get(process.env.VUE_APP_API_URL + '/cars');
        const filteredCars = data.filter(car => car.carID);
        commit('setCarsList', filteredCars);
      } catch (error) {
        console.error(error);
      }
    },
  },
  getters: {
    getCarsList: state => state.carsList,
  },
});
