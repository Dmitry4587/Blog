import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import { userSelector } from '../../../redux/selectors/authSelectors';
import { useAppSelector } from '../../../redux/hooks';

const SettingsList = () => {
  const user = useAppSelector(userSelector);

  return (
    <List>
      <Link to="avatar">
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Фотография" secondary="Изменить фото профиля" />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
      <Link to="name">
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Имя" secondary={user?.name || 'Изменить имя'} />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
      <Link to="email">
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Почта" secondary={user?.email || 'Изменить почту'} />
          </ListItemButton>
        </ListItem>
      </Link>
      <Divider />
      <Link to="password">
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText primary="Пароль" secondary="Изменить пароль" />
          </ListItemButton>
        </ListItem>
      </Link>
    </List>
  );
};

export default SettingsList;
