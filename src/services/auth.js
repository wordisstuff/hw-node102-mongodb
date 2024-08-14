import { UserCollection } from '../db/models/user';

export const registerUser = async payload => {
    return await UserCollection.create(payload);
};
