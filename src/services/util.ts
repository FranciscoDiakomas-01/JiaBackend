
export function hasEmpty<T>(object: T): boolean {
    const values: T[] = Object.values(new Object(object));
    let hasEmpltyValue = false
    values.forEach(value => {
        if (!value || value == null || value == undefined || value == "") {
            hasEmpltyValue = true
        }
    })
    return hasEmpltyValue
}


export function hasProprety<T>(object: T, propretis: string[]): boolean {
    const keys = Object.keys(new Object(object))
    let response = false
    if (keys.length != propretis.length) {
        return false

    }
    for (let index = 0; index < propretis.length; ++index){
        if (keys[index] == propretis[index]) {
            response = true
        }else {
            response = false
        }
    }
    return response
}

