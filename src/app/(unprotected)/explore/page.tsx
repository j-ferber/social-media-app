'use client';

import {LoaderCircle} from 'lucide-react';
import React from 'react';
import ExploreFeedPost from '~/components/ExploreFeedPost';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import {Button} from '~/components/ui/button';
import {api} from '~/trpc/react';

const Explore = () => {
  const {data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading} =
    api.post.getRecentPosts.useInfiniteQuery(
      {limit: 3},
      {getNextPageParam: lastPage => lastPage.nextCursor}
    );

  console.log(data)

  if (isLoading)
    return (
      <ResponsiveContainer>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <LoaderCircle className="h-12 w-12 animate-spin" />
        </div>
      </ResponsiveContainer>
    );

  if (!data || data.pages[0]?.items.length === 0)
    return (
      <ResponsiveContainer>
        <div className="flex w-full items-center justify-center min-h-screen">
          <h1 className="text-2xl font-semibold text-white">No posts found.</h1>
        </div>
      </ResponsiveContainer>
    );

  const allPosts = data.pages.flatMap(page => page.items);

  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col bg-neutral-900 p-10 md:p-16">
        {allPosts.map(post => (
          <ExploreFeedPost key={post.id} post={post} />
        ))}
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant={'secondary'}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </div>
    </ResponsiveContainer>
  );
};

export default Explore;
