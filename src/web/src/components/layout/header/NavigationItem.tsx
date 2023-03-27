import React from 'react';

import { Icon } from '@mdi/react';
import {
  Button,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';

import { useRouter } from '@/next/router';

export type NavigationItemProps = {
  id: string;
  visible?: boolean| (() => boolean);
  label?: string;
  icon?: string;
  content?: React.ReactNode;
  items?: NavigationItemProps[];
  onClick?: (options: { router?: ReturnType<typeof useRouter> }) => void;
};

const StyledMenuItemButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  width: '100%',
}));

export default function NavigationItem({
  label,
  icon,
  content,
  items,
  onClick,
}: NavigationItemProps) {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  
  const filteredItems = React.useMemo(() => items?.filter((item) => item.visible instanceof Function ? item.visible() : item.visible), [items]);

  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick ? onClick({ router }) : setAnchorEl(event.currentTarget);
    },
    [router, onClick]
  );

  return (
    <MenuItem>
      {(onClick || (filteredItems && filteredItems.length > 0)) && (
        <StyledMenuItemButton
          onClick={ handleClick }
          startIcon={ icon && <Icon path={ icon } size={ 1 } /> }>
          {label}
        </StyledMenuItemButton>
      )}
      {content && <React.Fragment>{content}</React.Fragment>}
      {filteredItems && filteredItems.length > 0 && (
        <Menu
          anchorEl={ anchorEl }
          open={ open }
          onClose={ handleClose }
          MenuListProps={ { 'aria-labelledby': 'basic-button' } }
          anchorOrigin={ {
            horizontal: 'left',
            vertical: 'bottom',
          } }
          transformOrigin={ {
            horizontal: 'right',
            vertical: 'bottom',
          } }>
          {filteredItems.map((item) => (
            <MenuItem key={ item.id }>
              <StyledMenuItemButton
                onClick={ () => item.onClick?.({ router }) }
                startIcon={ item.icon && <Icon path={ item.icon } size={ 1 } /> }>
                {item.label}
              </StyledMenuItemButton>
            </MenuItem>
          ))}
        </Menu>
      )}
    </MenuItem>
  );
}
