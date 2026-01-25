<script setup lang="ts">
import { NDataTable, NDatePicker } from 'naive-ui';
import { computed, ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';

import { columns } from '../config/tableColumns';

import { PageLayout } from '@/app/layouts';
import { ManageTarifModal } from '@/features/manage-tarif-modal';
import {
  type ITarif,
  useTarifsQuery,
  useTarifsQueryClient,
} from '@/entities/tarif';
import { AddButton } from '@/shared/ui';
import { SelectTarif } from '@/widgets/select-tarif';
import { dayjs } from '@/shared/lib/dayjs';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const tarifFilter = ref<ITarif['tarif_type'] | null>(null);
const actualOnDateFilter = ref(null);
const filteredTarifs = ref<ITarif[]>();

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------
const queryClient = useQueryClient();

const { data: tarifs, isLoading } = useTarifsQuery({
  scopes: {
    'tarif:actualOnDate': actualOnDateFilter.value
      ? dayjs(actualOnDateFilter.value).format('YYYY-MM-DD')
      : undefined,
    'tarif:byType': tarifFilter.value ?? undefined,
  },
});

const tarifToEditId = ref<number | undefined>(undefined);

const tarifToEdit = computed(() =>
  tarifs.value?.find((tarif) => tarif.id === tarifToEditId.value),
);

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------
watch([actualOnDateFilter, tarifFilter], async () => {
  filteredTarifs.value = await useTarifsQueryClient({
    client: queryClient,
    scopes: {
      'tarif:byType': tarifFilter.value ? tarifFilter.value : undefined,
      'tarif:actualOnDate': actualOnDateFilter.value
        ? dayjs(actualOnDateFilter.value).format('YYYY-MM-DD')
        : undefined,
    },
  });
});

watch([tarifs], () => {
  filteredTarifs.value = tarifs.value;
});

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

const editRow = (row: ITarif) => {
  return {
    onClick: () => {
      tarifToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  tarifToEditId.value = undefined;
  isModalOpened.value = true;
};
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <pre>{{ JSON.stringify(tarifFilter) }}</pre>
      <AddButton @click="createRow">Новый тариф</AddButton>
      <SelectTarif
        label="Фильтр по типу: "
        v-model:value="tarifFilter"
      />
      <div class="menu-block">
        <span>Актуальные на дату:</span>
        <NDatePicker
          placeholder="Выберите дату"
          v-model:value="actualOnDateFilter"
          clearable
          close-on-select
          format="dd MMMM yyyy"
        />
      </div>
    </template>
    <NDataTable
      :data="filteredTarifs"
      :columns="columns"
      :row-props="editRow"
      :loading="isLoading"
    />
  </PageLayout>

  <ManageTarifModal
    v-model:is-opened="isModalOpened"
    :tarif="tarifToEdit"
  />
</template>

<style scoped>
.menu-block {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  column-gap: 10px;
}
</style>
