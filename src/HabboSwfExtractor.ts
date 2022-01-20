// @ts-ignore
import * as SWFReader from '@gizeta/swf-reader';
import * as fs from 'fs';
import { HeaderEnum } from './enums/HeaderEnum';
import { Symbol } from './assets/Symbol';

export class HabboSwfExtractor {
    public static async dumpAsset(assetName: string, inputDir: string, outputDir: string): Promise<void> {
        await fs.promises.mkdir(`${outputDir}/${assetName}`, { recursive: true });

        const swf = SWFReader.readSync(
            fs.readFileSync(`${inputDir}/${assetName}.swf`),
        );

        const symbols = swf.tags.find((tag: any) => tag.header.code === HeaderEnum.SYMBOL).symbols.map((symbol: any) => {
            return new Symbol(symbol.id, symbol.name.substr(assetName.length + 1));
        });

        for (const tag of swf.tags) {
            
        }

        console.log(symbols);
        //
        //
        // const images: Record<number, Jimp> = {};
        // const binaries: Record<number, ArrayBufferView> = {};
        //
        // for (const tag of swf.tags) {
        //     // binary
        //     if (tag.header.code === HeaderEnum.BINARY) {
        //         const symbol = map.find((elm: any) => elm.id === tag.data.readUInt16LE());
        //
        //         if (!symbol) continue;
        //
        //         binaries[tag.data.readUInt16LE()] = tag.data.slice(6);
        //
        //         // fs.writeFileSync(`${outputDir}/${assetName}/${symbol.name}.xml`, tag.data.slice(6));
        //     }
        //
        //     if (tag.header.code === HeaderEnum.IMAGE) {
        //         const symbol = map.find((elm: any) => elm.id === tag.characterId);
        //
        //         if (!symbol) continue;
        //
        //         const image = new Jimp(tag.bitmapWidth, tag.bitmapHeight);
        //         const bitmap = zlib.unzipSync(Buffer.from(tag.zlibBitmapData, 'hex'));
        //
        //         let pos = 0;
        //
        //         for (let y = 0; y < tag.bitmapHeight; y++) {
        //             for (let x = 0; x < tag.bitmapWidth; x++) {
        //                 const a = bitmap.readUInt8(pos++);
        //                 const r = bitmap.readUInt8(pos++);
        //                 const g = bitmap.readUInt8(pos++);
        //                 const b = bitmap.readUInt8(pos++);
        //
        //                 image.setPixelColor(Jimp.rgbaToInt(r, g, b, a), x, y);
        //             }
        //         }
        //
        //         images[tag.characterId] = image;
        //         // await image.writeAsync(`${outputDir}/${assetName}/${symbol.name}.png`);
        //     }
        // }
        //
        // for (const elm of map) {
        //     if (images[elm.id] !== undefined) {
        //         await images[elm.id].write(`${outputDir}/${assetName}/${elm.name}.png`);
        //     }
        //
        //     if (binaries[elm.id] !== undefined) {
        //         await fs.writeFileSync(`${outputDir}/${assetName}/${elm.name}.xml`, binaries[elm.id]);
        //     }
        // }
    }
}