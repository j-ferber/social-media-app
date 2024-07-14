'use client';

import React from 'react';
import {Menu, User} from 'lucide-react';
import {Dialog, DialogTrigger, DialogContent} from './ui/dialog';
import NavbarLinks from './NavbarLinks';
import {api} from '~/trpc/react';
import Link from 'next/link';
import SearchSheet from './SearchSheet';
import UploadDialog from './UploadDialog';

const NavbarToggle = () => {
  const {data} = api.user.getUserData.useQuery();

  return (
    <Dialog>
      <DialogTrigger>
        <Menu className="fixed right-2 top-2 text-white hover:scale-110 hover:cursor-pointer active:scale-105 md:hidden" />
      </DialogTrigger>
      <DialogContent>
        <div className="flex w-full flex-col p-4">
          <NavbarLinks />
          {data?.username && (
            <>
              <Link
                className={
                  'flex h-full w-full items-center justify-center gap-3 rounded-xl p-4 font-semibold text-white transition-all duration-150 hover:bg-neutral-500'
                }
                href={`/${data.username}`}
              >
                <User className="transition-all" />
                <span className="text-lg transition-colors duration-200">
                  Profile
                </span>
              </Link>
              <SearchSheet />
              <UploadDialog />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NavbarToggle;
