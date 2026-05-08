import React from 'react';

const Navbar = () => {
  return (
    <div className="flex justify-between items-stretch h-10 mb-5 border-b-[3px] border-black">
      <div className="bg-black text-white flex items-center px-5 font-bold text-sm tracking-wide">
        <span className="text-base">CB</span>
        <span className="mx-2.5 text-[#555]">|</span>
        <span>CUSTOM BUILDER</span>
      </div>
      <button className="bg-[#00b0f0] text-white border-none px-5 font-bold cursor-pointer flex items-center text-xs">
        CHAMPRO DEALERS PLEASE LOGIN <span className="ml-2.5">➔</span>
      </button>
    </div>
  );
};

export default Navbar;
