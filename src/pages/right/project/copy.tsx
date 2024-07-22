import { realpathSync } from 'fs';
import { copySync } from 'fs-extra';
import { useEffect, useState } from 'react';
import { sync as rimraf } from 'rimraf';

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
    files = files.filter(a => a.source);
    let [copied, setCopied] = useState<Map<string, string>>(new Map());
    let dupes = listDupes(files.map(v => v.destination));
    let [err, setErr] = useState('');

    useEffect(() => {
        setErr('');
        if (dupes.length) return;

        try {
            let c = new Map<string, string>();

            for (let { source, destination } of files) {
                if (realpathSync(source) !== destination) {
                    rimraf(destination);
                    copySync(source, destination);
                }

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