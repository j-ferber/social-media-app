import React from 'react';
import {ProfileForm} from '~/components/EditProfileForm';
import ResponsiveContainer from '~/components/ResponsiveContainer';

const Edit = () => {
  return (
    <ResponsiveContainer>
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-900 p-6 md:p-16">
        <h1 className="mb-6 text-2xl font-semibold text-white md:text-4xl">
          Edit Profile
        </h1>
        <ProfileForm />
      </div>
    </ResponsiveContainer>
  );
};

export default Edit;
