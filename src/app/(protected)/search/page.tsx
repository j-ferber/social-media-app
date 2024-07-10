'use client';

import {Avatar, AvatarFallback, AvatarImage} from '~/components/ui/avatar';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import ResponsiveContainer from '~/components/ResponsiveContainer';
import {buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {api} from '~/trpc/react';
import {LoaderCircle} from 'lucide-react';
import {cn} from '~/lib/utils';

const SearchPage = () => {
  const searchParams = useSearchParams().get('search');
  if (!searchParams) {
    return (
      <ResponsiveContainer className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-2xl font-bold text-white md:text-4xl">
          No search query provided.
        </h1>
        <Link href={'/'} className={buttonVariants({variant: 'secondary'})}>
          Return Home
        </Link>
      </ResponsiveContainer>
    );
  }
  const {data, isPending, isError} = api.user.searchForUsers.useQuery(
    {username: searchParams},
    {retry: false}
  );

  return (
    <ResponsiveContainer>
      {isPending ? (
        <ResponsiveContainer className="flex flex-col items-center justify-center gap-2">
          <LoaderCircle className="h-16 w-16 animate-spin text-white" />
        </ResponsiveContainer>
      ) : isError ? (
        <ResponsiveContainer className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            No users found.
          </h1>
          <Link href={'/'} className={buttonVariants({variant: 'secondary'})}>
            Return Home
          </Link>
        </ResponsiveContainer>
      ) : (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {data.map(user => (
            <Card key={user.id}>
              <CardHeader className="space-y-4">
                <Avatar>
                  <AvatarImage src={user.image ? user.image : '/avatar.png'} />
                  <AvatarFallback>
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.username}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Followers: {user.followers.length}
                </p>
                <p className="text-sm font-semibold">
                  Following: {user.following.length}
                </p>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/${user.username}`}
                  className={cn(
                    buttonVariants({variant: 'secondary'}),
                    'w-full'
                  )}
                >
                  Visit Profile
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </ResponsiveContainer>
  );
};

export default SearchPage;
