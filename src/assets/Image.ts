import * as zlib from 'zlib';
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

    static fromTag(tag: any) {
        const image = new Jimp(tag.bitmapWidth, tag.bitmapHeight);
        const bitmap = zlib.unzipSync(Buffer.from(tag.zlibBitmapData, 'hex'));

        let pos = 0;
        for (let y = 0; y < tag.bitmapHeight; y++) {
            for (let x = 0; x < tag.bitmapWidth; x++) {
                const a = bitmap.readUInt8(pos++);
                const r = bitmap.readUInt8(pos++);
                const g = bitmap.readUInt8(pos++);
                const b = bitmap.readUInt8(pos++);

                image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
            }
        }

        return new Image(tag.characterId, image);
    }
}