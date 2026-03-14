<script setup lang="ts">
import { h, reactive, ref, watch } from 'vue';
import { NDataTable } from 'naive-ui';

import { createColumns } from '../config/tableColumns';

import { notification } from '@/shared/lib';
import { PageLayout } from '@/app/layouts';
import { AddButton, AppButton } from '@/shared/ui';
import { type IUser, type IUserScopes, useUsersQuery } from '@/entities/user';
import { InfinitiIcon } from '@/shared/ui/icons';
import { useAuthStore } from '@/shared/store';
import { ManageUserModal } from '@/features/manage-user-modal';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const authStore = useAuthStore();

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const isModalOpened = ref(false);
const withDeleted = ref(false);
const userToEditId = ref<number | undefined>(undefined);
const userToEdit = ref();

const userScopes = reactive<IUserScopes>({
  'user:withDeleted': false,
});

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const {
  data: users,
  isLoading,
  isError,
  error,
} = useUsersQuery({
  scopes: userScopes,
});

const editRow = (row: IUser) => {
  return {
    onClick: () => {
      userToEditId.value = row.id;
      isModalOpened.value = true;
    },
  };
};

const createRow = () => {
  userToEditId.value = undefined;
  userToEdit.value = undefined;
  isModalOpened.value = true;
};

const setWithDeleted = () => {
  withDeleted.value = !withDeleted.value;
};

// -----------------------------------------------------------------------------
// Watch
// -----------------------------------------------------------------------------

watch(withDeleted, () => {
  userScopes['user:withDeleted'] = withDeleted.value;
});

watch([userToEditId, isModalOpened], () => {
  if (isModalOpened.value && userToEditId.value) {
    userToEdit.value = users.value?.find(
      (user) => user.id === userToEditId.value,
    );
  }
});

watch(isError, () => {
  if (isError.value) {
    notification.error({
      content: error.value?.message,
      closable: true,
      duration: 3000,
    });
  }
});
</script>

<template>
  <PageLayout>
    <template #buttons-extra>
      <AddButton
        @click="createRow"
        v-if="authStore.user?.roles?.includes('admin')"
      >
        Новый пользователь
      </AddButton>

      <AppButton
        @click="setWithDeleted"
        :is-outlined="withDeleted"
      >
        <template #default>Удаленные</template>
        <template #icon><InfinitiIcon /></template>
      </AppButton>
    </template>

    <NDataTable
      :data="users"
      :columns="createColumns({ hFunc: h })"
      :row-props="editRow"
      :loading="isLoading"
      :single-line="false"
    />
  </PageLayout>

  <ManageUserModal
    v-model:is-opened="isModalOpened"
    :user="userToEdit"
  />
</template>
