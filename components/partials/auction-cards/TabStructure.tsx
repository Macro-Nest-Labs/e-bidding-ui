import { useState } from 'react';

import { IBidModel, IListingModel } from '@/utils/types/be-model-types';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// import AuctionCard1 from './AuctionCard1';
import BidHistoryTable from './BidHistoryTable';
import TermsAndConditionsCard from './TermsAndConditionsCard';

type TabStructureProps = {
  cardData: {
    auction: IListingModel;
    lotId: string;
    bids: IBidModel[];
  };
  roomId: string;
  lotId: string;
};

const TabStructure: React.FC<TabStructureProps> = ({
  cardData,
  roomId,
  lotId,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', marginTop: '1rem' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        style={{ backgroundColor: '#e5e7eb' }}
      >
        <Tab
          label="Auction Information"
          style={{ fontWeight: value === 0 ? 700 : 500 }}
        />
        <Tab
          label="Auction Products"
          style={{ fontWeight: value === 1 ? 700 : 500 }}
        />
        <Tab
          label="Bid History"
          style={{ fontWeight: value === 2 ? 700 : 500 }}
        />
        <Tab
          label="Terms & Conditions"
          style={{ fontWeight: value === 3 ? 700 : 500 }}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        {/* <AuctionCard1
          roomId={roomId}
          auctionId={cardData.auction._id}
          auctionData={cardData.auction || []}
        /> */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="overflow-x-auto flex-grow">
          <BidHistoryTable
            roomId={roomId}
            lotId={lotId}
            bidTableData={cardData?.bids || []}
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <TermsAndConditionsCard />
      </TabPanel>
    </Box>
  );
};

export default TabStructure;
