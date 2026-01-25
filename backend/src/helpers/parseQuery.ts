import QueryString from 'qs';
import { Includeable, ScopeOptions } from 'sequelize';
import chalk from 'chalk';

import { Agreement, Counter, Rentee, Tarif, Bill } from '@/models';
import { ITarifTypes } from 'src/sequelize/models/Tarif.model.ts';

export default function parseQuery(query: QueryString.ParsedQs) {
  const scopes: ScopeOptions | ScopeOptions[] = [];
  const includes: Includeable[] = [];

  type ScopeHandler = (value: unknown) => ScopeOptions | ScopeOptions[] | undefined;

  // -----------------------------------------------------------------------------
  // Mapping Scopes
  // -----------------------------------------------------------------------------

  const SCOPE_HANDLERS: Record<string, ScopeHandler> = {
    // -----------------------------------------------------------------------------
    // Bills
    // -----------------------------------------------------------------------------
    'bills:isDebt': () => ({ method: ['bills:isDebt'] }),

    // -----------------------------------------------------------------------------
    // Counters
    // -----------------------------------------------------------------------------
    'counter:byPeriod': rawDates => {
      if (rawDates && typeof rawDates === 'object') {
        const dates = rawDates as { start: number; end: number };
        return { method: ['counter:byPeriod', { start: dates.start, end: dates.end }] };
      }
    },
    'counter:byMonth': rawMonth => {
      const month = rawMonth as number;
      return { method: ['counter:byMonth', month] };
    },
    'counter:byAgreementId': rawAgreementId => {
      const agreementId = rawAgreementId as number;
      return { method: ['counter:byAgreementId', agreementId] };
    },

    // -----------------------------------------------------------------------------
    // Rentees
    // -----------------------------------------------------------------------------
    'rentee:withActiveAgreement': () => ({ method: ['rentee:withActiveAgreement'] }),

    // -----------------------------------------------------------------------------
    // Tarifs
    // -----------------------------------------------------------------------------
    'tarif:actualOnDate': rawDate => {
      const date = rawDate as number;
      return { method: ['tarif:actualOnDate', date] };
    },
    'tarif:byType': rawType => {
      const tarif_type = rawType as ITarifTypes;
      return { method: ['tarif:byType', tarif_type] };
    },

    // -----------------------------------------------------------------------------
    // Agreements
    // -----------------------------------------------------------------------------
    'agreements:activeOnly': () => ({ method: ['agreements:activeOnly'] }),
    'agreements:isNotExpired': () => ({ method: ['agreements:isNotExpired'] }),
    'agreements:isExpired': () => ({ method: ['agreements:isExpired'] }),
    'agreements:isExpiredAndActive': () => ({ method: ['agreements:isExpiredAndActive'] }),
    'agreements:withDeleted': () => ({ method: ['agreements:withDeleted'] }),
    'agreements:byRentee': rawRenteeId => {
      const renteeId = rawRenteeId as number;
      return { method: ['agreements:byRentee', renteeId] };
    },
  } as const;

  // -----------------------------------------------------------------------------
  // Mapping Includes
  // -----------------------------------------------------------------------------
  const INCLUDE_HANDLERS = {
    Agreement: () => ({
      model: Agreement,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
    'Agreement.Rentee': () => ({
      model: Agreement,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
      include: {
        model: Rentee,
        attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
      },
    }),
    Bill: () => ({
      model: Bill,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
    Counter: () => ({
      model: Counter,
      attributes: { exclude: ['deletedAt', 'createdAt', 'updatedAt'] },
    }),
    Rentee: () => ({
      model: Rentee,
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
