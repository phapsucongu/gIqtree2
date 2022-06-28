export interface TreeSearchSettings {
    enabled?: boolean;
    unsuccessfulIterationsStop?: number;
    pertubationStrength?: number;
    outgroupTaxa?: string;
    constrainedTreeFile?: string;
    referenceTreeFile?: string;
}

export const DefaultUnsuccessfulIterationStop = 100;
export const DefaultPertubationStrength = 0.5;