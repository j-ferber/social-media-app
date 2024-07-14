import {redirect} from 'next/navigation';
import React from 'react';
import EditPostForm from '~/components/EditPostForm';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import {getServerAuthSession} from '~/server/auth';
import {api} from '~/trpc/server';

const EditPostPage = async ({params}: {params: {postid: string}}) => {
  const session = await getServerAuthSession();

  if (!session) return redirect('/api/auth/signin');

  const postData = await api.post.getPostData({
    postId: parseInt(params.postid),
  });
  const user = await api.user.getUserData();

  console.log(session);

  if (postData.createdById !== session?.user.id) {
    return redirect(`/${user?.username}`);
  }

  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col items-center gap-5 bg-neutral-900 p-6 md:p-10">
        <h1 className="text-2xl font-semibold text-white md:text-4xl">
          Edit Post
        </h1>
        <EditPostForm post={postData} />
      </div>
    </ResponsiveContainer>
  );
};

export default EditPostPage;
