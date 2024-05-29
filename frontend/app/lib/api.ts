import { getToken } from "./auth";
import { RestApiEndPoint } from "./endpoints";


export const linkClientsToCategories = async (clientIdsAndCategoryIds: { clientIds: number[]; categoryIds: number[] }) => {
    const token = await getToken(); // FIXME: 都度呼ぶのではなく、キャッシュしておきたい
    const response = await fetch(RestApiEndPoint.LINK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clientIdsAndCategoryIds),
    });

    if (!response.ok) {
        throw new Error('Failed to link clients to categories');
    }
    return response;
};

export const unlinkClientsFromCategories = async (clientIdsAndCategoryIds: { clientIds: number[]; categoryIds: number[] }) => {
    const token = await getToken(); // FIXME: 都度呼ぶのではなく、キャッシュしておきたい
    const response = await fetch(RestApiEndPoint.UNLINK, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clientIdsAndCategoryIds),
    });

    if (!response.ok) {
        throw new Error('Failed to unlink clients from categories');
    }

    return response;
};