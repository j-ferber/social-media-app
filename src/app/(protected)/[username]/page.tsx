import {api} from '~/trpc/server';
import {redirect} from 'next/navigation';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import Link from 'next/link';
import {buttonVariants} from '~/components/ui/button';
import ClientFollowButton from '~/components/ClientFollowButton';
import {Separator} from '~/components/ui/separator';
import AccountPost from '~/components/AccountPost';
import {Suspense} from 'react';
import {LoaderCircle} from 'lucide-react';

const ProfilePage = async ({params}: {params: {username: string}}) => {
  const userData = await api.user.getUserData();
  if (!userData?.username) return redirect('/setup');
  const viewedUser = await api.user.getCurrentViewed({
    username: params.username,
  });
  if (!viewedUser?.username)
    return (
      <ResponsiveContainer className="flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-white md:text-3xl">
          This user does not exist.
        </p>
        <Link href={'/'} className={buttonVariants({variant: 'secondary'})}>
          Back to Home
        </Link>
      </ResponsiveContainer>
    );
  const following = await api.user.checkIfFollowing({
    username: viewedUser.username,
  });

  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col bg-neutral-900 p-6 md:p-10">
        <header className="grid grid-cols-1 place-items-center sm:flex sm:items-center sm:justify-between">
          <img
            src={viewedUser.image ? viewedUser.image : '/images/avatar.png'}
            alt=""
            className="mb-4 h-32 w-32 rounded-full border-4 border-lightPurple object-contain sm:mb-0 sm:h-24 sm:w-24 md:h-28 md:w-28"
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="w-full text-center text-xl font-bold text-lightPurple md:text-4xl">
              {viewedUser.username}
            </h1>
            <div className="grid grid-cols-3 place-items-center gap-4">
              <p className="text-xs text-white md:text-sm">
                Posts:{' '}
                <span className="font-bold">{viewedUser.posts.length}</span>
              </p>
              <p className="text-xs text-white md:text-sm">
                Followers:{' '}
                <span className="font-bold">{viewedUser.followers.length}</span>
              </p>
              <p className="text-xs text-white md:text-sm">
                Following:{' '}
                <span className="font-bold">{viewedUser.following.length}</span>
              </p>
            </div>
            {userData.username !== viewedUser.username ? (
              <ClientFollowButton
                username={viewedUser.username}
                following={following}
              />
            ) : (
              <Link
                className={buttonVariants({variant: 'secondary'})}
                href={'/accounts/edit'}
              >
                Edit Profile
              </Link>
            )}
          </div>
        </header>
        <p className="mt-6 text-center text-sm text-white sm:text-left sm:text-xl">
          {viewedUser.bio}
        </p>
        <Separator className="mt-4" />
        <Suspense
          fallback={<LoaderCircle className="mx-auto mt-4 animate-spin" />}
        >
          <div className="mt-4 grid w-full grid-cols-2 place-items-center gap-1 lg:grid-cols-3">
            {viewedUser.posts.map(post => (
              <AccountPost key={post.id} {...post} />
            ))}
          </div>
        </Suspense>
      </div>
    </ResponsiveContainer>
  );
};

export default ProfilePage;
