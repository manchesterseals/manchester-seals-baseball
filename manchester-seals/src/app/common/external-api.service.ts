import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalApiService {
  private baseUrl = 'http://localhost:8080';
  private requestTimeout = 5000; // 5 second timeout

  constructor(private http: HttpClient) {}

  /**
   * Generic GET request to external REST service
   */
  get<T>(endpoint: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`ExternalApiService: GET ${url}`);
    return this.http.get<T>(url, { params }).pipe(
      timeout(this.requestTimeout)
    );
  }

  /**
   * Generic POST request to external REST service
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`ExternalApiService: POST ${url}`);
    return this.http.post<T>(url, body, { headers }).pipe(
      timeout(this.requestTimeout)
    );
  }

  /**
   * Generic PUT request to external REST service
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`ExternalApiService: PUT ${url}`);
    return this.http.put<T>(url, body, { headers }).pipe(
      timeout(this.requestTimeout)
    );
  }

  /**
   * Generic DELETE request to external REST service
   */
  delete<T>(endpoint: string, params?: HttpParams | { [param: string]: string | string[] }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`ExternalApiService: DELETE ${url}`);
    return this.http.delete<T>(url, { params }).pipe(
      timeout(this.requestTimeout)
    );
  }

  /**
   * Get roster data from external service
   */
  getRoster(): Observable<any> {
    return this.get('/roster');
  }

  /**
   * Get specific data from external service by path
   */
  getData<T>(path: string): Observable<T> {
    return this.get<T>(path);
  }

  /**
   * Post data to external service
   */
  postData<T>(path: string, data: any): Observable<T> {
    return this.post<T>(path, data);
  }
}
