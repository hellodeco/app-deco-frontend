import React from 'react'

export function FullScreenContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen items-center justify-center flex flex-col">
      {children}
    </div>
  )
}
