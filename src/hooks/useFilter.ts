import { useSearchParams } from 'react-router-dom';
import { Filter, SortKey, SortOrder } from '../types/Filter';

export const useFilter = (): Filter => {
  const [searchParams] = useSearchParams();

  const sex = searchParams.get('sex');
  const query = searchParams.get('query');
  const centuries = searchParams.getAll('centuries');

  const sortKeyRaw = searchParams.get('sort');
  const sortOrderRaw = searchParams.get('order');

  const validSortKeys: SortKey[] = ['name', 'born', 'died', 'sex'];
  const validSortOrders: SortOrder[] = ['asc', 'desc'];

  const sort: Filter['sort'] =
    sortKeyRaw &&
    validSortKeys.includes(sortKeyRaw as SortKey) &&
    sortOrderRaw &&
    validSortOrders.includes(sortOrderRaw as SortOrder)
      ? { key: sortKeyRaw as SortKey, order: sortOrderRaw as SortOrder }
      : null;

  return {
    sex,
    query,
    centuries,
    sort,
  };
};
