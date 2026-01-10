<script setup lang="ts">
import { NButton } from 'naive-ui';

import { usePayMonthsQuery } from '@/entities/payMonth';

const q = {
  date_start: 1735678800000,
  date_end: 1765054800000,
  surname: 'aaa',
  firstname: 'sss',
  patronymic: 'ddd',
  comment: 'dasdasd',
  status: true,
  phone: '123456',
  email: 'iasdgiaduyfg@!asdgiua',
};

const { data: agreements } = usePayMonthsQuery({
  scopes: {
    withPeriod: {
      start: '2025-11-01',
      end: '2025-12-01',
    },
    byAgreement: 1,
  },
});
</script>

<template>
  <h1>Rentees</h1>
  <p>Calling ALL PAYMONTHS:</p>
  <pre>{{ agreements }}</pre>
  <!--  <NButton @click="createRentee({ rentee: q })">+</NButton>-->
  <!--  <NButton @click="deleteRentee({ id: 2 })">-</NButton>-->
</template>

<style scoped></style>
