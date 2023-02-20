import { PixelartItem } from "./pixelart-item";
import { PixelartModel } from "./pixelart-model";
import { UserItem } from "./user-item";

export class UserModel implements UserItem{
    id!: number;
    alias!: string;
    pixelArtList!: PixelartModel[]

    constructor(obj?: Partial<UserModel>) {
        if(obj) {
            Object.assign(this, obj);
        }
    }
}
