import { IPlottedShape } from './Shapes';

export interface IElement {
    imageUrl?: string;
    color?: string;
    elementScales?: boolean;
    plottedShape: IPlottedShape;
}