"use strict";
// ! PROMISE CONSTUCTOR?
exports.__esModule = true;
var genTerm = new Promise(function (resolve, reject) {
    var str = "var x, y, z, u: integer;", reg = /^var\s+/ig;
    str.replace(/^\s*/, '');
    var regExpResultArr = str.match(reg);
    var resolveData = regExpResultArr == null ? null : {
        result: regExpResultArr[0],
        input: str.replace(regExpResultArr[0], '')
    };
    resolve(resolveData);
    reject(new Error('error'));
}), functor = new Promise(function (resolve, reject) {
    var parser = genTerm, func = function (value) {
        return {
            result: 'Var',
            input: value.input
        };
    };
    parser.then(function (value) {
        var resolveData = value == null ? null : func(value);
        resolve(resolveData);
    });
});
exports["default"] = {
    genTerm: genTerm,
    functor: functor
};
