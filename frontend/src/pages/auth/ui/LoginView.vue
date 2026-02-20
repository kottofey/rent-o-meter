<script setup lang="ts">
import {
  type FormInst,
  FormRules,
  NButton,
  NCard,
  NForm,
  NFormItem,
  NInput,
} from 'naive-ui';
import { ref } from 'vue';

import { ChangeThemeButton } from '@/shared/ui';
import { useAuth } from '@/features/auth';

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------

const formData = ref<{ email: string; password: string }>({
  email: '',
  password: '',
});
const formRef = ref<FormInst | null>(null);

const { login } = useAuth();
// -----------------------------------------------------------------------------
// Form setup
// -----------------------------------------------------------------------------

const rules: FormRules = {
  email: [
    {
      required: true,
      message: 'Введите логин',
    },
    {
      type: 'email',
      message: 'Неверный формат email',
    },
  ],
  password: {
    required: true,
    message: 'Введите пароль',
  },
};

const onSubmit = async () => {
  try {
    await formRef.value?.validate(async (errors) => {
      if (!errors) {
        await login({
          email: formData.value.email,
          password: formData.value.password,
        });
      }
    });
  } catch (e) {
    console.error('Ошибка валидации', JSON.stringify(e, null, 2));
  }
};
</script>

<template>
  <div class="wrapper">
    <NCard class="login-form">
      <template #header>
        <h1>Логин</h1>
      </template>

      <template #header-extra>
        <ChangeThemeButton />
      </template>

      <NForm
        :rules="rules"
        :model="formData"
        ref="formRef"
        @keydown.enter="
          async () => {
            await onSubmit();
          }
        "
      >
        <NFormItem
          label="Email"
          path="email"
        >
          <NInput v-model:value="formData.email" />
        </NFormItem>

        <NFormItem
          label="Пароль"
          path="password"
        >
          <NInput
            type="password"
            show-password-on="click"
            v-model:value="formData.password"
          />
        </NFormItem>
      </NForm>

      <template #action>
        <div class="wrapper wrapper--buttons">
          <NButton
            type="success"
            @click="
              async () => {
                await onSubmit();
              }
            "
            >Войти</NButton
          >
        </div>
      </template>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;

  &--buttons {
    width: 100%;
    height: 100%;
  }
}

.login-form {
  display: flex;
  width: 300px;
}
</style>
