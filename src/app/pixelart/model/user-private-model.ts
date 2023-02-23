import { PixelartItemModel } from "./pixelart-item-model";

export class UserPrivateModel {
    // id!: number;
    // alias!: string;
    // user_email!: string;
    // pixelarts!: PixelartItemModel[];
// Constructor signature to be compared to the one in AssoSportive project.
// "public" needs to be added to parameters, so accessible from outside, otherwise:
// "id declared, but its value is never used"!!!
// Property names should be written as in DB!!!
    constructor(
        public id: number,
        public alias: string,
        public user_email: string,
        public pixelarts: PixelartItemModel[]
    ) {}
}
