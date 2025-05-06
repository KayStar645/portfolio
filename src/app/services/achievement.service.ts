import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

export interface Achievement {
  label: string;
  name: string;
  role: string;
  team: string;
  result: string;
  address: string;
  time: string;
  image: string;
  type: string;
}

@Injectable({
  providedIn: 'root',
})
export class AchievementsService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'achievement.json';

  private achievementsSubject = new BehaviorSubject<Achievement[]>([]);
  public achievements$ = this.achievementsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadAchievements();
    });

    this.reloadAchievements();
  }

  private async reloadAchievements(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const achievements = await firstValueFrom(this.http.get<Achievement[]>(url));

      if (achievements && Array.isArray(achievements)) {
        this.achievementsSubject.next(achievements);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Achievement');
        this.achievementsSubject.next([]);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Achievement');
      this.achievementsSubject.next([]);
    }
  }
}
