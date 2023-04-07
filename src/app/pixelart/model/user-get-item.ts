import { PixelartItem } from "./pixelart-item";
import { PixelartSimpleItem } from "./pixelart-simple-item";

// TODO: FONTOS: itt ugy kell irni a property neveket, ahogy a DB-ben, mert onnan kerem be az infot!!!
export interface UserGetItem {
    id: number;
    alias: string;
    user_email: string;
    // pixelarts: PixelartSimpleItem[];
    pixelarts: PixelartItem[];
}
