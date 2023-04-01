import React from 'react';

import { Icon } from '@mdi/react';
import {
  Button,
  List,
  MenuItem,
  styled,
} from '@mui/material';

export type NavigationItemProps = {
  id: string;
  visible?: boolean| (() => boolean);
  label?: string;
  icon?: string;
  content?: React.ReactNode;
  items?: NavigationItemProps[];
  onClick?: () => void;
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
  
  const filteredItems = React.useMemo(() => items?.filter((item) => item.visible instanceof Function ? item.visible() : item.visible), [items]);
  const [showChildren, setShowChildren] = React.useState(false);

  return (
    <MenuItem>
      <StyledMenuItemButton
        onClick={ () => onClick?.() }
        onMouseOver={ () => setShowChildren(true) }
        onMouseLeave={ () => setShowChildren(false) }
        startIcon={ icon && <Icon path={ icon } size={ 1 } /> }>
        {label}
      </StyledMenuItemButton>
      {content && <React.Fragment>{content}</React.Fragment>}
      {showChildren && filteredItems && filteredItems.length > 0 && (
        <List>
          {filteredItems.map((item) => (
            <MenuItem key={ item.id }>
              <StyledMenuItemButton
                onClick={ () => item.onClick?.() }
                startIcon={ item.icon && <Icon path={ item.icon } size={ 1 } /> }>
                {item.label}
              </StyledMenuItemButton>
            </MenuItem>
          ))}
        </List>
      )}
    </MenuItem>
  );
}
