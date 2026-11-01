declare module 'picoc-js' {
  export function runC(cprog: string, consoleWrite?: ((output: string) => void) | null): void;
}
