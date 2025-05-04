import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import React from 'react'

const AutheLayout=async({children}: {children: React.ReactNode})=> {
  const isUSerAuthenticated=await isAuthenticated()
    if(isUSerAuthenticated) {
      redirect("/");
    }
  return (
   <div className="auth-layout">{children}</div>
  )
}

export default AutheLayout
