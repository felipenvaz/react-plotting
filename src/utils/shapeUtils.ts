import {
    IPlottedShape,
    IPosition,
    IRectangle
} from '../types/Shapes';

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

export const isInsideRectangle = (rect: IRectangle, position: IPosition): boolean => {
    return (position.x >= rect.x && position.x <= rect.x + rect.width)
        && (position.y >= rect.y && position.y <= rect.y + rect.height);
};

export const isHoveringPlottedShape = (plottedShape: IPlottedShape, mousePosition: IPosition): boolean => {
    if (isRectangle(plottedShape)) {
        return isInsideRectangle(plottedShape as IRectangle, mousePosition);
    }

    return false;
};