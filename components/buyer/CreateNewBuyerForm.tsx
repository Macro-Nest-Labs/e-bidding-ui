'use client';
import axios from 'axios';
import React, { ChangeEventHandler, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import {
  createUser,
  deleteUser,
  generateRandomPassword,
  updateUserRole,
} from '@/utils/functions/auth0Utils';
import { ISingleBuyerResponse } from '@/utils/types/api-types';
import { useUser } from '@auth0/nextjs-auth0/client';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const CreateNewBuyerForm = () => {
  const INITIAL_BUYER_DATA = {
    email: '',
    fname: '',
    lname: '',
  };
  const [buyerData, setBuyerData] = useState(INITIAL_BUYER_DATA);

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setBuyerData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  /*
  The below code performs the following actions:

  1. Tries to create a new user in Auth0.
  2. Upon successful creation, checks if the user is already present in MongoDB.
  3. If the user is not in MongoDB, it creates the user in the database.
  4. If the user is already present in MongoDB, it deletes the user from Auth0.
  5. If the user is created in both Auth0 and MongoDB, updates the user's role to 'buyer'.
  
  Note: Ensure proper authentication and authorization mechanisms are in place,
  and handle user deletion and updation with caution as it is a critical operation.
*/

  const { user } = useUser();
  let role: any = user ? user['roles/roles'] : null;

  React.useEffect(() => {
    if (role && role[0] !== 'admin') {
      window.location.href = '/';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const submitForm = async () => {
    const password = generateRandomPassword();
    const payload = {
      email: buyerData.email,
      firstName: buyerData.fname,
      lastName: buyerData.lname,
      password,
    };

    if (buyerData.email === '' || buyerData.fname === '') {
      toast.error('Required Field Missing');
    } else {
      try {
        const res = await createUser(buyerData.email, password);

        if (res.status === 201) {
          try {
            const createSupplierResponse: ISingleBuyerResponse =
              await axios.post(`${NEXT_PUBLIC_ARG_BE_URL}/buyers/`, payload);
            if (createSupplierResponse.status === 201) {
              toast.success('Buyer Created Successfully');
              const buyer_roleId = 'rol_eGEoUsd1Ixu4xc1x';
              await updateUserRole(res.data.user_id, buyer_roleId);

              window.location.href = '/admin';
            }
          } catch (error: any) {
            toast.error(error.response.data.error);

            //delete user from the auth0 if already exists in the mongoDB
            if (res.data) {
              await deleteUser(res.data.user_id);
            }
          }
        }
      } catch (error: any) {
        // eslint-disable-next-line no-console
        console.log('error', error.response.data.message);
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <>
      {user && role[0] === 'admin' ? (
        <div
          className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
          style={{ marginTop: '3rem', marginBottom: '3rem' }}
        >
          <header className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">
              New Buyer Enrollment
            </h2>
          </header>

          <div className="m-4 grid grid-col-1 sm:grid-cols-2 gap-3">
            <TextField
              variant="outlined"
              label="Email"
              name="email"
              type="email"
              required
              value={buyerData.email}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              label="First Name"
              name="fname"
              required
              value={buyerData.fname}
              onChange={handleInputChange}
            />
            <TextField
              variant="outlined"
              label="Last Name"
              name="lname"
              value={buyerData.lname}
              onChange={handleInputChange}
            />
          </div>
          <div className="m-4 grid grid-col-1">
            <button
              className="w-full sm:w-full md:1/2 middle none center rounded-lg bg-blue-500 py-3 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              onClick={submitForm}
            >
              Create Buyer
            </button>
          </div>
          <Toaster />
        </div>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default CreateNewBuyerForm;
