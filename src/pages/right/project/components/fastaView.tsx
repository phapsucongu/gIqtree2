import { parseSmallFasta } from '@gmod/indexedfasta';
import { useEffect, useState } from 'react';
import PhylipView from './phylipView';

function FastaView({ content, file } : { content: string, file: string }) {
    let [error, setError] = useState('');
    let [parsed, setParsed] = useState<string>('1 1\nEmpty A');

    useEffect(() => {
        try {
            let p = parseSmallFasta(content);

            let maxGeneLength = Math.max(...p.map(r => r.sequence.length));

            let maxNameLength = Math.max(...p.map(r => r.id.length));

            let reworkedPhylip = `${p.length} ${maxGeneLength}\n`;
            for (let l of p) {
                let line = `${l.id.padEnd(maxNameLength, ' ')} ${l.sequence}`;
                reworkedPhylip += line + '\n';
            }

            setParsed(reworkedPhylip);
            setError('');
        } catch (e) {
            setError(`${e}`);
        }
    }, [content]);

    if (error) {
        return (
            <div>Error: {error}</div>
        )
    }

    return <PhylipView file={file} content={parsed} />
}

export default FastaView;