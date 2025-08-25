import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CardStats } from '../../../shared/models/dashboard/cardStats';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCardStats() {
    return this.http.get<CardStats>(this.baseUrl + 'dashboard/card-stats');
  }
  
}
