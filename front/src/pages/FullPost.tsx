import React from 'react';
import { Skeleton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useLocation, useParams } from 'react-router-dom';
import Post from '../components/Post';
import Index from '../components/AddComment';
import CommentsBlock from '../components/CommentsBlock';
import { fetchPostById } from '../redux/thunks/postThunks';
import { userSelector } from '../redux/selectors/authSelectors';
import { formatDate } from '../utils/formatDate';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { IPost, ItemStatus } from '../redux/types';
import { PostSkeleton } from '../components/Post/Skeleton';
import ErrorPage from './ErrorPage';

const FullPost = () => {
  const { id } = useParams();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [postData, setPostData] = React.useState<IPost | null>(null);
  const [status, setStatus] = React.useState(ItemStatus.LOADING);
  const auth = useAppSelector(userSelector);
  const dispatch = useAppDispatch();
  const isOneComment =
    location.state && postData?.comments?.filter((item) => item._id === location.state);
  const isLoading = status === ItemStatus.LOADING;
  const isError = status === ItemStatus.ERROR;

  const fetchPost = React.useCallback(async () => {
    setStatus(ItemStatus.LOADING);
    try {
      if (id) {
        const data = await dispatch(fetchPostById(id)).unwrap();
        setPostData(data);
        setStatus(ItemStatus.LOADED);
      }
    } catch (e) {
      setStatus(ItemStatus.ERROR);
      if (typeof e === 'string') {
        setErrorMessage(e);
      }
    }
  }, [dispatch, id]);

  React.useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (isLoading) {
    return (
      <>
        <PostSkeleton />
        <Skeleton variant="rounded" height={350} />
      </>
    );
  }

  if (isError) {
    return <ErrorPage error={errorMessage} />;
  }
  if (postData) {
    return (
      <>
        <Post
          id={postData._id}
          title={postData.title}
          imageUrl={postData.img?.url || ''}
          user={{
            avatarUrl: postData.user.avatar?.url || '',
            fullName: postData.user.name,
          }}
          createdAt={formatDate(postData.createdAt)}
          viewsCount={postData.viewCount}
          commentsCount={postData.commentsCount || 0}
          tags={postData.tags || []}
          isFullPost
          isLoading={isLoading}>
          <ReactMarkdown>{postData.text}</ReactMarkdown>
        </Post>

        <CommentsBlock
          isFull
          isOneComment={Boolean(isOneComment)}
          comments={isOneComment || postData.comments || []}
          setPostData={setPostData}
          isLoading={isLoading}>
          {auth && !isOneComment && <Index setPostData={setPostData} />}
        </CommentsBlock>
      </>
    );
  }
  return null;
};

export default FullPost;
