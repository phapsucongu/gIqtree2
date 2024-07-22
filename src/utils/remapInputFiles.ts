import map from 'map-obj';
import { Settings } from "../interfaces";

function remap(setting : Settings, overwriteFiles : Map<string, string> = new Map()) {
    let o = map(
        setting,
        (key, value) => {
            if (typeof value === 'string' && overwriteFiles.has(value)) {
                return [key, overwriteFiles.get(value)];
            }

            if (Array.isArray(value)) {
                return [
                    key,
                    value.map(v => (
                        typeof v === 'string'
                        ? overwriteFiles.get(v) || v
                        : v
                    )) as any
                ]
            }

            return [key, value, { shouldRecurse: true }];
        },
        { deep: true }
    )

    return o as Settings;
}

export default remap;