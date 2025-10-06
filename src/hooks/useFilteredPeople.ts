import { useMemo } from 'react';
import { Person } from '../types';
import { useFilter } from './useFilter';
import { Filter, SortKey, SortOrder } from '../types/Filter';

export const useFilteredPeople = (people: Person[]): Person[] => {
  const filter: Filter = useFilter();

  return useMemo(() => {
    let filtered = [...people];

    if (filter.sex) {
      filtered = filtered.filter(p => p.sex === filter.sex);
    }

    const query = filter.query?.trim().toLowerCase();

    if (query) {
      const lowerQuery = query.toLowerCase();

      filtered = filtered.filter(({ name, motherName, fatherName }) => {
        return [
          name.toLowerCase().includes(lowerQuery),
          motherName?.toLowerCase().includes(lowerQuery),
          fatherName?.toLowerCase().includes(lowerQuery),
        ].some(Boolean);
      });
    }

    const centuries = filter.centuries ?? [];

    if (centuries.length > 0) {
      filtered = filtered.filter(p => {
        const birthCentury = Math.floor(p.born / 100) + 1;

        return centuries.includes(String(birthCentury));
      });
    }

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
