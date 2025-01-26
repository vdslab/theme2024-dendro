// utils/geojsonUtils.js
export const parseGeoJSONToObstacles=(geojson) =>{
  const obstacles = [];
  geojson.features.forEach(feature => {
    if (feature.geometry.type === 'Polygon') {
      const coordinates = feature.geometry.coordinates[0];
      obstacles.push({
        type: 'polygon',
        points: coordinates.map(coord => ({
          x: convertLongitudeToX(coord[0]),
          y: convertLatitudeToY(coord[1])
        }))
      });
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach(polygon => {
        const coordinates = polygon[0];
        obstacles.push({
          type: 'polygon',
          points: coordinates.map(coord => ({
            x: convertLongitudeToX(coord[0]),
            y: convertLatitudeToY(coord[1])
          }))
        });
      });
    }
  });
  return obstacles;
}

function convertLongitudeToX(longitude) {
  const scale = 1000; // 調整可能なスケール値
  return (longitude - 138.0) * scale;
}

function convertLatitudeToY(latitude) {
  const scale = 1000;
  return (latitude - 36.0) * -scale;
}
