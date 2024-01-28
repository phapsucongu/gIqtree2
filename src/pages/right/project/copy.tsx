import { ipcRenderer } from 'electron-better-ipc';
import { dirname } from 'path';
import { useEffect, useState } from 'react';
import useSsh from '../../../hooks/useSsh';

async function copy(src: string, dst: string, ssh: string = '') {
    if (ssh) {
        return await ipcRenderer.callMain('file_copy_ssh', [src, [ssh, dst]]) as boolean;
    }
    return await ipcRenderer.callMain('file_copy', [src, dst]) as boolean;
}

async function mkdir(path: string, ssh: string = '') {
    if (ssh) {
        let res = await ipcRenderer.callMain('create_directory_ssh', [ssh, path, true]);
        return res;
    }
    return await ipcRenderer.callMain('create_directory', [path, true]);
}

function listDupes(str : string[]) {
    let m = new Map<string, number>();
    for (let s of str) {
        let v = m.get(s) ?? 0;
        m.set(s, v + 1);
    }

    return [...m]
        .filter(v => v[1] > 1)
        .map(p => p[0]);
}

function Copy({ files, onReady } : { files: { source: string, destination: string }[], onReady?: (copied: Map<string, string>) => void }) {
    let ssh = useSsh();
    files = files.filter(a => a.source);
    let [copied, setCopied] = useState<Map<string, string>>(new Map());
    let dupes = listDupes(files.map(v => v.destination));
    let [err, setErr] = useState('');

    useEffect(() => {
        async function c() {
            setErr('');
            if (dupes.length) return;

            try {
                let c = new Map<string, string>();

                for (let { source, destination } of files) {
                    let basedir = dirname(destination);
                    await mkdir(basedir, ssh);
                    await copy(source, destination, ssh);

                    setCopied(
                        c = new Map([
                            ...copied,
                            [source, destination]
                        ])
                    );
                }

                onReady?.(c);
            } catch (e) {
                setErr(`${e}`);
            }
        }

        c();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='px-2'>
            Copying files...
            {!!dupes.length && (
                <div>
                    Conflicting entries found - halting copy.
                </div>
            )}
            {err && (
                <div>
                    Error :
                    <br />
                    {err}
                </div>
            )}
            <table className='w-full'>
                <thead>
                    <tr className='text-left'>
                        <th>Source</th>
                        <th>Destination</th>
                    </tr>
                </thead>
                <tbody>
                {files.map(f => (
                    <tr
                        className={copied.has(f.source) ? 'bg-green-200' : ''}
                        key={f.source + f.destination}>
                        <td className='p-2'>
                            {f.source}
                        </td>
                        <td className='p-2'>
                            {f.destination}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default Copy;