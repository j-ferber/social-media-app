import { redirect } from 'next/navigation'
import React from 'react'
import EditPostForm from '~/components/EditPostForm'
import ResponsiveContainer from '~/components/ResponsiveContainer'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

const EditPostPage = async ({params}: {params: {postid: string}}) => {

  const session = await getServerAuthSession()
  
  if (!session) return redirect('/api/auth/signin')

  const postData = await api.post.getPostData({postId: parseInt(params.postid)})
  
  if (postData.createdById !== session?.user.id) {
    return redirect(`/${session.user.username}`)
  }

  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col gap-5 bg-neutral-900 p-6 md:p-10 items-center">
        <h1 className='md:text-4xl text-2xl text-white font-semibold'>Edit Post</h1>
        <EditPostForm post={postData} />
      </div>
    </ResponsiveContainer>
  )
}

export default EditPostPage