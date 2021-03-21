import axios from 'axios';
import { Subject } from 'rxjs';
import { INVALID_ID_ERROR_RESPONSE_CODE, OK_RESPONSE_CODE, UNKNOWN_ERROR_RESPONSE_CODE } from '../constants';

const baseUrl = 'http://localhost:8000';
const listsUrl = baseUrl + '/api/lists/';
const itemsUrl = baseUrl + '/api/items/';

const itemChangedSubject = new Subject();

export const itemChanged = itemChangedSubject.asObservable();

export async function getItems(listId) {
    let items = [];

    try {
        const response = await axios.get(`${listsUrl}${listId}/items/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        items = response.data;
    } catch (error) {
        console.log(error);
    }

    return items
}


export async function getItemById(itemId) {
    let item = {};
    try {
        const response = await axios.get(`${itemsUrl}${itemId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        item = response.data;
    } catch (error) {
        console.log(error);
    }

    const responseCode = item.id !== undefined ? OK_RESPONSE_CODE : INVALID_ID_ERROR_RESPONSE_CODE;

    return { responseCode, item: item };
}

export async function createItem(ItemToCreate, listId) {
    try {
        await axios.post(`${listsUrl}${listId}/items/`, ItemToCreate, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        itemChangedSubject.next();
        return { responseCode: OK_RESPONSE_CODE };
    } catch (error) {
        console.log(error);
        return { responseCode: UNKNOWN_ERROR_RESPONSE_CODE };
    }
}

export async function updateItem(ItemToUpdate, itemId) {
    try {
        await axios.put(`${itemsUrl}${itemId}`, ItemToUpdate, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        itemChangedSubject.next();
        return { responseCode: OK_RESPONSE_CODE };
    } catch (error) {
        console.log(error);
        return { responseCode: UNKNOWN_ERROR_RESPONSE_CODE };
    }
}

export async function deleteItem(itemId) {
    try {
        await axios.delete(`${itemsUrl}${itemId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });

        itemChangedSubject.next();
        return { responseCode: OK_RESPONSE_CODE };
    } catch (error) {
        console.log(error);
        return { responseCode: UNKNOWN_ERROR_RESPONSE_CODE };
    }
}