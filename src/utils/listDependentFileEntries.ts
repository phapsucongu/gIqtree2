import { Settings } from "../interfaces";

function listDependentFileEntries(setting? : Settings | null) {
    return [
        ...(setting?.data?.alignmentFiles ?? []),
        setting?.data?.alignmentFolder,
        setting?.data?.partitionFile,
        setting?.dating?.dateFile,
        setting?.treeSearch?.referenceTreeFile,
        setting?.treeSearch?.constrainedTreeFile
    ]
        .filter(s => s !== undefined) as string[];
}

export default listDependentFileEntries;