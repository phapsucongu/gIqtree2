import { PhylotreeVisualization } from '@asymme1/phylotree-visualization-demo';
import './treeView.css';
import { useEffect, useState } from 'react';

function TreeView({ file, content }: { file: string, content: string }) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [content]);

    const renderTreeVisualization = () => {
        try {
            return <PhylotreeVisualization input={content} />;
        } catch (error) {
            console.error("Error rendering PhylotreeVisualization:", error);
            setHasError(true);
            return null;
        }
    };

    return (
        <>
            {hasError ? (
                <div className="text-red-700">Render error</div>
            ) : (
                renderTreeVisualization()
            )}
        </>
    );
}

export default TreeView;
