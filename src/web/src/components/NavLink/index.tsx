import React from 'react';

import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

type NavLinkProps = {
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeClassName?: any;
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const NavLink = ({
  className,
  activeClassName,
  href,
  children,
  onClick,
}: NavLinkProps) => {
  const router = useRouter();

  return (
    <Link 
      href={ href }
      onClick={ onClick }
      className={ cn(className, { [activeClassName]: router.pathname === href }) }>
      {children}
    </Link>
  );
};

export default NavLink;
