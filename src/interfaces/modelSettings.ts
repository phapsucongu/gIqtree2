import { SequenceType } from "./dataSettings";

export enum AutoMergePartitions {
    Greedy = "greedy",
    RCluster = "rcluster",
    RClusterF = "rclusterf"
}

export enum RHASModel {
    FreeRate = "FreeRate",
    Gamma = "Gamma"
}

export enum StateFrequency {
    EmpiricalFromData = "F",
    MLOptimizedFromData = "FO",
    Equal = "FQ",
    // requires CODON sequence type
    F1x4 = "F1x4",
    F3x4 = "F3x4"
}

export enum SubstitutionModel {
    Auto = 'Auto',
    JC2 = 'JC2',
    GTR2 = 'GTR2',
    JC = 'JC',
    F81 = 'F81',
    HKI = 'HKI',
    TNe = 'TNe',
    TN = 'TN',
    K81 = 'K81',
    K81u = 'K81u',
    TPM2 = 'TPM2',
    TPM2u = 'TPM2u',
    TPM3 = 'TPM3',
    TPM3u = 'TPM3u',
    TIM = 'TIM',
    TIMe = 'TIMe',
    TIM2 = 'TIM2',
    TIM2e = 'TIM2e',
    TIM3 = 'TIM3',
    TIM3e = 'TIM3e',
    TVM = 'TVM',
    TVMe = 'TVMe',
    SYM = 'SYM',
    GTR = 'GTR',
    Blosum62 = 'Blosum62',
    cpREV = 'cpREV',
    Dayhoff = 'Dayhoff',
    DCMut = 'DCMut',
    FLU = 'FLU',
    HIVb = 'HIVb',
    HIVw = 'HIVw',
    JTT = 'JTT',
    JTTDCMut = 'JTTDCMut',
    LG = 'LG',
    mtART = 'mtART',
    mtMAM = 'mtMAM',
    PMB = 'PMB',
    rtREV = 'rtREV',
    VT = 'VT',
    WAG = 'WAG',
    LG4M = 'LG4M',
    LG4X = 'LG4X',
    JTT_CF4 = 'JTT+CF4',
    C10 = 'C10',
    C20 = 'C20',
    EX2 = 'EX2',
    EX3 = 'EX3',
    EHO = 'EHO',
    UL2 = 'UL2',
    UL3 = 'UL3',
    EX_EHO = 'EX_EHO',
    GY = 'GY',
    MG = 'MG',
    MGK = 'MGK',
    GY0K = 'GY0K',
    GY1KTS = 'GY1KTS',
    GY1KTV = 'GY1KTV',
    GY2K = 'GY2K',
    MG1KTS = 'MG1KTS',
    MG1KTV = 'MG1KTV',
    MG2K = 'MG2K',
    KOSI07 = 'KOSI07',
    SCHN05 = 'SCHN05',
    MK = 'MK',
    ORDERED = 'ORDERED',
    GTR20 = 'GTR20'
}

export const AutoMergePartitionsAlgorithms : { type: AutoMergePartitions, name: string }[] = [
    { type: AutoMergePartitions.Greedy, name: 'Greedy' },
    { type: AutoMergePartitions.RCluster, name: 'RCluster' },
    { type: AutoMergePartitions.RClusterF, name: 'RClusterF' },
]

