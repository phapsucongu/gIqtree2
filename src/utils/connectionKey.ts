export function connectionKey(host: string, port: number, user: string, pass: string) {
    return `ssh://${user}:${pass}@${host}:${port}`;
}