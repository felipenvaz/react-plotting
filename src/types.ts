import { IElement } from './types/Element';
import { IPosition } from './types/Shapes';

export interface IMouseEvents {
    isDown: boolean;
    dragging: boolean;
    previousPos: IPosition;
    draggedElements?: IElement[];
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