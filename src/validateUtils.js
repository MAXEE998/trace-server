import {traceTypes, nodes} from "./constants"

const checkRange = (start, end, max, min) => {
    return start < end && (start <= max && start >= min) && (end <= max && end >= min);
};

const checkNodes = (type, enode, rnode) => {
    if (enode == null || rnode == null)
        return false;
    if (enode === rnode)
        return false;
    if ((type === traceTypes.E || type === traceTypes.B) && enode === nodes[2])
        return false;
    if ((type === traceTypes.R || type === traceTypes.B) && rnode === nodes[2])
        return false;
    return true
}

export {checkRange, checkNodes};