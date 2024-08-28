import { IconButton, Menu, MenuItem } from "@mui/material";
import { MoreVertical } from "lucide-react";
import * as React from "react";
import { useState } from "react";

export type DropdownMenuProps = {
  menuItems: MenuItemType[];
  selectionModel: string[];
};

export interface MenuItemType {
  label: ((selectedItems: string[]) => string) | string;
  activeOnSelected?: boolean;
  activeOnSelectedSingle?: boolean;
  action?: (selectedItems: string[]) => void;
}

export default function DropdownMenu(props: DropdownMenuProps) {
  // sort options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSort = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    const el = event.currentTarget;
    setAnchorEl(el);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="resource-bulk-actions-button"
        aria-controls="resource-bulk-actions-menu"
        aria-haspopup="true"
        aria-expanded={openSort ? "true" : undefined}
        onClick={handleClickListItem}
        color="secondary"
      >
        <MoreVertical strokeWidth={1} />
      </IconButton>
      <Menu
        id="resource-bulk-actions-menu"
        aria-labelledby="resource-bulk-actions-button"
        anchorEl={anchorEl}
        open={openSort}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {props.menuItems?.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.action?.(props.selectionModel);
              handleClose(); // Close menu after action
            }}
            disabled={
              (item.activeOnSelected && props.selectionModel.length === 0) ||
              (item.activeOnSelectedSingle && props.selectionModel.length !== 1)
            }
          >
            {typeof item.label === "function"
              ? item.label(props.selectionModel)
              : item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
