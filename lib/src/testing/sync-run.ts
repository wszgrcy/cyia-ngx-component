export function syncRun(fn: Function, time = 0) {
    return syncRunSetTimeout(fn, time)
}

function syncRunSetTimeout(fn: Function, time = 0) {
    return new Promise((res) => {
        setTimeout(() => {
            res(fn())
        }, time);
    })
}