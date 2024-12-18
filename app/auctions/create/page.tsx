import React, { FunctionComponent } from 'react';

import CreateAuctionTemplate from '@/components/templates/auctions/create';
import { CREATE_PAGE_DATA } from '@/constants/pages/auctions/create';

async function getData() {
  return CREATE_PAGE_DATA;
}

const CreateAuction: FunctionComponent<TCreateAuctionProps> = async () => {
  const data = await getData();

  return (
    <div>
      <CreateAuctionTemplate data={data} />
    </div>
  );
};

export type TCreateAuctionProps = {};

export default CreateAuction;
