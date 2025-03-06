import React from "react";

const GifDisplay: React.FC = () => {
  return (
    <div className="relative h-screen bg-gray-100 flex">
    
      <div className="w-[250px] bg-gray-200"></div>

      <div className="flex-1 flex justify-end items-center">
      <div className="border border-red-500 w-full flex justify-end">
  <img
    src="https://cdn.dribbble.com/userupload/22866416/file/original-79954486027de6600487dfbc4eb0f7a1.gif"
    alt="GIF Animation"
    className="border border-blue-500 w-[800px] h-auto"
  />
</div>



</div>

    </div>
  );
};

export default GifDisplay;
