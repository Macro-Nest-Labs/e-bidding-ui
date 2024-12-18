import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import axios from 'axios';

import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';

interface SupplierTableProps {
  setTotalBuyers: React.Dispatch<React.SetStateAction<number>>;
  setTotalSuppliers: React.Dispatch<React.SetStateAction<number>>;
}

const SupplierTable: React.FC<SupplierTableProps> = ({
  setTotalBuyers,
  setTotalSuppliers,
}) => {
  const [alignment, setAlignment] = React.useState('buyers');
  const [loading, setLoading] = React.useState(true);
  const [listingData, setListingData] = React.useState([]);

  const columns: GridColDef[] = [
    {
      field: 'firstName',
      headerName: 'First name',
      width: 250,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 200,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 350,
      editable: true,
    },
  ];

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const getListingData = async () => {
    const data = await axios.get(`${NEXT_PUBLIC_ARG_BE_URL}/${alignment}/`);
    if (data) {
      let listData = data.data.data;
      if (alignment === 'buyers') {
        setTotalBuyers(listData.length);
      } else {
        setTotalSuppliers(listData.length);
      }
      const modifiedData = listData.map((item: any) => {
        const { _id, ...rest } = item;
        return { id: _id, ...rest };
      });
      setListingData(modifiedData);
      setLoading(false);
    }
  };

  const totalSupplier = async () => {
    const data = await axios.get(`${NEXT_PUBLIC_ARG_BE_URL}/suppliers/`);
    if (data) {
      let listData = data.data.data;
      setTotalSuppliers(listData.length);
    }
  };

  React.useEffect(() => {
    setLoading(true);
    getListingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alignment]);

  React.useEffect(() => {
    totalSupplier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="col-span-full xl:col-span-12 bg-white shadow-lg rounded-sm border border-slate-200">
      <header className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800 ">
          {alignment === 'buyers' ? 'Buyer List' : 'Supplier List'}
        </h2>
        <div>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="ARG"
          >
            <ToggleButton value="buyers">Buyer List</ToggleButton>
            <ToggleButton value="suppliers">Supplier List</ToggleButton>
          </ToggleButtonGroup>
        </div>
      </header>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={listingData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
          slots={{ toolbar: GridToolbar }}
          loading={loading}
        />
      </Box>
    </div>
  );
};

export default SupplierTable;
