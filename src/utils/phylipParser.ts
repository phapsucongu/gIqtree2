export interface PhylipData {
    max: string[];
    taxa: {
        name: string,
        taxon: string[]
    }[]
}

export function phylipParse(content: string): PhylipData {
    let lines = content.split('\n');

    let [taxaCount, taxaLength] = lines[0].trim().split(' ').map(a => +(a.trim()));
    let taxa = lines.slice(1).slice(0, taxaCount)
        .map(line => {
            let pieces = line.trim().split(' ');
            let name = pieces[0];
            let taxon = pieces.pop()!.split('');
            return {
                name,
                taxon
            }
        });

    let max = new Array<string>(taxaLength).fill('');

    for (let column = 0; column < taxaLength; column++) {
        let m = new Map<string, number>();
        for (let { taxon } of taxa) {
            let at = taxon[column].toLowerCase();
            if (at) {
                let v = m.get(at) ?? 0;
                m.set(at, v + 1);
            }
        }

        let mostOccurence = [...m.entries()].sort((a, b) => a[1] - b[1]).pop()![0];

        max[column] = mostOccurence;
    }

    return {
        max,
        taxa
    }

}