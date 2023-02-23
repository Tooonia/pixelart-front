import { PixelartItem } from "./pixelart-item";

// TODO: FONTOS: itt ugy kell irni a property neveket, ahogy a DB-ben, mert onnan kerem be az infot!!!
export interface UserPrivateItem {
    id: number;
    alias: string;
    user_email: string;
    pixelarts: PixelartItem[];
}
