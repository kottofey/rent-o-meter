<script setup lang="ts">
import { NButton } from 'naive-ui';

import { useTarifsQuery } from '@/entities/tarif';

const q = {
  status: false,
  counter_water: 999,
  counter_electricity: 9999,
  penalty: 10000,
  debt: 1000000,
  comment: 'nudthll',
};

const { data: tarifs } = useTarifsQuery({});
</script>

<template>
  <h1>Rentees</h1>
  <p>Calling ALL Tarif:</p>
  <pre>{{ tarifs }}</pre>
  <!--  <NButton @click="createRentee({ rentee: q })">+</NButton>-->
  <!--  <NButton @click="deleteRentee({ id: 2 })">-</NButton>-->
  <!--  <NButton @click="editPayMonth({ id: 21, updatedPayMonth: q })">edit</NButton>-->
</template>

<style scoped></style>
