import { IPosition } from "src/types/Shapes";
import { IElement } from "src/types/Element";

export interface IMouseEvents {
    isDown: boolean;
    dragging: boolean;
    previousPos: IPosition;
    draggedElements?: Array<IElement>;
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