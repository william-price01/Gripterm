import React, { useEffect } from "react";
import { ResourceTable, ResourceTableColumn } from "./ResourceTable";
import { StructureDetail } from "../../types/ResourceTypes";

interface StructuresViewProps {
  data: string;
}

const StructuresView: React.FC<StructuresViewProps> = ({ data }) => {
  // Parse the data string into an array of Structure objects
  const dataObj = JSON.parse(data);
  const structures: StructureDetail[] = dataObj.structures;
  const columns: ResourceTableColumn<StructureDetail>[] = [
    {
      field: "name",
      label: "Name",
      cell: ({ name }) => name,
    },
    {
      field: "created_at",
      label: "Created",
      cell: ({ created_at }) => new Date(created_at).toLocaleString(),
    },
    {
      field: "structure_id",
      label: "ID",
      cell: ({ structure_id }) => structure_id,
    },
  ];

  return (
    <ResourceTable<StructureDetail>
      title="Structures"
      columns={columns}
      data={structures}
      idField="structure_id"
    />
  );
};

export default StructuresView;
