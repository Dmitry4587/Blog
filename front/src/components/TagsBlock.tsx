import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
import { nanoid } from '@reduxjs/toolkit';
import { tagsSelector, tagsStatusSelector } from '../redux/selectors/postsSelectors';
import { useAppSelector } from '../redux/hooks';
import { ItemStatus } from '../redux/types';
import SideBlock from './SideBlock';

const TagsBlock = ({ tag }: { tag?: string }) => {
  const tags = useAppSelector(tagsSelector);
  const tagsStatus = useAppSelector(tagsStatusSelector);
  const isTagsLoading = tagsStatus === ItemStatus.LOADING;
  const isTagsError = tagsStatus === ItemStatus.ERROR;

  const createContent = () => {
    if (isTagsLoading) {
      return [...Array(5)].map(() => (
        <ListItem key={nanoid()} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <TagIcon />
            </ListItemIcon>
            <Skeleton width={100} />
          </ListItemButton>
        </ListItem>
      ));
    }

    if (isTagsError) {
      return <ListItem>Не удалось загрузить теги</ListItem>;
    }

    if (!tags.length) {
      return <ListItem>Нет тегов</ListItem>;
    }

    return tags.map((name) => (
      <Link key={nanoid()} style={{ textDecoration: 'none', color: 'black' }} to={`/tags/${name}`}>
        <ListItem key={nanoid()} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <TagIcon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
      </Link>
    ));
  };

  return (
    <SideBlock title={tag ? 'Посты по тегу' : 'Популярные теги'}>
      <List>{createContent()}</List>
    </SideBlock>
  );
};

export default TagsBlock;
