import { api } from '~/trpc/server'
import { redirect } from 'next/navigation'
import ResponsiveContainer from '~/components/ResponsiveContainer'
import Link from 'next/link'
import { buttonVariants } from '~/components/ui/button'
import ClientFollowButton from '~/components/ClientFollowButton'
import { Separator } from '~/components/ui/separator'

const ProfilePage = async ({params}: {params: {username: string}}) => {

  const userData = await api.user.getUserData()
  if (!userData?.username) return redirect('/setup')
  const viewedUser = await api.user.getCurrentViewed({username: params.username})
  if (!viewedUser?.username) return (
    <ResponsiveContainer className='flex flex-col items-center justify-center gap-4'>
      <p className='md:text-3xl text-white font-bold text-xl'>This user does not exist.</p>
      <Link href={"/"} className={buttonVariants({variant: "secondary"})}>Back to Home</Link>
    </ResponsiveContainer>
  )
  const following = await api.user.checkIfFollowing({username: viewedUser.username})
  
  return (
    <ResponsiveContainer>
      <div className='bg-neutral-900 w-full p-6 flex flex-col min-h-screen md:p-10'>
        <header className='sm:flex sm:justify-between sm:items-center grid grid-cols-1 place-items-center'>
          <img src={viewedUser.image ? viewedUser.image : "/images/avatar.png"} alt="" className='w-32 h-32 md:w-28 md:h-28 sm:w-24 sm:h-24 rounded-full object-contain border-4 border-lightPurple sm:mb-0 mb-4' />
          <div className='flex flex-col justify-center items-center gap-4'>
            <h1 className='md:text-4xl text-xl font-bold text-lightPurple w-full text-center'>{viewedUser.username}</h1>
            <div className='grid grid-cols-3 place-items-center gap-4'>
              <p className='md:text-sm text-xs text-white'>Posts: <span className='font-bold'>{viewedUser.posts.length}</span></p>
              <p className='md:text-sm text-xs text-white'>Followers: <span className='font-bold'>{viewedUser.followers.length}</span></p>
              <p className='md:text-sm text-xs text-white'>Following: <span className='font-bold'>{viewedUser.following.length}</span></p>
            </div>
            {
              userData.username !== viewedUser.username ? (
                <ClientFollowButton username={viewedUser.username} following={following} />
              ) : (
                <Link className={buttonVariants({variant: "secondary"})} href={"/accounts/edit"}>Edit Profile</Link>
              )
            }
          </div>
        </header>
        <p className='sm:text-xl text-sm mt-6 text-center sm:text-left'>{viewedUser.bio}</p>
        <Separator className='mt-4'/>
      </div>
    </ResponsiveContainer>
  )
}

export default ProfilePage