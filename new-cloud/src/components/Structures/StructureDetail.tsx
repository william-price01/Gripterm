import React from "react";
import ResourceDetailCard from "../ResourceDetail";
import { ScrollableContainer } from "../theme/StyledComponents";
import ClipboardCopy from "../../utils/ClipboardCopy";
import toGithhubRepoUrl from "../../utils/toGithubURL";
import {
  Grid,
  Box,
  Stack,
  ListItem,
  List,
  ListItemText,
  Typography,
  Card,
} from "@mui/material";
import { Link } from "@mui/material";
import { StructureDetail } from "../../types/ResourceTypes";
interface StructureDetailViewProps {
  data: string;
}

const StructureDetailView: React.FC<StructureDetailViewProps> = ({ data }) => {
  const dataObj = JSON.parse(data);
  const structureData = dataObj.structure as StructureDetail;
  const structureUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    "/api/structures/" +
    structureData.structure_id +
    "/runs";
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Card title="Structure">
          <List sx={{ p: 0.5 }}>
            <ListItem divider>
              <Stack
                direction="column"
                alignItems="flex-start"
                spacing={0.25}
                sx={{ width: "100%" }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Structure Invocation URL
                </Typography>
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <ClipboardCopy text={structureUrl} />
                </Box>
              </Stack>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Repo Owner Username" />
              <Stack direction="row" alignItems="flex-start" spacing={0.75}>
                <Typography>{structureData.code?.github?.owner}</Typography>
              </Stack>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Code Repo" />
              <Stack direction="row" alignItems="flex-start" spacing={0.75}>
                <Link href={toGithhubRepoUrl(structureData)} target="_blank">
                  <Typography>{structureData.code?.github?.name}</Typography>
                </Link>
              </Stack>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="ID" />
              <Stack direction="row" alignItems="flex-start" spacing={0.75}>
                <ClipboardCopy text={structureData.structure_id} />
              </Stack>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Created" />
              <Stack direction="row" alignItems="flex-start" spacing={0.75}>
                <Typography sx={{ display: { xs: "block", sm: "block" } }}>
                  {new Date(structureData.created_at).toLocaleString()}
                </Typography>
              </Stack>
            </ListItem>
            <ListItem divider>
              <ListItemText primary="Updated" />
              <Stack direction="row" alignItems="flex-start" spacing={0.75}>
                <Typography sx={{ display: { xs: "block", sm: "block" } }}>
                  {new Date(structureData.updated_at).toLocaleString()}
                </Typography>
              </Stack>
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StructureDetailView;
