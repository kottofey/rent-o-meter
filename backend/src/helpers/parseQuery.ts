import QueryString from 'qs';
import { Includeable, ScopeOptions } from 'sequelize';

import { Agreement, Counter, Rentee, Tarif } from '@/models';

export default function parseQuery(query: QueryString.ParsedQs) {
  const scopes: ScopeOptions | ScopeOptions[] = [];
  const includes: Includeable[] = [];

  type ScopeHandler = (value: unknown) => ScopeOptions | ScopeOptions[] | undefined;

  // -----------------------------------------------------------------------------
  // Mapping Scopes
  // -----------------------------------------------------------------------------

  const SCOPE_HANDLERS: Record<string, ScopeHandler> = {
    isDebt: () => ({ method: ['isDebt'] }),
    withRentees: () => ({ method: ['withRentees'] }),
    isActual: () => ({ method: ['isActual'] }),
    isActive: () => ({ method: ['isActive'] }),
    isExpired: () => ({ method: ['isExpired'] }),
    isExpiredAndActive: () => ({ method: ['isExpiredAndActive'] }),
    withActiveAgreementOnly: () => ({ method: ['withActiveAgreementOnly'] }),

    withPeriod: value => {
      if (value && typeof value === 'object') {
        const period = value as { start: number; end: number };
        return { method: ['withPeriod', { start: period.start, end: period.end }] };
      }
    },

    byAgreement: value => {
      const agreementId = value as number;
      return { method: ['byAgreement', { agreementId }] };
    },

    byRentee: value => {
      const agreementId = value as number;
      return { method: ['byRentee', { agreementId }] };
    },

    isDebtByAgreement: value => {
      const agreementId = value as number;
      return { method: ['isDebtByAgreement', { agreementId }] };
    },
  } as const;

  // -----------------------------------------------------------------------------
  // Mapping Includes
  // -----------------------------------------------------------------------------
  const INCLUDE_HANDLERS = {
    Rentee: () => ({
      model: Rentee,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
    Counter: () => ({
      model: Counter,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
    Agreement: () => ({
      model: Agreement,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
    Tarif: () => ({
      model: Tarif,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
  } as const;

  // -----------------------------------------------------------------------------
  // Scopes Handler
  // -----------------------------------------------------------------------------
  const scopesRaw = query.scopes;
  if (scopesRaw && typeof scopesRaw === 'object' && !Array.isArray(scopesRaw)) {
    for (const [key, handler] of Object.entries(SCOPE_HANDLERS)) {
      if (key in scopesRaw) {
        const result = handler(scopesRaw[key]);
        if (result) scopes.push(result as ScopeOptions);
      }
    }
  }
  if (scopesRaw && Array.isArray(scopesRaw)) {
    for (const [key, handler] of Object.entries(SCOPE_HANDLERS)) {
      if (scopesRaw.includes(key)) {
        const result = handler(key);
        if (result) scopes.push(result as ScopeOptions);
      }
    }
  }

  // -----------------------------------------------------------------------------
  // Includes Handler
  // -----------------------------------------------------------------------------

  function hasInclude(includes: unknown, target: string): boolean {
    return Array.isArray(includes) && includes.includes(target);
  }

  const includesRaw = query.includes;
  for (const key of Object.keys(INCLUDE_HANDLERS) as (keyof typeof INCLUDE_HANDLERS)[]) {
    if (hasInclude(includesRaw, key)) {
      includes.push(INCLUDE_HANDLERS[key]());
    }
  }

  return {
    scopes,
    includes,
  };
}
