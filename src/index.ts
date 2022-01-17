import * as fs from 'fs';
import * as path from 'path';
import { HabboSwfExtractor } from './HabboSwfExtractor';

const minimist = require('minimist');

async function main() {
    const argv = minimist(process.argv.slice(2));

    if (!argv.in || !argv.out) {
        console.error('error: missing option "--in" or "--out"');
        return;
    }

    const inputDir = path.resolve(argv.in);
    const outputDir = path.resolve(argv.out);

    for (const fileName of await fs.promises.readdir(inputDir)) {
        if (!fileName.endsWith('.swf')) {
            continue;
        }

        const assetName = fileName.substr(0, fileName.length - 4);

        await HabboSwfExtractor.dumpAsset(assetName, inputDir, outputDir);

        console.log(`extracted: ${fileName}`);
    }
}

main();