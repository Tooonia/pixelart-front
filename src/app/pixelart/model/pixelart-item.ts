import { UserGetItem } from "./user-get-item";

export interface PixelartItem {

    id: number;
    name: string;
    user: UserGetItem;
    // TODO: Here to create an eg. 'canvas-item' model too to import here!
}
