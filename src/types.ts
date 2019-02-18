import { IPosition } from './types/Shapes';
import { IElement } from './types/Element';

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