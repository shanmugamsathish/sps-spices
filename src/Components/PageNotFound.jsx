import React from 'react'
import assets  from '../assets/page-not-found.png'

function PageNotFound() {
  return (
    <div className="w-full h-[75vh] flex items-center justify-center bg-white overflow-hidden">
      <img
        src={assets}
        alt="page not found"
        className="max-w-[60%] max-h-[60%] object-contain"
        style={{ display: "block" }}
      />
    </div>
  );
}

export default PageNotFound
