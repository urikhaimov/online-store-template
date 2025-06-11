import React, { useMemo, useReducer, Suspense, lazy, useEffect } from 'react';
import { useAllProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { initialState, reducer } from './LocalReducer';
import type { Category } from '../../types/firebase';

const ProductFilters = lazy(() => import('./ProductFilters'));
const ProductList = lazy(() => import('./ProductList'));

export default function HomePage() {
  const { data: products = [] } = useAllProducts();
  const { data: categories = [] } = useCategories();
  const [state, dispatch] = useReducer(reducer, initialState);

  const pageSize = 10;
  const filteredProducts = useMemo(() => {
    const matches = products.filter((p) => {
      const txt = state.search.toLowerCase();
      const inText =
        p.name.toLowerCase().includes(txt) ||
        p.description?.toLowerCase().includes(txt);
      const inCat =
        !state.selectedCategoryId || p.categoryId === state.selectedCategoryId;
      const inDate =
        !state.createdAfter ||
        (p.createdAt?.toDate &&
          p.createdAt.toDate().getTime() >= state.createdAfter.valueOf());
      return inText && inCat && inDate;
    });

    return matches;
  }, [products, state]);

  const paginatedProducts = useMemo(() => {
    const start = (state.page - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, state.page]);

  useEffect(() => {
    const start = (state.page - 1) * pageSize;
    dispatch({
      type: 'SET_HAS_MORE',
      payload: start + pageSize < filteredProducts.length,
    });
  }, [filteredProducts.length, state.page]);

  return (
    <>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ProductFilters
          state={state}
          dispatch={dispatch}
          categories={categories as Category[]}
        />
      </Suspense>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList
          products={paginatedProducts}
          categories={categories as Category[]}
          page={state.page}
          hasMore={state.hasMore}
          setPage={(val) => dispatch({ type: 'SET_PAGE', payload: val })}
        />
      </Suspense>
    </>
  );
}
