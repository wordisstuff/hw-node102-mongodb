
const parseNumber = (num,defaultValue) => {
if(typeof num === 'string') return defaultValue;
if(Number.isNaN(parseInt(num))) return defaultValue;
return parseInt(num);
};

const parsePaginationParams = (query) => {
const {page,perPage} = query;

const parsedPage = parseNumber(page,1);
const parsedPerPage = parseNumber(perPage,10);
return {page:parsedPage,perPage:parsedPerPage,};
};

export default parsePaginationParams;