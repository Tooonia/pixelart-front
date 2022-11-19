
import { PixelartItem } from "./pixelart-item";

export class PixelartModel implements PixelartItem {
    id!: number;
    name!: string;

    constructor(obj?: Partial<PixelartModel>) {
        if(obj) {
            Object.assign(this, obj);
        }
    }
}
