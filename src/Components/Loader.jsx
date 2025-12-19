import React from "react";

function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/30">
      <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
    </div>
  );
}

export default Loader;

