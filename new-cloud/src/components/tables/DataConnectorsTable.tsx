import React, { useEffect } from "react";
import { ResourceTable, ResourceTableColumn } from "./ResourceTable";

interface DataConnector {
  data_connector_id: string;
  name: string;
  created_at: string;
  type: string;
}

interface DataConnectorsViewProps {
  data: string;
}

const DataConnectorsView: React.FC<DataConnectorsViewProps> = ({ data }) => {
  useEffect(() => {
    console.log(data);
  });

  const dataConnectors: DataConnector[] = parseDataConnectorsData(data);

  const columns: ResourceTableColumn<DataConnector>[] = [
    {
      field: "name",
      label: "Name",
      cell: (dataConnector) => dataConnector.name,
    },
    {
      field: "created_at",
      label: "Created",
      cell: (dataConnector) =>
        new Date(dataConnector.created_at).toLocaleString(),
    },
    {
      field: "type",
      label: "Type",
      cell: (dataConnector) => dataConnector.type,
    },
  ];

  return (
    <ResourceTable<DataConnector>
      title="Data Connectors"
      columns={columns}
      data={dataConnectors}
      idField="data_connector_id"
    />
  );
};

export default DataConnectorsView;

function parseDataConnectorsData(data: string): DataConnector[] {
  try {
    const cleanedData = data.replace(/```json\n|\n```/g, "").trim();
    const parsedData = JSON.parse(cleanedData);
    return parsedData.data_connectors.map((dataConnector) => ({
      data_connector_id: dataConnector.data_connector_id,
      name: dataConnector.name,
      created_at: dataConnector.created_at,
      type: dataConnector.type,
    }));
  } catch (e) {
    console.error("Error parsing data connectors data", e);
    return [];
  }
}
