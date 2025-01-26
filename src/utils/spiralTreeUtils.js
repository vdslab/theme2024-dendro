// スパイラル生成
export const computeSpiral = (root, target, angle, steps = 100) => {
  const spiral = [];
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const distance = Math.sqrt(dx ** 2 + dy ** 2);
  const initialAngle = Math.atan2(dy, dx);

  for (let t = 0; t <= steps; t++) {
    const progress = t / steps; // 0から1への進行
    const radius = distance * Math.exp(-progress); // 半径を減少させる
    const phi = initialAngle + Math.tan(angle) * progress; // 角度を増加
    const x = root.x + radius * Math.cos(phi);
    const y = root.y + radius * Math.sin(phi);

    spiral.push({ x, y });
  }
  return spiral;
};

// 障害物回避ロジック
export const avoidObstacles = (path, obstacles) => {
  const adjustedPath = [];

  for (let i = 0; i < path.length - 1; i++) {
    const start = path[i];
    const end = path[i + 1];
    let adjustedSegment = [start, end];

    obstacles.forEach(obstacle => {
      if (obstacle.type === 'circle') {
        if (checkCircleIntersection(start, end, obstacle)) {
          adjustedSegment = adjustForCircle(start, end, obstacle);
        }
      } else if (obstacle.type === 'polygon') {
        if (checkPolygonIntersection(start, end, obstacle)) {
          adjustedSegment = adjustForPolygon(start, end, obstacle);
        }
      }
    });

    adjustedPath.push(...adjustedSegment);
  }

  return adjustedPath;
};

// 円形障害物との交差判定
const checkCircleIntersection = (start, end, circle) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const fx = start.x - circle.x;
  const fy = start.y - circle.y;

  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - circle.radius * circle.radius;

  return b * b - 4 * a * c >= 0; // 判定結果
};

// 円形障害物を回避するための補間点を計算
const adjustForCircle = (start, end, circle) => {
  const midPoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  const direction = {
    x: midPoint.x - circle.x,
    y: midPoint.y - circle.y,
  };

  const norm = Math.sqrt(direction.x ** 2 + direction.y ** 2);
  const avoidancePoint = {
    x: midPoint.x + (direction.x / norm) * circle.radius,
    y: midPoint.y + (direction.y / norm) * circle.radius,
  };

  return [start, avoidancePoint, end];
};

// 多角形障害物との交差判定
const checkPolygonIntersection = (start, end, polygon) => 
  polygon.points.some((p1, i) => {
    const p2 = polygon.points[(i + 1) % polygon.points.length];
    return lineSegmentsIntersect(start, end, p1, p2);
  });

// 多角形障害物を回避するための調整
const adjustForPolygon = (start, end, polygon) => {
  const avoidancePoint = polygon.points[0]; // 最初の点にシンプルに移動
  return [start, avoidancePoint, end];
};

// 線分の交差判定
const lineSegmentsIntersect = (p1, p2, q1, q2) => {
  const ccw = (a, b, c) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
  return (
    ccw(p1, q1, q2) !== ccw(p2, q1, q2) && ccw(p1, p2, q1) !== ccw(p1, p2, q2)
  );
};

// メイン関数: スパイラルツリー生成
export const computeSpiralTreeWithObstacles = (root, targets, angle, obstacles) => 
  targets.map(target => {
    // スパイラルを生成
    let spiral = computeSpiral(root, target, angle);

    // 障害物を回避
    spiral = avoidObstacles(spiral, obstacles);

    // 重みを保持して結果に追加
    return {
      path: spiral,
      weight: target.weight, // 重みを保持
    };
  });


