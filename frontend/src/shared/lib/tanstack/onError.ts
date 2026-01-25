import { CustomError } from '@/shared/api/Http/error';

export const getErrorMessage = ({ error }: { error: Error }) => {
  let message = 'Произошла неизвестная ошибка';

  if (error instanceof CustomError) {
    // Пробуем взять message из data
    if (
      typeof error.parentError === 'object' &&
      error.parentError &&
      'message' in error.parentError
    ) {
      message = String(error.parentError.message);
    } else {
      message = error.message;
    }
  } else {
    message = error.message;
  }

  return message;
};
