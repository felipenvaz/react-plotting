export const calculateProportion = (outerContainer, { width, height }) => {
    let widthProportion = outerContainer.width / width;
    let heightProportion = outerContainer.height / height;
    let proportion = Math.min(widthProportion, heightProportion);
    return proportion;
};

export const calculateCenterPosition = (outerContainer, container) => {
    let proportion = calculateProportion(outerContainer, container);
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

export const calculateScaledPosition = (outerContainer, rect, scale) => {
    let applyScaleToPos = (zoomAt, pos, dim) => {
        //let dimScale = ((dim * scale) - dim) / 2;
        return zoomAt - (zoomAt - pos) * scale;
    };
    let applyScaleToDim = (dim) => {
        return dim * scale;
    };
    return {
        x: applyScaleToPos(outerContainer.width / 2, rect.x, rect.width),
        y: applyScaleToPos(outerContainer.height / 2, rect.y, rect.height),
        width: applyScaleToDim(rect.width),
        height: applyScaleToDim(rect.height)
    };
};