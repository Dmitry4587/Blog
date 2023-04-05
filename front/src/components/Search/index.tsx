import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import styles from './Search.module.scss';

interface ISearchProps {
  search: string;
  setSearch: (value: string) => void;
  tag: string;
}

const Search = ({ tag, search, setSearch }: ISearchProps) => (
  <TextField
    className={styles.input}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
    id="input-with-icon-textfield"
    value={search}
    placeholder={tag ? 'Поиск статей по тегу' : 'Искать во всех статьях'}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    variant="standard"
  />
);

export default Search;
