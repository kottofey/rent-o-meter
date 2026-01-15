import QueryString from 'qs';
import { Agreement, Counter, Rentee, Tarif } from '@/models';
import { Includeable, ScopeOptions } from 'sequelize';
import chalk from 'chalk';

export default function parseQuery(query: QueryString.ParsedQs) {
  const scopes: ScopeOptions | ScopeOptions[] = [];
  const includes: Includeable | Includeable[] = [];

  // -----------------------------------------------------------------------------
  // Includes
  // -----------------------------------------------------------------------------

  if (Object(query).includes?.includes('Rentee')) {
    includes.push({
      model: Rentee,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    });
  }

  if (Object(query).includes?.includes('Counter')) {
    includes.push({
      model: Counter,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    });
  }

  if (Object(query).includes?.includes('Agreement')) {
    includes.push({
      model: Agreement,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    });
  }

  if (Object(query).includes?.includes('Tarif')) {
    includes.push({
      model: Tarif,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt'],
      },
    });
  }

  // -----------------------------------------------------------------------------
  // Scopes
  // -----------------------------------------------------------------------------
  if (Object(query).scopes instanceof Array) {
    // -----------------------------------------------------------------------------
    // Скоупы без параметров
    // -----------------------------------------------------------------------------

    if (Object(query).scopes?.includes('isDebt')) {
      scopes.push({ method: ['isDebt'] });
    }

    if (Object(query).scopes?.includes('isActual')) {
      scopes.push({ method: ['isActual'] });
    }

    if (Object(query).scopes?.includes('isActive')) {
      scopes.push({ method: ['isActive'] });
    }

    if (Object(query).scopes?.includes('isExpired')) {
      scopes.push({ method: ['isExpired'] });
    }

    if (Object(query).scopes?.includes('isExpiredAndActive')) {
      scopes.push({ method: ['isExpiredAndActive'] });
    }

    if (Object(query).scopes?.includes('withActiveAgreementsOnly')) {
      scopes.push({ method: ['withActiveAgreementsOnly'] });
    }

    if (Object(query).scopes?.includes('withRentees')) {
      scopes.push({ method: ['withRentees'] });
    }
  } else {
    // -----------------------------------------------------------------------------
    // Скоупы с параметрами
    // -----------------------------------------------------------------------------

    if (Object(query).scopes?.hasOwnProperty('withPeriod')) {
      scopes.push({
        method: [
          'withPeriod',
          {
            start: Object(query).scopes.withPeriod.start,
            end: Object(query).scopes.withPeriod.end,
          },
        ],
      });
    }

    if (Object(query).scopes?.hasOwnProperty('byAgreement')) {
      scopes.push({
        method: [
          'byAgreement',
          {
            agreementId: Object(query).scopes.byAgreement,
          },
        ],
      });
    }

    if (Object(query).scopes?.hasOwnProperty('isDebt')) {
      scopes.push({
        method: [
          'isDebt',
          {
            agreementId: Object(query).scopes.byAgreement,
          },
        ],
      });
    }
  }

  return {
    scopes,
    includes,
  };
}
