import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AppService {

    private baseURL = `https://mongonodeapitest.herokuapp.com/api`;

    constructor(private http: HttpClient) { }

    // getWeatherList(): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.baseURL}/getlist`);
    // }

    registerUser(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/register`, payload);
    }

    loginUser(payload: any): Observable<any> {
        return this.http.post<any>(`${this.baseURL}/login`, payload);
    }
}