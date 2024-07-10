import React from 'react';
import NavbarLinks from './NavbarLinks';
import {getServerAuthSession} from '~/server/auth';
import {Card, CardHeader} from './ui/card';
import {Avatar, AvatarFallback, AvatarImage} from './ui/avatar';
import Link from 'next/link';
import {buttonVariants} from './ui/button';
import {api} from '~/trpc/server';
import {ModeToggle} from './ThemeToggle';
import {cn} from '~/lib/utils';
import SearchSheet from './SearchSheet';
import UploadDialog from './UploadDialog';

const Navbar = async () => {
  const session = await getServerAuthSession();
  const userData = await api.user.getUserData();

  return (
    <nav className="fixed bottom-0 left-0 top-0 hidden flex-col justify-between bg-neutral-900 p-4 md:flex md:w-[200px]">
      <div className="grid grid-cols-1 gap-4">
        <NavbarLinks />
        {session?.user && (
          <>
            <SearchSheet />
            <UploadDialog />
          </>
        )}
      </div>
      {session?.user ? (
        <div className="flex w-full flex-col gap-2">
          <Link href={userData?.username ? `/${userData.username}` : '/setup'}>
            <Card className="flex items-center justify-between gap-2 p-2">
              {session.user.image ? (
                <Avatar>
                  <AvatarImage src={session.user.image} />
                  <AvatarFallback>
                    {session.user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarImage src="../images/avatar.png" />
                </Avatar>
              )}
              <div className="flex-1">
                <CardHeader className="truncate p-0 text-center text-sm">
                  {userData?.username ? userData.username : session.user.name}
                </CardHeader>
              </div>
            </Card>
          </Link>
          <div className="flex w-full items-center justify-center gap-2">
            <Link
              className={cn(
                buttonVariants({variant: 'secondary'}),
                'flex flex-1'
              )}
              href={'/api/auth/signout'}
            >
              Sign Out
            </Link>
            <ModeToggle />
          </div>
        </div>
      ) : (
        <Link
          className={buttonVariants({variant: 'secondary'})}
          href={'/api/auth/signin'}
        >
          Sign In
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
