import { IContainer, IPosition } from "src/types/Shapes";

export interface IElement extends IPosition {
    imageUrl: string;
    elementScales?: boolean;
}

export interface IRectangleElement extends IElement, IContainer{
}