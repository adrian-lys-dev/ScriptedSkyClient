import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserStat } from '../../shared/models/user/userStat';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getUserStat() {
    return this.http.get<UserStat>(this.baseUrl + 'userprofile/stats');
  }

}
