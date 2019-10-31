export function classClone(object) {
    if (!object) return
    for (const key in object) {
        if (!object.hasOwnProperty(key)) continue
        this[key] = object[key]
    }
}