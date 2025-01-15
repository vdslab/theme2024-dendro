import * as d3 from "d3";

const getLargestPolygon = (polygons) => {
  return polygons.reduce((largest, current) => {
    return d3.polygonArea(current) > d3.polygonArea(largest)
      ? current
      : largest;
  }, polygons[0]);
};

export const calcPrefectureCenter = (geojson) => {
  const results = {};

  geojson.features.forEach((feature) => {
    const polygons = feature.geometry.coordinates.map((rings) => rings[0]);
    const largestPolygon = getLargestPolygon(polygons);
    const [x, y] = d3.polygonCentroid(largestPolygon);
    const id = feature.properties.pref;
    results[id] = { x, y };
  });

  return results;
};
