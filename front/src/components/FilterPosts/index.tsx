import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { fetchAllPosts } from '../../redux/thunks/postThunks';
import { userSelector } from '../../redux/selectors/authSelectors';
import { useAppDispatch, useAppSelector, useDebounce } from '../../redux/hooks';
import { currentPageSelector } from '../../redux/selectors/postsSelectors';
import { setCurrentPage } from '../../redux/slices/posts';
import Search from '../Search';
import styles from './FilterPosts.module.scss';

const FilterPosts = ({ tag }: { tag?: string }) => {
  const [postsFilter, setPostsFilter] = React.useState('new');
  const [search, setSearch] = React.useState('');
  const debouncedValue = useDebounce<string>(search, 500);
  const currentPage = useAppSelector(currentPageSelector);
  const user = useAppSelector(userSelector);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setPostsFilter(newValue);
    dispatch(setCurrentPage(1));
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  React.useEffect(() => {
    if (!user) {
      setPostsFilter('new');
    }
  }, [user]);

  React.useEffect(() => {
    if (postsFilter === 'my' && user) {
      dispatch(
        fetchAllPosts({
          tag,
          userId: user._id,
          currentPage,
          title: debouncedValue,
        }),
      );
    } else {
      dispatch(
        fetchAllPosts({
          tag,
          postsFilter,
          currentPage,
          title: debouncedValue,
        }),
      );
    }
  }, [dispatch, postsFilter, tag, user, currentPage, debouncedValue]);

  return (
    <div className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        onChange={handleChange}
        value={postsFilter}
        style={{ marginBottom: 15 }}
        aria-label="basic tabs example">
        <Tab value="new" label="Новые" />
        <Tab value="popular" label="Популярные" />
        {user && <Tab value="my" label="Мои посты" />}
      </Tabs>
      <Search tag={tag || ''} search={search} setSearch={setSearch} />
    </div>
  );
};

export default FilterPosts;
