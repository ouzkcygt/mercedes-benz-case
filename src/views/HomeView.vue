<template>
  <div class="home-view">
    <v-table v-if="carsList.length" theme="dark">
      <thead>
      <tr>
        <th
            :style="{ textAlign: item.align }"
            v-for="item in headers"
            :key="item.name"
        >
          {{ item.title }}
        </th>
      </tr>
      </thead>
      <tbody>
        <tr
            v-for="item in carsList"
            :key="item.name"
        >
          <td>{{ item.id }}</td>
          <td>{{ item.carID }}</td>
          <td class="text-center">
            <span v-if="item.inStock">✅</span>
            <span v-else>❌</span>
          </td>
          <td>{{ item.hp }} hp</td>
          <td>{{ item.price }} €</td>
          <td>
            {{ item.color }}
            <div :style="{ backgroundColor: item.color }" style="width: 100%; height: 15px;"></div>
          </td>
          <td>
            <router-link class="edit-link" :to="`/edit/${item.id}`">
              <v-btn
                  class="w-100"
                  color="#0078d6"
              >
                Edit
                <img class="ml-2" width="16" src="../assets/images/edit.svg" alt="">
              </v-btn>
            </router-link>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-progress-circular
        v-else
        indeterminate
        color="#212121"
    ></v-progress-circular>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const carsList = ref([]);
const headers = [
  { title: 'ID', align: 'left' },
  { title: 'CARID', align: 'left' },
  { title: 'INSTOCK', align: 'center' },
  { title: 'HORSE POWER', align: 'left' },
  { title: 'Price', align: 'left' },
  { title: 'Color', align: 'left' },
  { title: '' },
];

onMounted(async () => {
  await store.dispatch('fetchCarsList');
  carsList.value = store.getters.getCarsList;
});
</script>

