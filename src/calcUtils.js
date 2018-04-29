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

export const calculateScaledPosition = (rect, scale) => {
    let applyScaleToPos = (pos, dim) => {
        return pos - ((dim * scale) - dim) / 2;
    };
    let applyScaleToDim = (dim) => {
        return dim * scale;
    };
    return {
        x: applyScaleToPos(rect.x, rect.width),
        y: applyScaleToPos(rect.y, rect.height),
        width: applyScaleToDim(rect.width),
        height: applyScaleToDim(rect.height)
    };
};