export enum SequenceType {
    DNA = 'DNA',
    Protein = 'AA',
    Codon = 'CODON',
    Binary = 'BIN',
    Morphology = 'MORPH',
    DNAToProtein = 'NT2AA'
}
export const SequenceTypes: { name: string, type: SequenceType }[] = [
    { name: 'DNA', type: SequenceType.DNA },
    { name: 'Protein', type: SequenceType.Protein },
    { name: 'Codon', type: SequenceType.Codon },
    { name: 'Binary', type: SequenceType.Binary },
    { name: 'Morphology', type: SequenceType.Morphology },
    { name: 'DNA-to-protein-translated sequences', type: SequenceType.DNAToProtein }
];

export enum PartitionType {
    EdgeProportional = 'edgeProportional',
    SeparateGeneTrees = 'separateGeneTrees',
    EdgeEqual = 'edgeEqual',
    EdgeUnlinked = 'edgeUnlinked'
}

export const DefaultPartitionType: PartitionType = PartitionType.EdgeProportional;
export const PartitionTypes: { name: string, type: PartitionType }[] = [
    { name: 'Edge-proportional', type: PartitionType.EdgeProportional },
    { name: 'Edge-equal', type: PartitionType.EdgeEqual },
    { name: 'Edge-unlinked', type: PartitionType.EdgeUnlinked },
    { name: 'Separate gene trees', type: PartitionType.SeparateGeneTrees },
]

export interface DataSettings {
    sequenceType: SequenceType | null;
    codonType: Codon | null;
    partitionType: PartitionType | null; // if null, assume default
    alignmentFiles: string[];
    alignmentFolder: string | null;
    partitionFile: string | null;
}

export enum Codon {
    Standard = 1,
    VertebrateMitochondrial,
    YeastMitochondrial,
    MoldProtozoanCoelenterate,
    InvertebrateMitochondrial,
    CiliateDasycladaceanHexamita,
    EchinodermFlatwormMitochondrial = 9,
    EuplotidNuclear,
    BacterialArchaealPlant,
    AlternativeYeastNuclear,
    AscidianMitochondrial,
    AlternativeFlatwormMitochondrial,
    ChlorophyceanMitochondrial = 16,
    TrematodeMitochondrial = 21,
    ScenedesmusObliquusMitochondrial,
    ThraustochytriumMitochondrial,
    PterobranchiaMitochondrial,
    CandidateDivisionSR1
}

export const Codons : { name: string, type: Codon }[] = [
    { name: 'The Standard Code (same as -st CODON)', type: 1 },
    { name: 'The Vertebrate Mitochondrial Code', type: 2 },
    { name: 'The Yeast Mitochondrial Code', type: 3 },
    { name: 'The Mold, Protozoan, and Coelenterate Mitochondrial Code and the Mycoplasma/Spiroplasma Code', type: 4 },
    { name: 'The Invertebrate Mitochondrial Code', type: 5 },
    { name: 'The Ciliate, Dasycladacean and Hexamita Nuclear Code', type: 6 },
    { name: 'The Echinoderm and Flatworm Mitochondrial Code', type: 9 },
    { name: 'The Euplotid Nuclear Code', type: 10 },
    { name: 'The Bacterial, Archaeal and Plant Plastid Code', type: 11 },
    { name: 'The Alternative Yeast Nuclear Code', type: 12 },
    { name: 'The Ascidian Mitochondrial Code', type: 13 },
    { name: 'The Alternative Flatworm Mitochondrial Code', type: 14 },
    { name: 'Chlorophycean Mitochondrial Code', type: 16 },
    { name: 'Trematode Mitochondrial Code', type: 21 },
    { name: 'Scenedesmus obliquus Mitochondrial Code', type: 22 },
    { name: 'Thraustochytrium Mitochondrial Code', type: 23 },
    { name: 'Pterobranchia Mitochondrial Code', type: 24 },
    { name: 'Candidate Division SR1 and Gracilibacteria Code', type: 25 }
]


export function isMultipleGene(setting : DataSettings) {
    let { partitionFile, alignmentFolder, alignmentFiles } = setting;
    return !!(partitionFile || alignmentFolder || (alignmentFiles.length > 1))
}