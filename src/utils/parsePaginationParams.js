const parseNumber = (num, defaultValue) => {
    if (typeof num !== 'string') return defaultValue;
    const parsedNumber = parseInt(num);
    if (Number.isNaN(parsedNumber)) return defaultValue;
    return parsedNumber;
};

const parsePaginationParams = query => {
    const { page, perPage } = query;
    return { page: parseNumber(page, 1), perPage: parseNumber(perPage, 10) };
};

export default parsePaginationParams;
