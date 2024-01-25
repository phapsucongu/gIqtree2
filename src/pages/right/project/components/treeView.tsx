import { PhylotreeVisualization } from '@asymme1/phylotree-visualization-demo';
import './treeView.css';

function TreeView({ file, content } : { file: string, content: string }) {
    return (
        <>
            <PhylotreeVisualization input={content}>

            </PhylotreeVisualization>
        </>
    )
}

export default TreeView;