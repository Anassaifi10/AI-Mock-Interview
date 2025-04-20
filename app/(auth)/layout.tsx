import React from 'react'

function AutheLayout({children}: {children: React.ReactNode}) {
  return (
   <div className="auth-layout">{children}</div>
  )
}

export default AutheLayout
