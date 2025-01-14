import { Box } from "@mui/material";
import * as d3 from "d3";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export const ZoomableSVG = forwardRef(
  ({ children, width, height, style }, ref) => {
    ZoomableSVG.displayName = "ZoomableSVG";
    const svgRef = useRef();
    const zoomRef = useRef();
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

      zoomRef.current = zoom;
      d3.select(svgRef.current).call(zoom);
    }, []);

    const reset = () => {
      d3.select(svgRef.current)
        .transition()
        .duration(1000)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity.translate(0, 0).scale(1)
        );
    };

    const zoomTo = (x, y, k) => {
      d3.select(svgRef.current)
        .transition()
        .duration(1000)
        .call(
          zoomRef.current.transform,
          d3.zoomIdentity
            .translate(width / 2 - x * k, height / 2 - y * k)
            .scale(k)
        );
    };

    useImperativeHandle(ref, () => ({
      zoomTo,
    }));

    return (
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <svg ref={svgRef} width={width} height={height} style={style}>
          <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
        </svg>
        <button
          onClick={reset}
          style={{
            position: "absolute",
            cursor: "pointer",
          }}
        >
          ズームをリセット
        </button>
      </Box>
    );
  }
);
