var controller = {};

controller.evaluatePath = function (document, keyPath) {
    if (!document) { return null; }
    var indexOfDot = keyPath.indexOf('.');

    // If there is a '.' in the keyPath and keyPath doesn't present in the document, recur on the subdoc and ...
    if (indexOfDot >= 0 && !document[keyPath]) {
        var currentKey = keyPath.slice(0, indexOfDot),
            remainingKeyPath = keyPath.slice(indexOfDot + 1);

        return controller.evaluatePath(document[currentKey], remainingKeyPath);
    }

    return document[keyPath];
};

controller.setPath = function (document, keyPath, value) {
    if (!document) { throw new Error('No document was provided.'); }

    var indexOfDot = keyPath.indexOf('.');

    // If there is a '.' in the keyPath, recur on the subdoc and ...
    if (indexOfDot >= 0) {
        var currentKey = keyPath.slice(0, indexOfDot),
            remainingKeyPath = keyPath.slice(indexOfDot + 1);

        if (!document[currentKey]) { document[currentKey] = {}; }
        controller.setPath(document[currentKey], remainingKeyPath, value);
    } else {
        document[keyPath] = value;
    }

    return document;
};

module.exports = controller;
