import { SetOptional } from 'type-fest';
import yargs from 'yargs/yargs';

export function parseCommand(s : string[]) {
    let c = yargs().parserConfiguration({
        "duplicate-arguments-array": false
    }).parse(s);
    let removed = c as SetOptional<typeof c, '_' | '$0'>;

    delete removed._; delete removed.$0;
    return removed;
}