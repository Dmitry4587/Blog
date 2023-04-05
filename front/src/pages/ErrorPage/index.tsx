import React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.scss';

interface IErrorPageProps {
  error: string;
  onClickUpdate?: () => void;
}

const ErrorPage = ({ error = 'Ошибка', onClickUpdate }: IErrorPageProps) => (
  <div className={styles.wrapper}>
    <div className={styles.text}>{error}</div>
    <Link to="/">
      <Button onClick={onClickUpdate} sx={{ mt: '10px' }} variant="contained">
        {onClickUpdate ? 'Попробовать снова' : 'На главную'}
      </Button>
    </Link>
  </div>
);

export default ErrorPage;
