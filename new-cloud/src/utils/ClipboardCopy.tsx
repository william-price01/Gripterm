import React, { useState, useEffect, PropsWithChildren } from "react";
import clipboardCopy from "clipboard-copy";
import { Copy, Check } from "lucide-react";
import { Box, Typography, Tooltip } from "@mui/material";

export type ClipboardCopyProps = PropsWithChildren<{
  text: string;
}>;

const ClipboardCopy: React.FC<ClipboardCopyProps> = ({ text, children }) => {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, 1000); // 1500ms = 1.5 seconds
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isCopied]);

  const handleCopyClick = () => {
    clipboardCopy(text);
    setIsCopied(true);
  };

  return (
    <Box
      display="flex"
      gap={1}
      sx={{ overflow: "hidden", width: "100%" }}
      alignItems="center"
    >
      {children ?? <Typography noWrap>{text}</Typography>}
      <Tooltip open={isCopied} title="Copied!" placement="top" arrow>
        <Box
          component="button"
          onClick={handleCopyClick}
          aria-label="Copy to clipboard"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            "&:focus": { outline: "none" },
            "&::-moz-focus-inner": { border: 0 },
          }}
        >
          {isCopied ? <Check size={12} color="green" /> : <Copy size={12} />}
        </Box>
      </Tooltip>
    </Box>
  );
};

export default ClipboardCopy;
