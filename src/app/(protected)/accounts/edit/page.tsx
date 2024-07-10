import React from 'react';
import {ProfileForm} from '~/components/EditProfileForm';
import ResponsiveContainer from '~/components/ResponsiveContainer';

const Edit = () => {
  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white p-6 dark:bg-neutral-900 md:p-16">
        <h1 className="mb-6 text-2xl font-semibold md:text-4xl">
          Edit Profile
        </h1>
        <ProfileForm />
      </div>
    </ResponsiveContainer>
  );
};

export default Edit;
