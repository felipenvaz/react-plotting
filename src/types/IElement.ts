import { IRectangle } from './Shapes';

export interface IElement {
    imageUrl?: string;
    color?: string;
    elementScales?: boolean;
    plottedShape: IRectangle;
}