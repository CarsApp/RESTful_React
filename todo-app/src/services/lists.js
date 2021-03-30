import axios from 'axios';
import { Subject } from 'rxjs';
import { INVALID_ID_ERROR_RESPONSE_CODE, LIMIT_LISTS_IN_PAGE, OK_RESPONSE_CODE, UNKNOWN_ERROR_RESPONSE_CODE } from '../constants';

const baseUrl = 'http://localhost:8000';
const listsUrl = baseUrl + '/api/lists/';

const listChangedSubject = new Subject();

export const listChanged = listChangedSubject.asObservable();

export async function getListsByPage(page) {
    const limit = LIMIT_LISTS_IN_PAGE;
    const offset = (limit * page) - limit;
    return await getLists(limit, offset);
}

export async function getLists(limit, offset) {
    let lists = [];
    let url = listsUrl;
    try {
        if (limit !== '') {
            url += '?limit=' + +limit;
            if (offset !== '') {
                url += '&offset=' + +offset;
            }
        }

        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        lists = response.data;
    } catch (error) {
        console.log(error);
    }

    return lists
}


export async function getListById(id) {
    let list = {};
    try {
        const response = await axios.get(`${listsUrl}${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        list = response.data;
    } catch (error) {
        console.log(error);
    }

    const responseCode = list.id !== undefined ? OK_RESPONSE_CODE : INVALID_ID_ERROR_RESPONSE_CODE;

    return { responseCode, list };
}

export async function createList(ListToCreate) {
    try {
        await axios.post(`${listsUrl}`, ListToCreate, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        setTimeout(() => listChangedSubject.next(), 1000);
        return { responseCode: OK_RESPONSE_CODE };
    } catch (error) {
        console.log(error);
        return { responseCode: UNKNOWN_ERROR_RESPONSE_CODE };
    }
}

export async function updateList(ListToUpdate, id) {
    try {
        await axios.put(`${listsUrl}${id}`, ListToUpdate, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        setTimeout(() => listChangedSubject.next(), 1000);
        return { responseCode: OK_RESPONSE_CODE };
    } catch (error) {
        console.log(error);
        return { responseCode: UNKNOWN_ERROR_RESPONSE_CODE };
    }
}

export async function deleteList(id) {
    try {
        await axios.delete(`${listsUrl}${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('Authorization')}`
            }
        });
        setTimeout(() => listChangedSubject.next(), 1000);
        return { responseCode: OK_RESPONSE_CODE };
    } catch (error) {
        console.log(error);
        return { responseCode: UNKNOWN_ERROR_RESPONSE_CODE };
    }
}