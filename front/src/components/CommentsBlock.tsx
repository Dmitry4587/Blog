import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import { nanoid } from '@reduxjs/toolkit';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import { Link, useParams } from 'react-router-dom';
import { IComment, IPost } from '../redux/types';
import SideBlock from './SideBlock';
import ErrorMessage from './ErrorMessage';
import Comment from './Comment';

interface ICommentsBlock {
  children?: React.ReactNode;
  setPostData?: (post: IPost) => void;
  comments: IComment[];
  isLoading: boolean;
  isOneComment?: boolean;
  isError?: boolean;
  isFull: boolean;
}

const CommentsBlock = ({
  children,
  setPostData,
  comments,
  isLoading,
  isError = false,
  isOneComment = false,
  isFull,
}: ICommentsBlock) => {
  const [errorMessage, setErrorMessage] = React.useState('');
  const { id } = useParams();

  const createContent = () => {
    if (isLoading) {
      return [...Array(5)].map(() => (
        <React.Fragment key={nanoid()}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="text" height={25} width={120} />
              <Skeleton variant="text" height={18} width={230} />
            </div>
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ));
    }

    if (isError) {
      return <ListItem>Не удалось загрузить комментарии</ListItem>;
    }

    if (!comments.length) {
      return <ListItem>Нет комментариев</ListItem>;
    }

    return comments.map((comment) => (
      <Comment
        key={comment._id}
        isPostComment={isFull}
        comment={comment}
        setPostData={setPostData}
        setErrorMessage={setErrorMessage}
        postId={id || ''}
      />
    ));
  };

  return (
    <>
      <SideBlock title={children ? 'Комментарии' : 'Популярные комментарии'}>
        {isOneComment && (
          <div style={{ padding: '5px 0px 10px 20px' }}>
            <Link to={`/posts/${id}`}>Перейти ко всем комментариям</Link>
          </div>
        )}
        <List>{createContent()}</List>
        {children}
      </SideBlock>
      {errorMessage && <ErrorMessage message={errorMessage} setError={setErrorMessage} />}
    </>
  );
};

export default CommentsBlock;
