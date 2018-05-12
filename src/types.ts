export interface IPosition {
    x: number;
    y: number;
}

export type MouseEvents = {
    isDown: boolean;
    previousPos: IPosition;
};

export interface IElement {
    imageUrl: string;
    position: IPosition;
    height: number;
    width: number;
    imageScales?: boolean;
}

export interface IContainer {
    height: number;
    width: number;
};

export interface IRectangle extends IContainer {
    x: number;
    y: number;
}

export interface IImage {
    image?: HTMLImageElement;
    loaded?: boolean;
    loading?: boolean;
    url: string;
}

export interface IImageHash {
    [image: string]: IImage;
}