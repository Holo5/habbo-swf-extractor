// @ts-ignore
import * as SWFReader from '@gizeta/swf-reader';
import * as fs from 'fs';
import { Binary } from './assets/Binary';
import { HeaderEnum } from './enums/HeaderEnum';
import { Image } from './assets/Image';
import { Symbol } from './assets/Symbol';

export class HabboSwfExtractor {
    public static async dumpAsset(assetName: string, inputDir: string, outputDir: string): Promise<void> {
        fs.mkdirSync(`${outputDir}/${assetName}`, { recursive: true });

        const swf = SWFReader.readSync(fs.readFileSync(`${inputDir}/${assetName}.swf`));

        const symbols: Symbol[] = swf.tags.find((tag: any) => tag.header.code === HeaderEnum.SYMBOL).symbols.map((symbol: any) => {
            return new Symbol(symbol.id, symbol.name.substr(assetName.length + 1));
        });

        const imageList: Record<number, Image> = {};
        const binaryList: Record<number, Binary> = {};

        for (const tag of swf.tags) {
            if (tag.header.code === HeaderEnum.IMAGE) {
                imageList[tag.characterId] = Image.fromTag(tag);
            }

            if (tag.header.code === HeaderEnum.BINARY) {
                binaryList[tag.data.readUInt16LE()] = Binary.fromTag(tag);
            }
        }

        for (const symbol of symbols) {

            if (imageList[symbol.id] !== undefined) {
                imageList[symbol.id].image.write(`${outputDir}/${assetName}/${symbol.name}.png`);
            }

            if (binaryList[symbol.id] !== undefined) {
                fs.writeFileSync(`${outputDir}/${assetName}/${symbol.name}.xml`, binaryList[symbol.id].data);
            }
        }
    }
}