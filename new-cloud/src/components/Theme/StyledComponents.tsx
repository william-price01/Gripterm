import { styled } from "@mui/material/styles";
import { Card, CardContent, List, ListItem, Typography } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: "auto",
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));
export const ScrollableContainer = styled("div")(({ theme }) => ({
  overflow: "auto",
  maxHeight: "100%",
}));
export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const StyledList = styled(List)(({ theme }) => ({
  width: "100%",
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

export const StyledKey = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.secondary,
  marginRight: theme.spacing(1),
}));

export const StyledValue = styled(Typography)(({ theme }) => ({
  wordBreak: "break-word",
}));
