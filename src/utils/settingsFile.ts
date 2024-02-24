import { join } from 'path';

import { NativeIntegration, Settings } from '../interfaces';
import { getTemplateSettings } from '../templates';
import { File } from '../interfaces/natives';

const filename = 'settings.json';

export class SettingsFile {
    private native: NativeIntegration
    constructor(native: NativeIntegration) {
        this.native = native;
    }

    hasFile(path: File) {
        let r = {...path};
        r.path = join(r.path, filename);
        return this.native.file_exists(r);
    }

    async readFile(path: File) {
        let r = {...path};
        r.path = join(r.path, filename);
        try {
            let l = await this.native.file_exists(r);
            if (!l) {
                throw new Error('create');
            }

            let res = await this.native.file_read_string(r);
            return JSON.parse(res);
        } catch (e) {
            if (e instanceof Error && e.message === 'create') {
                let t = getTemplateSettings();
                await this.native.file_write_string(r, JSON.stringify(t));

                let res = await this.native.file_read_string(r);
                return JSON.parse(res);
            } else {
                throw e;
            }
        }
    }

    async writeFile(path: File, setting: Settings) {
        let r = {...path};
        r.path = join(r.path, filename);
        return this.native.file_write_string(r, JSON.stringify(setting));
    }
}