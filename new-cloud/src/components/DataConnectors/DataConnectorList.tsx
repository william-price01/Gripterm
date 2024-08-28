import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

interface DataConnectorsListProps {
  data: string;
}

const DataConnectorsList: React.FC<DataConnectorsListProps> = ({ data }) => {
  const lines = data.split("\n").filter((line) => line.trim() !== "");

  return (
    <Paper style={{ maxHeight: "100%", overflow: "auto" }}>
      <List>
        {lines.map((line, index) => {
          if (line.startsWith("Here are your data connectors:")) {
            return (
              <ListItem key={index}>
                <Typography variant="h6">{line}</Typography>
              </ListItem>
            );
          }

          const [key, value] = line.split(":").map((part) => part.trim());
          return (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={key.replace(/^\d+\.\s+\*\*|\*\*$/g, "")}
                  secondary={value}
                />
              </ListItem>
              {index < lines.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default DataConnectorsList;
