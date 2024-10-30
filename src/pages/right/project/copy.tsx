import { dirname } from 'path';
import { useContext, useEffect, useState } from 'react';
import useSsh from '../../../hooks/useSsh';
import { NativeContext } from '../../../natives/nativeContext';
import { getInputFolder } from './folder';
import { FileNode } from '../../../interfaces/natives';

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

function listFiles(f: FileNode) {
    let n = [f.path];

    for (let child of f.children ?? []) {
        n.push(
            ...listFiles(child)
        )
    }

    return n;
}

function Copy(
    { files, onReady, path } :
    {
        files: { source: string, destination: string }[],
        onReady?: (copied: Map<string, string>) => void,
        path: string
    }
) {
    let ssh = useSsh();
    let native = useContext(NativeContext);
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
                    await native.directory_create({ path: basedir, host: ssh }, true);
                    await native.file_copy({ path: source, host: '' }, { path: destination, host: ssh });

                    c.set(source, destination);
                }
                setCopied(c);

                let tree = await native.recurse({
                    path: getInputFolder(path),
                    host: ssh
                });
                let f = listFiles(tree);

                // remove unused files
                for (let file of f) {
                    let keep = false;
                    for (let { destination } of files) {
                        if (destination.startsWith(file) || file.startsWith(destination)) {
                            keep = true;
                            break;
                        }
                    }

                    if (!keep) {
                        console.log('Removing', file);
                        await native.rimraf({
                            path: file,
                            host: ssh
                        });
                    }
                }

                onReady?.(c);
            } catch (e) {
                console.log(e);
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