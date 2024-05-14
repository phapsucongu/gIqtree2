import escape from 'shell-escape';

export function createJobFile(prefix: string, binary: string, args: string[]) {
    let template = `
${prefix}
    ${escape(
        [
            binary,
            ...args
        ]
    )}`;

    return template;
}