export enum BootstrapMethod {
    UltraFastBootstrap = "ufboot",
    Standard = "standard"
}

export enum MultiPartitionSamplingStrategy {
    Sites = "SITE",
    Partitions = "GENE",
    PartitionsThenSites = "GENESITE"
}

export enum SingleBranchTest {
    Parametric_aLRT = "parametric_aLRT",
    SH_aLRT = "SH_aLRT",
    ABayes = "aBayes",
    LocalBootstrap = "localBootstrap"
}

export const BootstrapMethods: { name: string, type: BootstrapMethod }[] = [
    { name: 'Standard', type: BootstrapMethod.Standard },
    { name: 'UFBoot', type: BootstrapMethod.UltraFastBootstrap }
];

export const SingleBranchTests: { name: string, type: SingleBranchTest }[][] = [
    [
        { name: 'Parametric aLRT test', type: SingleBranchTest.Parametric_aLRT },
        { name: 'SH-like aLRT test', type: SingleBranchTest.SH_aLRT }
    ],
    [
        { name: 'aBayes test', type: SingleBranchTest.ABayes }
    ],
    [
        { name: 'Local bootstrap test', type: SingleBranchTest.LocalBootstrap }
    ]
]

export const MultiPartitionSamplingStrategies: { name: string, type: MultiPartitionSamplingStrategy }[] = [
    { name: 'Resample sites within partitions', type: MultiPartitionSamplingStrategy.Sites },
    { name: 'Resample partitions', type: MultiPartitionSamplingStrategy.Partitions },
    { name: 'Resample partitions and then sites', type: MultiPartitionSamplingStrategy.PartitionsThenSites }
]

export const DefaultBootstrapMethodReplicate = 1000;
export const DefaultALRTReplicate = 1000;
export const DefaultLocalBootstrapReplicate = 1000;
export const DefaultMultiPartitionSamplingStrategy = MultiPartitionSamplingStrategy.Sites;



export interface AssessmentSettings {
    ufbootOption?: boolean;
    bootstrapMethod?: BootstrapMethod;
    bootstrapMethodReplicate?: number;
    multiPartitionSamplingStrategy?: MultiPartitionSamplingStrategy;
    singleBranchTests?: SingleBranchTest[];
    approximateLikelihoodReplicate?: number;
    localBootstrapReplicate?: number;
    // treefile for gcf
    speciesTree?: string;

    gcf?: {
        enabled?: boolean;
        geneTree?: string;
    }

    scf?: {
        quartet?: number;
    }
}