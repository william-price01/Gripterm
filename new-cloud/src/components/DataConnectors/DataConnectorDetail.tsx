import React from "react";
import ResourceDetailCard from "../ResourceDetail";
import { ScrollableContainer } from "../theme/StyledComponents";
interface DataConnectorDetailViewProps {
  data: string;
}

const DataConnectorDetailView: React.FC<DataConnectorDetailViewProps> = ({
  data,
}) => {
  return (
    <ScrollableContainer>
      <ResourceDetailCard
        title="Data Connector Details"
        data={data}
        excludeFields={["data_connector_id"]} // Example of excluding a field
      />
    </ScrollableContainer>
  );
};

export default DataConnectorDetailView;
