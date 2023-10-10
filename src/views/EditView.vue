<template>
  <div class="edit-view">
    <v-form v-if="!loading" ref="form">
      <v-row>
        <v-col
            cols="12"
            md="5"
        >
          <v-text-field
              disabled
              v-model="formData.id"
              label="ID"
          ></v-text-field>

        </v-col>

        <v-col
            cols="12"
            md="5"
        >
          <v-text-field
              disabled
              v-model="formData.carID"
              label="CarID"
          ></v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="2"
        >
          <v-checkbox
              @input="isChanged = true"
              v-model="formData.inStock"
              label="Instock"
          ></v-checkbox>
        </v-col>
      </v-row>

      <v-row>
        <v-col
            cols="12"
            md="3"
        >
          <v-text-field
              @input="isChanged = true"
              v-model="formData.hp"
              :rules="hpRules"
              label="Horse Power"
              suffix="hp"
          ></v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="3"
        >
          <v-text-field
              @input="isChanged = true"
              v-model="formData.price"
              :rules="priceRules"
              label="Price"
              suffix="€"
          ></v-text-field>
        </v-col>

        <v-col
            cols="12"
            md="6"
        >
          <v-radio-group :inline="true" v-model="formData.color">
            <v-radio
                @input="isChanged = true"
                v-for="color in colors"
                :key="color.id"
                :value="color.value"
            >
              <template v-slot:label>
                <div> {{ color.value }}
                  <div :style="{ backgroundColor: color.value }" style="width: 50px; height: 15px;"></div>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <div class="d-flex flex-column">
        <v-row>
          <v-col
              cols="12"
              md="4"
          >
            <router-link to="/">
              <v-btn
                  color="error"
                  class="mt-4"
                  block
                  @click="submit"
              >
                Cancel
              </v-btn>
            </router-link>
          </v-col>

          <v-col
              cols="12"
              md="4"
          >
            <v-btn
                color="warning"
                class="mt-4"
                block
                @click="resetChanges"
            >
              Reset Changes
            </v-btn>
          </v-col>
          <v-col
              cols="12"
              md="4"
          >
            <v-btn
                :disabled="!isChanged"
                color="success"
                class="mt-4"
                block
                @click="submit"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-form>
    <v-progress-circular
        v-else
        indeterminate
        color="#212121"
    ></v-progress-circular>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';

const route = useRoute();
const router = useRouter();
const store = useStore();
const loading = ref(false);
const carData = computed(() => store.getters.getCarsList.find(car => car.id === route.params.id));
const colors = ref([]);
const formData = ref({
  id: null,
  carID: null,
  inStock: null,
  hp: null,
  price: null,
  color: [],
});
const isChanged = ref(false);

const hpRules = [
  (value) => !!value || 'HP is required',
  (value) => {
    const hp = parseInt(value, 10);
    if (!Number.isNaN(hp) && hp >= 100 && hp <= 550) {
      return true;
    }
    return 'HP must be between 100 and 550';
  },
];

const priceRules = [
  (value) => !!value || 'Price is required',
  (value) => {
    const price = parseInt(value, 10);
    if (!Number.isNaN(price) && Number.isInteger(price)) {
      return true;
    }
    return 'Price must be a valid integer';
  },
];

const submit = () => {
  axios
      .put(process.env.VUE_APP_API_URL + '/cars/' + route.params.id, formData.value)
      .then(() => {
        router.push('/');
      })
      .catch((error) => {
        console.error(error);
      });
};

const resetChanges = () => {
  formData.value.id = carData.value.id;
  formData.value.carID = carData.value.carID;
  formData.value.inStock = carData.value.inStock;
  formData.value.hp = carData.value.hp;
  formData.value.price = carData.value.price;
  formData.value.color = carData.value.color;
  isChanged.value = false;
};

const getCarData = async () => {
  loading.value = true;
  try {
    const {data} = await axios.get(process.env.VUE_APP_API_URL + '/cars/' + route.params.id);
    carData.value = data;
    formData.value.id = carData.value.id;
    formData.value.carID = carData.value.carID;
    formData.value.inStock = carData.value.inStock;
    formData.value.hp = carData.value.hp;
    formData.value.price = carData.value.price;
    formData.value.color = carData.value.color;
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
};

const getAllColors = async () => {
  try {
    const {data} = await axios.get(process.env.VUE_APP_API_URL + '/colors');
    colors.value = data;
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (store.getters.getCarsList.length === 0) {
    store.dispatch('fetchCarsList').then(() => {
      getCarData();
      getAllColors();
    });
  } else {
    getCarData();
    getAllColors();
  }
});
</script>
