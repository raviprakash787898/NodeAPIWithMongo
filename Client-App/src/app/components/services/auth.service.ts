import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    constructor(private http: HttpClient) { }

    setLocalStorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    getLocalStorage(key: string) {
        return JSON.parse(localStorage.getItem(key));
    }

    removeLocalStorage(key: string) {
        return localStorage.removeItem(key);
    }
}