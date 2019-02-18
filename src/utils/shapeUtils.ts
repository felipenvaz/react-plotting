import { IPlottedShape, IRectangle, IPosition, ICircle } from '../types/Shapes';

const circleSample: ICircle = { x: 0, y: 0, radius: 0 };
const rectangleSample: IRectangle = { x: 0, y: 0, height: 0, width: 0 };

const isShape = <T>(plottedShape: T, sample: T): boolean => {

    for (const prop in sample) {
        if (typeof plottedShape[prop] === 'undefined') return false;
    }

    return true;
};

export const isRectangle = (plottedShape: IPlottedShape): boolean => {
    return isShape<IRectangle>(plottedShape as IRectangle, rectangleSample);
};

export const isCircle = (plottedShape: IPlottedShape): boolean => {
    return isShape<ICircle>(plottedShape as ICircle, circleSample);
};

export const isInsideRectangle = (rect: IRectangle, position: IPosition): boolean => {
    return (position.x >= rect.x && position.x <= rect.x + rect.width)
        && (position.y >= rect.y && position.y <= rect.y + rect.height);
};

export const isInsideCircle = (circle: ICircle, position: IPosition): boolean => {
    return Math.pow(position.x - circle.x, 2) + Math.pow(position.y - circle.y, 2) < Math.pow(circle.radius, 2);
};

export const isHoveringPlottedShape = (plottedShape: IPlottedShape, mousePosition: IPosition): boolean => {
    if (isCircle(plottedShape)) {
        return false;
    }
    if (isRectangle(plottedShape)) {
        return isInsideRectangle(plottedShape as IRectangle, mousePosition);
    }

    return false;
};