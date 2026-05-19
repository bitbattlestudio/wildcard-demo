import React from 'react'

export default function PhoneFrame({ children }) {
  return (
    <div className="phone-frame">
      <div className="phone-hardware">
        <div className="phone-viewport">{children}</div>
      </div>
    </div>
  )
}