export const SubstitutionModels: { sequenceType: SequenceType, models: SubstitutionModel[] }[] = [
    {
        sequenceType: SequenceType.Binary,
        models: [SubstitutionModel.JC2, SubstitutionModel.GTR2]
    },
    {
        sequenceType: SequenceType.DNA,
        models: [SubstitutionModel.JC, SubstitutionModel.F81, SubstitutionModel.HKI, SubstitutionModel.TNe, SubstitutionModel.TN, SubstitutionModel.K81, SubstitutionModel.K81u, SubstitutionModel.TPM2, SubstitutionModel.TPM2u, SubstitutionModel.TPM3, SubstitutionModel.TPM3u, SubstitutionModel.TIM, SubstitutionModel.TIMe, SubstitutionModel.TIM2, SubstitutionModel.TIM2e, SubstitutionModel.TIM3, SubstitutionModel.TIM3e, SubstitutionModel.TVM, SubstitutionModel.TVMe, SubstitutionModel.SYM, SubstitutionModel.GTR]
    },
    {
        sequenceType: SequenceType.Protein,
        models: [SubstitutionModel.Blosum62, SubstitutionModel.cpREV, SubstitutionModel.Dayhoff, SubstitutionModel.DCMut, SubstitutionModel.FLU, SubstitutionModel.HIVb, SubstitutionModel.HIVw, SubstitutionModel.JTT, SubstitutionModel.JTTDCMut, SubstitutionModel.LG, SubstitutionModel.mtART, SubstitutionModel.mtMAM, SubstitutionModel.PMB, SubstitutionModel.rtREV, SubstitutionModel.VT, SubstitutionModel.WAG, SubstitutionModel.GTR, SubstitutionModel.GTR20]
    },
    {
        sequenceType: SequenceType.DNAToProtein,
        models: [SubstitutionModel.LG4M, SubstitutionModel.LG4X, SubstitutionModel.JTT_CF4, SubstitutionModel.C10, SubstitutionModel.C20, SubstitutionModel.EX2, SubstitutionModel.EX3, SubstitutionModel.EHO, SubstitutionModel.UL2, SubstitutionModel.UL3, SubstitutionModel.EX_EHO]
    },
    {
        sequenceType: SequenceType.Codon,
        models: [SubstitutionModel.GY, SubstitutionModel.MG, SubstitutionModel.MGK, SubstitutionModel.GY0K, SubstitutionModel.GY1KTS, SubstitutionModel.GY1KTV, SubstitutionModel.GY2K, SubstitutionModel.MG1KTS, SubstitutionModel.MG1KTV, SubstitutionModel.MG2K, SubstitutionModel.KOSI07, SubstitutionModel.SCHN05]
    },
    {
        sequenceType: SequenceType.Morphology,
        models: [SubstitutionModel.MK, SubstitutionModel.ORDERED]
    }
]

/**
 * An array of options regarding state frequencies.
 * Each element in the array consists of a list of sequence types,
 * and a list of options that is only valid when the chosen sequence type is in that list.
 *
 * If the list of sequence types is empty, then the corresponding options work for all types.
 * Care should be taken when editing this array, so no options appear twice.
 */
export const StateFrequencies: { validSequenceType: SequenceType[], data: { type: StateFrequency, name: string }[] }[] = [
    {
        validSequenceType: [SequenceType.Codon],
        data: [
            { type: StateFrequency.F1x4, name: "F1x4" },
            { type: StateFrequency.F3x4, name: "F3x4" }
        ]
    },
    {
        validSequenceType: [],
        data: [
            { type: StateFrequency.EmpiricalFromData, name: "Empirical (from data)" },
            { type: StateFrequency.MLOptimizedFromData, name: "ML optimized (from data)" },
            { type: StateFrequency.Equal, name: "Equal" }
        ]
    },
]

export function getAvailableFrequencies(sequenceType?: SequenceType) {
    return StateFrequencies
        .filter(a =>
            !a.validSequenceType.length
            || (sequenceType && a.validSequenceType.includes(sequenceType))
        )
        .flatMap(a => a.data)
}

export const RHASModels : { name: string, type: RHASModel }[] = [
    { name: 'FreeRate', type: RHASModel.FreeRate },
    { name: 'Gamma', type: RHASModel.Gamma },
]

export const DefaultRateCategories = 4;
export interface ModelSettings {
    autoMergePartitions?: AutoMergePartitions;
    proportionOfInvariableSites?: boolean;
    ascertainmentBiasCorrection?: boolean;
    rateCategories?: number;
    stateFrequency?: StateFrequency;
    rhasModel?: RHASModel;
    substitutionModel?: SubstitutionModel;
}