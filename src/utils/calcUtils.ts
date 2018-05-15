import { IContainer, IRectangle } from "../types/Shapes";

export const calculateProportion = (outerContainer: IContainer, container: IContainer) => {
    let widthProportion = outerContainer.width / container.width;
    let heightProportion = outerContainer.height / container.height;
    let proportion = Math.min(widthProportion, heightProportion);
    return proportion;
};

export const calculateCenterPosition = (outerContainer: IContainer, container: IContainer, proportion?: number) => {
    if (!proportion) proportion = calculateProportion(outerContainer, container);
    let width = container.width * proportion;
    let height = container.height * proportion;
    let correctPos = (posParent, pos) => {
        return (posParent - pos) / 2;
    }
    return {
        x: correctPos(outerContainer.width, width),
        y: correctPos(outerContainer.height, height),
        width,
        height
    }
};

export const calculateScaledPosition = (outerContainer: IContainer, rect: IRectangle, scale: number) => {
    let applyScaleToPos = (zoomAt: number, pos: number, dim: number): number => {
        return zoomAt - (zoomAt - pos) * scale;
    };
    let applyScaleToDim = (dim: number): number => {
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