import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RosterEntry {
  _id?: string;
  name: string;
  position: string;
  number: string;
}

export interface RosterResponse {
  success: boolean;
  data: RosterEntry[];
  count: number;
  filter?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private apiUrl = '/api/roster';

  constructor(private http: HttpClient) {}

  /**
   * Get all roster data from MongoDB
   */
  getAllRoster(): Observable<RosterResponse> {
    return this.http.get<RosterResponse>(this.apiUrl);
  }

  /**
   * Get roster data filtered by position
   */
  getRosterByPosition(position: string): Observable<RosterResponse> {
    return this.http.get<RosterResponse>(`${this.apiUrl}/position/${position}`);
  }

  /**
   * Get roster data filtered by player number
   */
  getRosterByNumber(number: string): Observable<RosterResponse> {
    return this.http.get<RosterResponse>(`${this.apiUrl}/number/${number}`);
  }
}
