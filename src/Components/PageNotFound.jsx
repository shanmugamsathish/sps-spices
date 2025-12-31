import React from 'react'
import { PAGE_NOT_FOUND } from '../lib/constant'

function PageNotFound() {
  return (
    <div className="w-full h-[75vh] flex items-center justify-center bg-white overflow-hidden">
      <img
        src={PAGE_NOT_FOUND.PAGE_NOT_FOUND}
        alt="page not found"
        className="max-w-[60%] max-h-[60%] object-contain"
        style={{ display: "block" }}
      />
    </div>
  );
}

export default PageNotFound
