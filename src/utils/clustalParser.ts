export function clustalToPhylip(content: string) {
    let lines = content.split('\n');

    let final = new Map<string, string>();

    for (let l of lines) {
        let a = l.trim();

        if (a.startsWith('CLUSTAL W') || a.startsWith('CLUSTALW')) continue;

        if (!a) continue;

        let split = a.split(' ').filter(Boolean);
        if (split.length >= 2) {
            let name = split[0];

            let name_c = new Set(name);
            if (['*', ':', '.', ' '].some(c => name_c.has(c))) {
                continue;
            }

            let content = split[1];

            let c = final.get(name) || '';
            c += content;
            final.set(name, c);
        }
    }

    let max_line = Math.max(...[...final.values()].map(r => r.length));
    let max_name = Math.max(...[...final.keys()].map(r => r.length));

    let output = [`${final.size} ${max_line}`];

    for (let [key, value] of final.entries()) {
        output.push(`${key.padEnd(max_name, ' ')} ${value}`);
    }

    return output.join('\n');
}