import { memo, useContext, useEffect, useMemo, useState } from "react"
import { PhylipData, phylipParse } from "../../../../utils/phylipParser";
import './phylipView.css';
import { RightPaneWidthContext } from "../../../../App";
import { VariableSizeGrid as Grid } from 'react-window';

function PhylipView({ content } : { content: string, file: string }) {
    let width = useContext(RightPaneWidthContext);
    let [error, setError] = useState('');
    let [tree, setTree] = useState<PhylipData | null>(null);
    let renderedTree = useMemo(() => {
        if (!tree || !tree.taxa.length) {
            return <></>
        }

        let maxNameLength = Math.max(
            ...tree.taxa.map(r => r.name.length)
        );

        return (
            <Grid
                columnCount={(tree.taxa[0]?.taxon.length ?? 0) + 1}
                // 1rem = 14px
                columnWidth={(index) => index === 0 ? maxNameLength * 14 : 20}
                height={400}
                rowCount={tree.taxa.length}
                rowHeight={() => 20}
                width={width}>
                {({ columnIndex, rowIndex, style }) => {
                    let content = '';
                    let cell = false;

                    if (columnIndex === 0) {
                            content = tree?.taxa[rowIndex].name ?? ' ';
                        } else {
                            content = tree?.taxa[rowIndex]?.taxon[columnIndex - 1] ?? ' ';
                            content = content.toUpperCase();
                            cell = true;
                        }

                    return (
                        <div
                            style={style}
                            className={`${
                                cell
                                    ? `font-mono phylip-${content.toUpperCase()} phylip-cell text-center`
                                    : 'text-left font-bold font-sans'
                            } `}>
                            {content}
                        </div>
                    )
                }}
            </Grid>
        )
    }, [tree, width])

    useEffect(() => {
        try {
            let p = phylipParse(content);
            console.log(p);
            setTree(p);
        } catch (e: any) {
            setError(`${e}`);
        }
    }, [content])

    if (error) {
        return (
            <div>Error: {error}</div>
        )
    }

    return (
        <>
            {renderedTree}
        </>
    )
}

export default memo(PhylipView)