'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';
import Typography from '@mui/material/Typography';
import cx from 'classnames';
import styles from './header.module.scss';
import Skeleton from '@mui/material/Skeleton';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();
  let role: any = user ? user['roles/roles'] : null;

  return (
    <header className="text-white bg-[#6366F1] body-font shadow-md">
      <div className="container mx-auto flex flex-wrap p-4 flex-col md:flex-row items-center justify-between">
        <a className="flex title-font font-medium items-center text-gray-900 mb-0">
          <Image
            src="https://w7.pngwing.com/pngs/791/697/png-transparent-computer-icons-auction-gavel-bidding-auction-angle-text-internet-thumbnail.png"
            alt="Company Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
        </a>

        <nav className="md:mx-auto flex flex-wrap items-center text-base justify-center">
          <a
            href={!isLoading ? (role[0] === 'admin' ? '/admin' : '/') : '#'}
            className={cx(styles['link'], 'relative')}
          >
            Home
          </a>
          {!isLoading ? (
            role[0] !== 'admin' ? (
              <a href="/auctions" className={cx(styles['link'], 'relative')}>
                Auctions
              </a>
            ) : null
          ) : null}
          {isLoading ? (
            <Skeleton variant="text" sx={{ fontSize: '1rem', width: '65px' }} />
          ) : role[0] === 'buyer' ? (
            <a
              href="/auctions/create"
              className={cx(styles['link'], 'relative')}
            >
              Sourcing
            </a>
          ) : null}
        </nav>

        {user ? (
          <div className="flex items-center space-x-4">
            <Typography
              variant="subtitle1"
              className="hidden md:block text-white"
            >
              Hello, {user?.name}
            </Typography>
            <a
              href="/api/auth/logout"
              className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
            >
              Logout
            </a>
          </div>
        ) : (
          <a
            href="/api/auth/login"
            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          >
            Login
          </a>
        )}

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {isOpen && (
          <div className="mt-4 md:hidden">
            <a
              href={!isLoading ? (role[0] === 'admin' ? '/admin' : '/') : '#'}
              className="block mb-2 hover:text-gray-900"
            >
              Home
            </a>
            {user && role[0] === 'buyer' ? (
              <a
                href="/auctions/create"
                className="block mb-2 hover:text-gray-900"
              >
                Sourcing
              </a>
            ) : null}
            {!isLoading ? (
              role[0] !== 'admin' ? (
                <a href="/auctions" className="block mb-2 hover:text-gray-900">
                  Auctions
                </a>
              ) : null
            ) : null}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
