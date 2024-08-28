import React from "react";
import { CardHeader } from "@mui/material";
import {
  StyledCard,
  StyledCardContent,
  StyledList,
  StyledListItem,
  StyledKey,
  StyledValue,
} from "./theme/StyledComponents";

interface ResourceDetailProps {
  title: string;
  data: string;
  excludeFields?: string[];
}

const ResourceDetailCard: React.FC<ResourceDetailProps> = ({
  title,
  data,
  excludeFields = [],
}) => {
  const renderValue = (value: any, indent: number = 0): React.ReactNode => {
    if (value === null) {
      return "null";
    }
    if (typeof value === "object") {
      return (
        <StyledList>
          {Object.entries(value).map(([subKey, subValue]) => (
            <StyledListItem key={subKey} sx={{ pl: indent + 2 }}>
              <StyledKey>{subKey}:</StyledKey>
              <StyledValue>{renderValue(subValue, indent + 2)}</StyledValue>
            </StyledListItem>
          ))}
        </StyledList>
      );
    }
    return value.toString();
  };

  let parsedData: Record<string, any> = {};
  try {
    const cleanedData = data.replace(/```json\n|\n```/g, "").trim();
    parsedData = JSON.parse(cleanedData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return <StyledValue color="error">Error parsing data</StyledValue>;
  }

  return (
    <StyledCard>
      <CardHeader title={title} />
      <StyledCardContent>
        <StyledList>
          {Object.entries(parsedData).map(([key, value]) => {
            if (excludeFields.includes(key)) return null;
            return (
              <StyledListItem key={key}>
                <StyledKey>{key}:</StyledKey>
                <StyledValue>{renderValue(value)}</StyledValue>
              </StyledListItem>
            );
          })}
        </StyledList>
      </StyledCardContent>
    </StyledCard>
  );
};

export default ResourceDetailCard;
