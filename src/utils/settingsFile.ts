import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { Settings } from '../interfaces';
import { getTemplateSettings } from '../templates/index';

const filename = 'settings.json';

export function hasSettingsFileSync(projectPath: string) {
    return existsSync(join(projectPath, filename));
}

export function readSettingsFileSync(projectPath: string) {
    let path = join(projectPath, filename);
    try {
        let result = readFileSync(path, 'utf-8');
        return JSON.parse(result);
    } catch (err) {
        let result = getTemplateSettings();
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