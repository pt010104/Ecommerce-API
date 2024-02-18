"use strict"

const removeUndefined = (obj) => {
    Object.keys(obj).forEach(k =>{
        if (obj[k] === null || obj[k] === undefined) {
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjectParser = (obj) => {
    const result = {}
    Object.keys(obj).forEach(k => {
        if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
            const response = updateNestedObjectParser(obj[k])
            Object.keys(response).forEach(a => {
                result[`${k}.${a}`] = response[a]
            })
        }
        else {
            result[k] = obj[k]
        }
    })
    console.log("result2::",result)
    return result
}

module.exports = {removeUndefined, updateNestedObjectParser}