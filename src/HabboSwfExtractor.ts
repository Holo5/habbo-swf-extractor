// @ts-ignore
import * as SWFReader from '@gizeta/swf-reader';
import * as fs from 'fs';
import { HeaderEnum } from './enums/HeaderEnum';
import Jimp from 'jimp';
import zlib from 'zlib';

export class HabboSwfExtractor {
    public static async dumpAsset(assetName: string, inputDir: string, outputDir: string): Promise<void> {
        await fs.promises.mkdir(`${outputDir}/${assetName}`, { recursive: true });

        const swf = SWFReader.readSync(
            await fs.promises.readFile(`${inputDir}/${assetName}.swf`),
        );

        const map = swf.tags.find((tag: any) => tag.header.code === HeaderEnum.SYMBOL).symbols.map((symbol: any) => {
            symbol.name = symbol.name.substr(assetName.length + 1);
            return symbol;
        });

        for (const tag of swf.tags) {
            // binary
            if (tag.header.code === HeaderEnum.BINARY) {
                const symbol = map.find((elm: any) => elm.id === tag.data.readUInt16LE());

                if (!symbol) continue;

                await fs.promises.writeFile(`${outputDir}/${assetName}/${symbol.name}.xml`, tag.data.slice(6));
            }

            if (tag.header.code === HeaderEnum.IMAGE) {
                const symbol = map.find((elm: any) => elm.id === tag.characterId);

                if (!symbol) continue;

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

                await image.writeAsync(`${outputDir}/${assetName}/${symbol.name}.png`);
            }
        }
    }
}