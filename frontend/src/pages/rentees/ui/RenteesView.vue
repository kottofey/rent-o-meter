<script setup lang="ts">
import { computed, ref } from 'vue';
import { PageLayout } from '@/app/layouts';
import { AddButton } from '@/shared/ui';
import { useRenteesQuery } from '@/entities/rentee';
import { IRentee } from '@/entities/rentee/model/rentee-api';
import { ManageRenteeModal } from '@/features/manage-rentee-modal';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------


const rowProps = (row: IRentee) => {
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton @click="createRow">Новый арендатор</AddButton>
    </template>

    <NDataTable
      :data="rentees"
  </PageLayout>
</template>

<style scoped></style>
