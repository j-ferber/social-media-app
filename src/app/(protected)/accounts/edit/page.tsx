import React from 'react'
import { ProfileForm } from '~/components/EditProfileForm'
import ResponsiveContainer from '~/components/ResponsiveContainer'

const Edit = () => {
  return (
    <ResponsiveContainer>
      <div className='bg-white min-h-screen flex justify-center items-center dark:bg-neutral-900 w-full md:p-16 p-6 flex-col'>
        <h1 className='mb-6 font-semibold md:text-4xl text-2xl'>Edit Profile</h1>
        <ProfileForm />
      </div>
    </ResponsiveContainer>
  )
}

export default Edit