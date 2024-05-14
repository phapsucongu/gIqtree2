export interface PhylipData {
    taxa: {
        name: string,
        taxon: string[]
    }[]
}

export function phylipParse(content: string): PhylipData {
    let lines = content.split('\n');

    let [taxaCount] = lines[0].trim().split(' ').map(a => +(a.trim()));
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

    return {
        taxa
    }

}