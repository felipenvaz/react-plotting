import { IContainer, IRectangle } from '../types/Shapes';

export const calculateProportion = (outerContainer: IContainer, container: IContainer) => {
    const widthProportion = outerContainer.width / container.width;
    const heightProportion = outerContainer.height / container.height;
    const proportion = Math.min(widthProportion, heightProportion);
    return proportion;
};

export const calculateCenterPosition = (outerContainer: IContainer, container: IContainer, proportion?: number) => {
    if (!proportion) proportion = calculateProportion(outerContainer, container);
    const width = container.width * proportion;
    const height = container.height * proportion;
    const correctPos = (posParent, pos) => {
        return (posParent - pos) / 2;
    };
    return {
        x: correctPos(outerContainer.width, width),
        y: correctPos(outerContainer.height, height),
        width,
        height
    };
};

export const calculateScaledPosition = (outerContainer: IContainer, rect: IRectangle, scale: number) => {
    const applyScaleToPos = (zoomAt: number, pos: number, dim: number): number => {
        return zoomAt - (zoomAt - pos) * scale;
    };
    const applyScaleToDim = (dim: number): number => {
        return dim * scale;
    };
    return {
        x: applyScaleToPos(outerContainer.width / 2, rect.x, rect.width),
        y: applyScaleToPos(outerContainer.height / 2, rect.y, rect.height),
        width: applyScaleToDim(rect.width),
        height: applyScaleToDim(rect.height)
    };
};

export const calculateProportionalDisplacement = (currDisplacement, currDim, nextDim) => {
    if (!currDim || !nextDim) {
        return currDisplacement;
    }
    return (nextDim / currDim) * currDisplacement;
};