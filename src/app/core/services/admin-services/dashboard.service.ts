import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CardStats } from '../../../shared/models/dashboard/cardStats';
import { MonthlySales } from '../../../shared/models/dashboard/monthlySales';
import { GenresSales } from '../../../shared/models/dashboard/genresSales';
import { RatingDistribution } from '../../../shared/models/dashboard/ratingDistribution';
import { AvatarUsage } from '../../../shared/models/dashboard/avatarUsage';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getCardStats() {
    return this.http.get<CardStats>(this.baseUrl + 'dashboard/card-stats');
  }

  getMonthlySales() {
    const currentYear = new Date().getFullYear();
    return this.http.get<MonthlySales[]>(this.baseUrl + 'dashboard/monthly-sales/' + currentYear);
  }

  getGenresSales() {
    return this.http.get<GenresSales[]>(this.baseUrl + 'dashboard/genres-sales/10');
  }

  getRatingDistribution() {
    return this.http.get<RatingDistribution[]>(this.baseUrl + 'dashboard/review-rating-distribution');
  }

  getAvatarUsage() {
    return this.http.get<AvatarUsage[]>(this.baseUrl + 'dashboard/avatar-usage');
  }
  
}
