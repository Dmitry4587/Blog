import React from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import CommentIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { Link } from 'react-router-dom';
import UserInfo from '../UserInfo';
import { deletePostById } from '../../redux/slices/posts';
import { fetchAllComments, fetchAllTags } from '../../redux/thunks/postThunks';
import axios from '../../axios';
import handleServerError from '../../utils/handleServerError';
import { TTags } from '../../redux/types';
import { useAppDispatch } from '../../redux/hooks';
import { PostSkeleton } from './Skeleton';
import styles from './Post.module.scss';

interface IPostProps {
  id: string;
  title: string;
  createdAt: string;
  imageUrl: string;
  user: {
    avatarUrl: string;
    fullName: string;
  };
  viewsCount: number;
  commentsCount: number;
  tags: TTags;
  children?: React.ReactNode;
  isFullPost?: boolean;
  isLoading: boolean;
  isEditable?: boolean;
}

const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost = false,
  isLoading,
  isEditable = false,
}: IPostProps) => {
  const [isDel, setDelete] = React.useState(false);
  const dispatch = useAppDispatch();

  const onClickDelete = async (postId: string) => {
    try {
      setDelete(true);
      await axios.delete(`/posts/${postId}`);
      dispatch(deletePostById(id));
      dispatch(fetchAllComments());
      dispatch(fetchAllTags());
      setDelete(false);
    } catch (e) {
      handleServerError(e);
      setDelete(false);
    }
  };

  if (isLoading || isDel) {
    return <PostSkeleton />;
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>

          <IconButton onClick={() => onClickDelete(id)} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        <UserInfo
          fullName={user.fullName}
          avatarUrl={user.avatarUrl || ''}
          additionalText={createdAt}
        />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>{`#${name}`}</Link>
              </li>
            ))}
          </ul>
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <CommentIcon />
              <span>{commentsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Post;
