export const deepFind = function (obj, path) {
    const p = path.split('.');
    for (let i = 0, len = p.length; i < len; i++) {
        obj = obj[p[i]];
    }

    return obj;
};
