import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'
import React from 'react'

async function page() {
  const user = await getCurrentUser();
  return (
    <div>
        <Agent userName={user?.name!}
        userId={user?.id}
        type="generate"/>      
    </div>
  )
}

export default page
