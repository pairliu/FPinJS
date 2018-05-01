const deepFreeze = obj => {
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {    //!Object.isFrozen(obj)可以避免内部某个属性指向了自己，从而形成循环引用
        Object.freeze(obj);
        Object.getOwnPropertyNames(obj).forEach(p => deepFreeze(obj[p]));   //不但要冻结自己，还要冻结每个嵌套的对象。 注意使用getOwnPropertyNames。注意通过propName怎么引用属性值
    }
    return obj;
};

const jsonCopy = obj => JSON.parse(JSON.stringify(obj));

const deepCopy = obj => {
    let aux = obj;                    //如果不是object，就直接赋值返回了，比如function, string这些
    if (obj && typeof obj === 'object') {
        aux = new obj.constructor();
        Object.getOwnPropertyNames(obj).forEach(p => (aux[p] = deepCopy(obj[p])));
    }
    return aux;
};

const getByPath = (arr, obj) => {
    if (arr[0] in obj) {
        return arr.length > 1 ? getByPath(arr.slice(1), obj[arr[0]]) : deepCopy(obj[arr[0]]);
    } else {
        return undefined;
    }
}

const setByPath = (arr, value, obj) => {
    if (!(arr[0] in obj)) {
        obj[arr[0]] =
            arr.length === 1 ? null : Number.isInteger(arr[1]) ? [] : {};
    }
    
    if (arr.length > 1) {
        return setByPath(arr.slice(1), value, obj[arr[0]]);
    } else {
        obj[arr[0]] = value;
        return obj;
    }
};