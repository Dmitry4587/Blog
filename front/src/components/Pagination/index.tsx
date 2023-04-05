import React from 'react';
import Pagination from '@mui/material/Pagination';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setCurrentPage } from '../../redux/slices/posts';
import { currentPageSelector, totalPagesSelector } from '../../redux/selectors/postsSelectors';

const PaginationComponent = () => {
  const currentPage = useAppSelector(currentPageSelector);
  const totalPages = useAppSelector(totalPagesSelector);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setCurrentPage(value));
  };

  return (
    <div>
      {totalPages > 1 && (
        <Pagination
          sx={{ marginTop: '40px', marginBottom: '40px' }}
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
        />
      )}
    </div>
  );
};

export default PaginationComponent;
