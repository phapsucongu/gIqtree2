import { copyFileSync } from 'fs';
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

function Copy({ files, onReady } : { files: { source: string, destination: string }[], onReady?: () => void }) {
    let [copied, setCopied] = useState<string[]>([]);
    let dupes = listDupes(files.map(v => v.destination));

    useEffect(() => {
        if (dupes.length) return;

        for (let { source, destination } of files) {
            rimraf(destination);
            copyFileSync(source, destination);
            setCopied([...copied, destination]);
        }
        onReady?.();
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
                        className={copied ? 'bg-green-200' : ''}
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