import { PixelartItem } from "./pixelart-item";

export interface UserItem {
    id: number;
    alias: string;
    pixelArtList: PixelartItem[];
}
