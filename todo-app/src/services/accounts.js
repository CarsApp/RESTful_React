import axios from 'axios';
import { Subject } from 'rxjs';
import { AUTHENTICATION_ERROR_RESPONSE_CODE, OK_RESPONSE_CODE, UNKNOWN_ERROR_RESPONSE_CODE, USERNAME_VALID_ERROR_RESPONSE_CODE } from '../constants';

const REGISTER_STATUS_OK = 'OK';
const baseUrl = 'http://localhost:8000/auth/';

const isLoggedInChangedSubject = new Subject();
const usernameChangedSubject = new Subject();
const registerSucessedSubject = new Subject();

export const isLoggedInChanged = isLoggedInChangedSubject.asObservable();
export const usernameChanged = usernameChangedSubject.asObservable();
export const registerSucessed = registerSucessedSubject.asObservable();

export async function signIn(username, password) {
    let responseCode = OK_RESPONSE_CODE;
    let token = '';
    try {
        const repsonse = await axios.post(baseUrl + 'sign-in', { username, password });
        token = repsonse.data.token;

        responseCode = token === '' ? AUTHENTICATION_ERROR_RESPONSE_CODE : OK_RESPONSE_CODE;
    } catch (error) {
        console.log(error);
        responseCode = AUTHENTICATION_ERROR_RESPONSE_CODE;
    }

    if (responseCode === OK_RESPONSE_CODE) {
        localStorage.setItem('Username', username);
        usernameChangedSubject.next(username);
        localStorage.setItem('Authorization', token);
        isLoggedInChangedSubject.next(true);
    }

    return { responseCode, token };
}

export async function signUp(name, username, password) {
    let responseCode = OK_RESPONSE_CODE;
    let status = '';
    try {
        const response = await axios.post(baseUrl + 'sign-up', { name, username, password });
        const status = response.statusText;

        responseCode = status === REGISTER_STATUS_OK ? OK_RESPONSE_CODE : AUTHENTICATION_ERROR_RESPONSE_CODE;
    } catch (error) {
        console.log(error)
        responseCode = USERNAME_VALID_ERROR_RESPONSE_CODE;
    }

    registerSucessedSubject.next();
    return { responseCode, status };
}

export async function logout() {
    let responseCode = OK_RESPONSE_CODE;
    try {
        localStorage.removeItem('Username');
        localStorage.removeItem('Authorization');
        usernameChangedSubject.next('');
        isLoggedInChangedSubject.next(false);
    } catch (error) {
        console.log(error)
        responseCode = UNKNOWN_ERROR_RESPONSE_CODE;
    }

    return { responseCode };
}