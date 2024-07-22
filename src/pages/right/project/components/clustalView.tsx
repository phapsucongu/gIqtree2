import { useEffect, useState } from "react";
import { clustalToPhylip } from "../../../../utils/clustalParser";
import PhylipView from "./phylipView";

function ClustalView({ content, file } : { content: string, file: string }) {
    let [error, setError] = useState('');
    let [parsed, setParsed] = useState<string>('');

    useEffect(() => {
        try {
            let p = clustalToPhylip(content);

            console.log(p);
            setParsed(p);
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

export default ClustalView