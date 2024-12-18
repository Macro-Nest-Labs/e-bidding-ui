'use client';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, HTMLAttributes } from 'react';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const convertBreadcrumb = (string: string): string => {
  // First decode URI components and then replace characters
  const decodedString = decodeURIComponent(string);
  return (
    decodedString
      .replace(/-/g, ' ')
      .replace(/oe/g, 'ö')
      .replace(/ae/g, 'ä')
      .replace(/ue/g, 'ü')
      .charAt(0)
      .toUpperCase() + decodedString.slice(1)
  );
};

interface ICustomBreadcrumbsProps extends HTMLAttributes<HTMLDivElement> {}

const CustomBreadcrumbs: FC<ICustomBreadcrumbsProps> = (props) => {
  const pathnames = usePathname()
    .split('/')
    .filter((x) => x);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      {...props}
    >
      <NextLink href="/" passHref>
        <Link component={'p'} underline="hover" color="#2960c5">
          Home
        </Link>
      </NextLink>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return last ? (
          <Typography color="ActiveCaption" key={to}>
            {convertBreadcrumb(value)}
          </Typography>
        ) : (
          <NextLink href={to} passHref key={to}>
            <Link component={'p'} underline="hover" color="#2960c5">
              {convertBreadcrumb(value)}
            </Link>
          </NextLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
