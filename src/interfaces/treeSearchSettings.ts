export interface TreeSearchSettings {
    enabled: boolean;
    unsuccessfulIterationsStop: number | null;
    pertubationStrength: number | null;
    outgroupTaxa: string | null;
    constrainedTreeFile: string | null;
    referenceTreeFile: string | null;
}

export const DefaultUnsuccessfulIterationStop = 100;
export const DefaultPertubationStrength = 0.5;