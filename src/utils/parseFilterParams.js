const parseIsFavourite = favourite => {
    const isString = typeof favourite === 'string';
    if (!isString) return;

    const parsedFavourite = favourite => ['true', 'false'].includes(favourite);
    if (parsedFavourite(favourite)) return favourite;
};

const parseType = type => {
    const isString = typeof type === 'string';
    if (!isString) return;

    const parsedType = type => ['work', 'personal', 'home'].includes(type);
    if (parsedType(type)) return type;
};

const parseFilterParams = query => {
    const { isFavourite, contactType } = query;

    const parsedFavourite = parseIsFavourite(isFavourite);
    const parsedType = parseType(contactType);

    return {
        isFavourite: parsedFavourite,
        contactType: parsedType,
    };
};

export default parseFilterParams;
