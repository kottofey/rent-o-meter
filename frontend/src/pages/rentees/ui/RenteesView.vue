<script setup lang="ts">
import { NButton } from 'naive-ui';

import { useAgreementsQuery } from '@/entities/agreement';

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

const { data: rentees } = useAgreementsQuery({ scopes: ['isDebt'] });
</script>

<template>
  <h1>Rentees</h1>
  <pre>{{ rentees }}</pre>
  <!--  <NButton @click="createRentee({ rentee: q })">+</NButton>-->
  <!--  <NButton @click="deleteRentee({ id: 2 })">-</NButton>-->
</template>

<style scoped></style>
