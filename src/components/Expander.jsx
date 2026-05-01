import { useState, useRef } from "react";
import { Box, Paper } from "@mui/material";

function Expander({ topContent, bottomContent }) {
  const containerRef = useRef(null);
  const [topHeight, setTopHeight] = useState(70);

  const handleMouseDown = (e) => {
    e.preventDefault();

    const container = containerRef.current;
    const startY = e.clientY;
    const startHeight = topHeight;

    const onMouseMove = (e) => {
      if (!container) return;

      const delta = e.clientY - startY;
      const containerHeight = container.getBoundingClientRect().height;
      let newHeight = ((startHeight / 100) * containerHeight + delta) / containerHeight * 100;

      // clamp values between 10% and 90%
      if (newHeight < 10) newHeight = 10;
      if (newHeight > 90) newHeight = 90;

      setTopHeight(newHeight);
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <Box ref={containerRef} sx={{ height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" }, display: "flex", flexDirection: "column" }}>

      <Paper
        elevation={2}
        sx={{
          flexBasis: `${topHeight}%`,
          flexGrow: 0,
          flexShrink: 0,
          overflow: "auto",
          bgcolor: "background.default",
          p: "5px",
        }}
      >
        {topContent}
      </Paper>

      <Box
        onMouseDown={handleMouseDown}
        sx={{
          height: "6px",
          bgcolor: "grey.700",
          cursor: "row-resize",
          "&:hover": { bgcolor: "grey.500" },
        }}
      />

      <Paper
        elevation={2}
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "background.paper",
          p: "5px",
        }}
      >
        {bottomContent}
      </Paper>
    </Box>
  );
}

export default Expander;