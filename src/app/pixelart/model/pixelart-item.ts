import { UserGetItem } from "./user-get-item";
import { UserGetSlimItem } from "./user-get-slim-item";

export interface PixelartItem {

    id: number;
    name: string;
    width: number;
    height: number;
    canvas: number[]; //TODO: az a nev kellett, ami a back-endben van, a Json value!
    user: UserGetItem;
    // TODO: Here to create an eg. 'canvas-item' model too to import here!
}
