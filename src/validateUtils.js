const checkRange = (start, end, max, min) => {
    return start < end && (start <= max && start >= min) && (end <= max && end >= min);
};

export {checkRange};