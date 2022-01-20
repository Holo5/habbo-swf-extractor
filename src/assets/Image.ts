import Jimp from 'jimp';

export class Image {
    public constructor(
        private _id: number,
        private _image: Jimp,
    ) {
    }

    get id(): number {
        return this._id;
    }

    get image(): Jimp {
        return this._image;
    }
}