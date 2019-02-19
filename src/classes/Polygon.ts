import * as d3 from 'd3-polygon';
import Point from 'src/types/Point';

export default class Polygon {
    private points: Point[];
    constructor(points: Point[]) {
        this.points = d3.polygonHull(points);
    }

    public getPoints() {
        return this.points;
    }

    public contains(point: Point) {
        return d3.polygonContains(this.points, point);
    }
}