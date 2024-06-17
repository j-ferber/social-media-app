import React from 'react'
import { api } from '~/trpc/server'
import { redirect } from 'next/navigation'
import SetupForm from '~/components/SetupForm'

const Setup = async () => {

  const userData = await api.user.getUserData()
  if (!userData) return redirect('/api/auth/signin')
  if (userData?.username) return redirect(`/${userData.username}`)

  return (
    <SetupForm />
  )
}

export default Setup