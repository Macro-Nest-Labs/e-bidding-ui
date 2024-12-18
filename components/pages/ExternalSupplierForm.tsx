'use client';
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import { ICreateSupplierResponse } from '@/utils/types/api-types';

const ExternalSupplierForm = () => {
  const { user, isLoading } = useUser();
  const INITIAL_SUPPLIER_DATA = {
    email: '',
    vendorCode: '',
    firstName: '',
    lastName: '',
    city: '',
    address: '',
  };
  const [supplierData, setSupplierData] = useState(INITIAL_SUPPLIER_DATA);

  useEffect(() => {
    if (user) {
      setSupplierData((prev) => {
        return { ...prev, email: user?.email ? user?.email : '' };
      });
    }
  }, [isLoading, user]);

  const handleInputChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setSupplierData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const submitForm = async () => {
    const data = {
      email: user ? user.email : '',
      vendorCode: supplierData.vendorCode,
      firstName: supplierData.firstName,
      lastName: supplierData.lastName,
      city: supplierData.city,
      address: supplierData.address,
    };
    if (supplierData.vendorCode === '' || supplierData.firstName === '') {
      toast.error('Required Field Missing');
    } else {
      try {
        const createSupplierResponse: ICreateSupplierResponse =
          await axios.post(`${NEXT_PUBLIC_ARG_BE_URL}/suppliers/`, data);

        if (createSupplierResponse.status === 201) {
          toast.success('Supplier Created Successfully');
          setSupplierData(INITIAL_SUPPLIER_DATA);
          window.location.href = '/auctions';
        } else {
          setSupplierData(INITIAL_SUPPLIER_DATA);
          toast.error('Something Went Wrong!!!');
        }
      } catch (error: any) {
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div
      className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200"
      style={{ marginTop: '3rem', marginBottom: '3rem' }}
    >
      <header className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-800">New Vendor Enrollment</h2>
      </header>

      <div className="m-4 grid grid-col-1 sm:grid-cols-2 gap-3">
        <TextField
          variant="outlined"
          label="Vendor Code"
          name="vendorCode"
          value={supplierData.vendorCode}
          required
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          label="City"
          name="city"
          value={supplierData.city}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          label="First Name"
          name="firstName"
          required
          value={supplierData.firstName}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          label="Last Name"
          name="lastName"
          value={supplierData.lastName}
          onChange={handleInputChange}
        />
      </div>
      <div className="mx-4 grid grid-col-1">
        <TextField
          variant="outlined"
          multiline
          minRows={3}
          label="Address"
          name="address"
          value={supplierData.address}
          onChange={handleInputChange}
        />
      </div>
      <div className="m-4 grid grid-col-1">
        <button
          className="w-full sm:w-full md:1/2 middle none center rounded-lg bg-blue-500 py-3 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          onClick={submitForm}
        >
          Submit form
        </button>
      </div>
      <Toaster />
    </div>
  );
};

export default ExternalSupplierForm;
