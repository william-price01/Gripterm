import * as React from "react";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import DropdownMenu, { MenuItemType } from "../DropdownMenu";

export type ResourceTableColumn<T> = {
  field: keyof T;
  label: string;
  width?: string;
  cell: (item: T) => JSX.Element | string;
  align?: "left" | "center" | "right";
};

interface ResourceTableProps<T> {
  title: string;
  columns: ResourceTableColumn<T>[];
  data: T[];
  idField: string;
  menuItems?: MenuItemType[];
  selectableRows?: boolean;
  dataLoading?: boolean;
  onPaginationModelChange?: (paginationModel: any) => void;
  paginationModel?: { page: number; pageSize: number };
  paginationMode?: "client" | "server";
  rowCount?: number;
  align?: "left" | "center" | "right";
}

const cellStyle = (align: "left" | "center" | "right" = "left") => ({
  display: "flex",
  alignItems: "center",
  height: "100%",
  justifyContent: align,
});

export function ResourceTable<T extends { [key: string]: any }>({
  title,
  columns,
  data,
  idField,
  menuItems,
  selectableRows = true,
  dataLoading = false,
  onPaginationModelChange,
  paginationModel,
  paginationMode = "client",
  rowCount,
}: ResourceTableProps<T>) {
  const [selectionModel, setSelectionModel] = React.useState<string[]>([]);

  const processColumns: GridColDef[] = columns.map((col) => ({
    field: col.field.toString(),
    headerName: col.label,
    flex: 1,
    sortable: true,
    renderCell: (params: GridRenderCellParams<any>) => (
      <Box sx={cellStyle(col.align || "left")}>{col.cell(params.row)}</Box>
    ),
  }));

  const CustomToolbar = () => (
    <GridToolbarContainer
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        my: 2,
        px: 1,
      }}
    >
      <Typography variant={"h4"}>{title}</Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <GridToolbarQuickFilter sx={{ mb: 0 }} />
        {menuItems && menuItems?.length > 0 && (
          <DropdownMenu menuItems={menuItems} selectionModel={selectionModel} />
        )}
      </Box>
    </GridToolbarContainer>
  );

  return (
    <div>
      <DataGrid
        columns={processColumns}
        checkboxSelection={selectableRows}
        onRowSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel.map((id) => id.toString()));
        }}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        sx={{
          border: "none",
          backgroundColor: "var(--joy-palette-background-surface)",
          fontSize: "inherit",
        }}
        getRowId={(row) => row[idField]}
        autoHeight
        rows={data}
        loading={dataLoading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationMode={paginationMode}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        rowCount={rowCount}
      />
    </div>
  );
}
