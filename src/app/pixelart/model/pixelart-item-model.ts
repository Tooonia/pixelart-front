import { UserPrivateModel } from "./user-private-model";

export class PixelartItemModel {
    constructor(
        public id: number,
        public name: string,
        public user: UserPrivateModel
    ) {}
}