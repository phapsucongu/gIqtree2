export interface TreeSearchSettings {
    enabled: boolean;
    unsuccessfulIterationsStop: number | null;
    pertubationStrength: number | null;
    outgroupTaxa: string | null;
    constrainedTreeFile?: string;
    referenceTreeFile?: string;
}

export const DefaultUnsuccessfulIterationStop = 100;
export const DefaultPertubationStrength = 0.5;