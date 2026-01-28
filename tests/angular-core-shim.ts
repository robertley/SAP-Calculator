export const Injectable = (_config?: unknown) => {
    return (target: any) => target;
};

export class Injector {
    get(): unknown {
        return undefined;
    }
}
