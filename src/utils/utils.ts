export const setTimeoutAsync = (fn: () => void, delay: number) => {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            fn();
            resolve(true);
        },delay)
    })
}
export const isPromise = (value: any) => { 
    return value && typeof value.then === 'function';
}