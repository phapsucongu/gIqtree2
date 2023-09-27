import { PhylotreeVisualization } from '@asymme1/phylotree-visualization-demo';

function TreeView({ file, content } : { file: string, content: string }) {
    return (
        <>
            <PhylotreeVisualization input={content}>

            </PhylotreeVisualization>
        </>
    )
}

export default TreeView;