import { useMemo } from 'react';
import { Person } from '../types';
import { useFilter } from './useFilter';
import { Filter, SortKey, SortOrder } from '../types/Filter';

export const useFilteredPeople = (people: Person[]): Person[] => {
  const filter: Filter = useFilter();

  return useMemo(() => {
    let filtered = [...people];

    // --- Фільтр за статтю ---
    if (filter.sex) {
      filtered = filtered.filter(p => p.sex === filter.sex);
    }

    // --- Пошуковий фільтр ---
    const query = filter.query?.trim().toLowerCase();

    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    }

    // --- Фільтр за століттями ---
    const centuries = filter.centuries ?? [];

    if (centuries.length > 0) {
      filtered = filtered.filter(p => {
        const birthCentury = Math.floor(p.born / 100) + 1;

        return centuries.includes(String(birthCentury));
      });
    }

    // --- Сортування ---
    const sortKey: SortKey | undefined = filter.sort?.key;
    const sortOrder: SortOrder = filter.sort?.order ?? 'asc';

    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];

        if (aVal < bVal) {
          return sortOrder === 'asc' ? -1 : 1;
        }

        if (aVal > bVal) {
          return sortOrder === 'asc' ? 1 : -1;
        }

        return 0;
      });
    }

    return filtered;
  }, [
    people,
    filter.sex,
    filter.query,
    filter.centuries,
    filter.sort?.key,
    filter.sort?.order,
  ]);
};
