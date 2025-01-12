import { Box, Button } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export const ZoomableSVG = ({ children, width, height, style }) => {
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    const zoom = d3.zoom().on("zoom", (event) => {
      const { x, y, k } = event.transform;
      setK(k);
      setX(x);
      setY(y);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);

  const reset = () => {
    setK(1);
    setX(0);
    setY(0);
  };

  return (
    <Box>
      <svg ref={svgRef} width={width} height={height} style={style}>
        <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
      </svg>
      <Button onClick={reset}>Reset</Button>
    </Box>
  );
};
