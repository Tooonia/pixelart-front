
import { PixelartItem } from "./pixelart-item";
import { UserModel } from "./user-model";

export class PixelartModel implements PixelartItem {
    id!: number;
    name!: string;
    user!: UserModel;

    constructor(obj?: Partial<PixelartModel>) {
        if(obj) {
            Object.assign(this, obj);
        }
    }
}
