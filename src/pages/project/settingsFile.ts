import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { defaultSettings, Settings } from '../../interfaces';

const filename = 'settings.json';

export function readSettingsFileSync(projectPath: string) {
    let path = join(projectPath, filename);
    try {
        let result = readFileSync(path, 'utf-8');
        return JSON.parse(result);
    } catch (err) {
        let result = defaultSettings();
        writeFileSync(path, JSON.stringify(result));
        return result;
    }
}

export function writeSettingsFileSync(projectPath: string, setting : Settings) {
    let file = join(projectPath, filename);
    writeFileSync(file, JSON.stringify(setting), {
        encoding: 'utf-8'
    });
}