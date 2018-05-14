import { IPosition } from "src/types/Shapes";

export type MouseEvents = {
    isDown: boolean;
    previousPos: IPosition;
};

export interface IImage {
    image?: HTMLImageElement;
    loaded?: boolean;
    loading?: boolean;
    url: string;
}

export interface IImageHash {
    [image: string]: IImage;
}