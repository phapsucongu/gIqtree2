import escape from 'shell-escape';

export function createJobFile(jobName: string, threadCount: number, cwd: string, binary: string, args: string[]) {
    let template = `
#!/bin/bash
#
#BSUB -J ${jobName}
#BSUB -n ${threadCount}
#BSUB -R "span[ptile=4]"
#BSUB -q normal
#BSUB -e %J.err
#BSUB -o %J.out
    ${escape(
        [
            binary,
            ...args
        ]
    )}`;

    return template;
}