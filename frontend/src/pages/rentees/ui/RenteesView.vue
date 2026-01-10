<script setup lang="ts">
import { NButton } from 'naive-ui';

import {
  useRenteesQuery,
  useDeleteRenteeMutation,
  useRestoreRenteeMutation,
  useCreateRenteeMutation,
} from '@/entities/rentee';

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

const { data: rentees } = useRenteesQuery();
const { mutate: deleteRentee } = useDeleteRenteeMutation();
const { mutate: createRentee } = useCreateRenteeMutation();
const { mutate: restoreRentee } = useRestoreRenteeMutation();
</script>

<template>
  <h1>Rentees</h1>
  <pre>{{ rentees }}</pre>
  <NButton @click="createRentee({ rentee: q })">+</NButton>
  <NButton @click="deleteRentee({ id: 2 })">-</NButton>
</template>

<style scoped></style>
