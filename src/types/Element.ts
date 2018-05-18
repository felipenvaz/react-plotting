import { IContainer, IPosition, ICircle, IPlottedShape, IRectangle } from "src/types/Shapes";

export interface IElement {
    imageUrl?: string;
    color?: string;
    elementScales?: boolean;
    plottedShape: IPlottedShape;
}