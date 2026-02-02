import { useLocalStorage } from '@vueuse/core';

interface ISettings {
  theme: 'light' | 'dark';
  rentees: {
    deletedOnly?: boolean;
  };
  agreements: {
    withDeleted?: boolean;
    filter?: 'actual' | 'expired' | null;
  };
  counters: {
    actualOnDate?: number;
  };
  bills: {
    withExpiredAgreements?: boolean;
    renteeFilter?: number;
  };
  tarifs: {
    typeFilter?: string;
    actualOnDate?: number;
  };
}

export default function useSettings() {
  const settings = useLocalStorage<ISettings>(
    'rentometer-settings',
    {
      theme: 'light',
      rentees: {
        deletedOnly: false,
      },
      agreements: {
        withDeleted: false,
        filter: null,
      },
      counters: {
        actualOnDate: undefined,
      },
      bills: {
        withExpiredAgreements: false,
        renteeFilter: undefined,
      },
      tarifs: {
        typeFilter: undefined,
        actualOnDate: undefined,
      },
    },
    {
      deep: true,
    },
  );

  return { settings };
}
