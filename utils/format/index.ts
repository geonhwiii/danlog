import { DailyCardProps } from '@/components/organisms/DailyCard';
import { PostCardProps } from '@/components/organisms/PostCard';

import { Daily, Post } from '@/contentlayer/generated';

export const formatPostToPostCard = (posts: Post[], count: number = 4): PostCardProps[] =>
  posts.slice(0, count).map(({ slug, title, description, images }) => ({
    slug,
    title,
    description,
    images,
  }));

export const formatDailyToDailyCard = (posts: Daily[], count: number = 4): DailyCardProps[] =>
  posts.slice(0, count).map(({ slug, title, description, images }) => ({
    slug,
    title,
    description,
    images,
  }));
