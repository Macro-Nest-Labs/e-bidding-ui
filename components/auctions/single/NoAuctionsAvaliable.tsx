import React from 'react';
import Image from 'next/image';

const NoAuctionsAvailable = ({ isBuyer }) => {
  return (
    <div className="flex flex-col items-center mx-auto mt-10 p-5 bg-gray-50 shadow-md bg-clip-border rounded-xl h-full">
      <Image
        src="/no_auctions_avaliable.png"
        alt="No Auctions"
        width={500}
        height={500}
        className="rounded-md"
      />
      <div className="text-center text-gray-600 mt-5 w-[450px]">
        <p>It looks like there are no auctions available at the moment.</p>
        {isBuyer ? (
          <p className="mt-2">
            Why not start your own auction and engage with the community?
          </p>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default NoAuctionsAvailable;
