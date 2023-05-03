import { PixelartItem } from "./pixelart-item";
import { PixelartSimpleItem } from "./pixelart-simple-item";

// TODO: FONTOS: itt ugy kell irni a property neveket, ahogy a DB-ben, mert onnan kerem be az infot!!!
// VAGY ugy irom, mint a JSON-ben?
export interface UserGetItem {
    id: number;
    alias: string;
    userEmail: string;
    // pixelarts: PixelartSimpleItem[];
    pixelarts: PixelartItem[];
}
