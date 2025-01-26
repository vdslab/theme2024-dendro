export const drawObstacles=(svg, obstacles) =>{
  svg.selectAll("circle.obstacle")
    .data(obstacles.filter(d => d.type === "circle"))
    .join("circle")
    .attr("class", "obstacle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.radius)
    .attr("fill", "rgba(255, 255, 255, 0.3)");

  svg.selectAll("polygon.obstacle")
    .data(obstacles.filter(d => d.type === "polygon"))
    .join("polygon")
    .attr("class", "obstacle")
    .attr("points", d => d.points.map(p => `${p.x},${p.y}`).join(" "))
    .attr("fill", "rgba(255, 255, 255, 0.3)");
}
