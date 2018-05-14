import { IRectangle } from "src/types/Shapes";

export interface IElement {
    imageUrl: string;
    elementScales?: boolean;
}

export interface IRectangleElement extends IElement, IRectangle{
}