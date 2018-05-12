export type Position = {
    x: number;
    y: number;
};

export type MouseEvents = {
    isDown: boolean;
    previousPos: Position;
};

export type Element = {
    imageUrl: string;
    position: Position;
    height: number;
    width: number;
    imageScales?: boolean;
};

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