import QueryString from 'qs';
import { Includeable, ScopeOptions } from 'sequelize';

import { Agreement, Counter, Rentee, Tarif, Bill, Payment, RefreshToken } from '@/models';
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
    'bills:byRentee': rawRenteeId => {
      const renteeId = rawRenteeId as number | null;
      return { method: ['bills:byRentee', renteeId] };
    },

    // -----------------------------------------------------------------------------
    // Counters
    // -----------------------------------------------------------------------------
    'counters:byPeriod': rawDates => {
      if (rawDates && typeof rawDates === 'object') {
        const dates = rawDates as { start: number; end: number };
        return { method: ['counter:byPeriod', { start: dates.start, end: dates.end }] };
      }
    },
    'counters:byMonth': rawMonth => {
      const month = rawMonth as number;
      return { method: ['counters:byMonth', month] };
    },
    'counters:byAgreementId': rawAgreementId => {
      const agreementId = rawAgreementId as number;
      return { method: ['counters:byAgreementId', agreementId] };
    },
    'counters:byRentee': rawRenteeId => {
      const renteeId = rawRenteeId as number | null;
      return { method: ['counters:byRentee', renteeId] };
    },

    // -----------------------------------------------------------------------------
    // Rentees
    // -----------------------------------------------------------------------------
    'rentees:withActiveAgreement': () => ({ method: ['rentees:withActiveAgreement'] }),
    'rentees:withDeleted': () => ({ method: ['rentees:withDeleted'] }),
    'rentees:byId': id => ({ method: ['rentees:byId', id] }),

    // -----------------------------------------------------------------------------
    // Tarifs
    // -----------------------------------------------------------------------------
    'tarifs:actualOnDate': rawDate => {
      const date = rawDate as number;
      return { method: ['tarifs:actualOnDate', date] };
    },
    'tarifs:actualBetween': rawDates => {
      const { dateStart, dateEnd } = rawDates as { dateStart: number; dateEnd: number };
      return { method: ['tarifs:actualBetween', { dateStart, dateEnd }] };
    },
    'tarifs:byType': rawType => {
      const tarif_type = rawType as ITarifTypes;
      return { method: ['tarifs:byType', tarif_type] };
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
      const renteeId = rawRenteeId as number | null;
      return { method: ['agreements:byRentee', renteeId] };
    },

    // -----------------------------------------------------------------------------
    // Users
    // -----------------------------------------------------------------------------
    'users:withDeleted': () => ({ method: ['users:withDeleted'] }),

    // -----------------------------------------------------------------------------
    // Payments
    // -----------------------------------------------------------------------------
    'payments:byBill': rawBillId => {
      const billId = rawBillId as number | null;
      return { method: ['payments:byBill', billId] };
    },
    'payments:byRentee': rawRenteeId => {
      const renteeId = rawRenteeId as number | null;
      return { method: ['payments:byRentee', renteeId] };
    },
  } as const;

  // -----------------------------------------------------------------------------
  // Mapping Includes
  // -----------------------------------------------------------------------------
  const INCLUDE_HANDLERS = {
    Agreement: () => ({
      model: Agreement,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    'Agreement.Rentee': () => ({
      model: Agreement,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Rentee,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    }),
    Bill: () => ({
      model: Bill,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    'Bill.Agreement': () => ({
      model: Bill,
      include: {
        model: Agreement,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    'Bill.Payment': () => ({
      model: Bill,
      include: {
        model: Payment,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    'Bill.Agreement.Rentee': () => ({
      model: Bill,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Agreement,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: Rentee,
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      },
    }),
    Counter: () => ({
      model: Counter,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    Rentee: () => ({
      model: Rentee,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    Tarif: () => ({
      model: Tarif,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    Payment: () => ({
      model: Payment,
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }),
    RefreshToken: () => ({
      model: RefreshToken,
      require: false,
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
