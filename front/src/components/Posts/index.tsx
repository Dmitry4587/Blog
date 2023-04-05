import React from 'react';
import { nanoid } from '@reduxjs/toolkit';
import Post from '../Post';
import { formatDate } from '../../utils/formatDate';
import { postsSelector, postsStatusSelector } from '../../redux/selectors/postsSelectors';
import { userSelector } from '../../redux/selectors/authSelectors';
import { useAppSelector } from '../../redux/hooks';
import { PostSkeleton } from '../Post/Skeleton';
import { ItemStatus } from '../../redux/types';

const Posts = () => {
  const posts = useAppSelector(postsSelector);
  const userInfo = useAppSelector(userSelector);
  const postsStatus = useAppSelector(postsStatusSelector);
  const isPostsLoading = postsStatus === ItemStatus.LOADING;
  const isPostsError = postsStatus === ItemStatus.ERROR;

  const createPosts = () => {
    if (isPostsLoading) {
      return [...Array(3)].map(() => <PostSkeleton key={nanoid()} />);
    }

    if (isPostsError) {
      return <h2>Не удалось загрузить посты</h2>;
    }

    if (!posts.items.length && postsStatus === ItemStatus.LOADED) {
      return <h2>Пока нет постов</h2>;
    }

    return posts.items.map((post) => (
      <Post
        key={post._id}
        id={post._id}
        title={post.title}
        imageUrl={post?.img?.url || ''}
        user={{
          avatarUrl: post?.user?.avatar?.url || '',
          fullName: post.user.name,
        }}
        createdAt={formatDate(post.createdAt)}
        viewsCount={post.viewCount}
        isLoading={isPostsLoading}
        commentsCount={post.commentsCount || 0}
        tags={post.tags || []}
        isEditable={Boolean(userInfo && userInfo._id === post.user._id)}
      />
    ));
  };

  return <>{createPosts()}</>;
};

export default Posts;
