import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

export interface Experience {
  label: string;
  icon: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExperiencesService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'experience.json';

  private experiencesSubject = new BehaviorSubject<Experience[]>([]);
  public experiences$ = this.experiencesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadExperiences();
    });

    this.reloadExperiences();
  }

  private async reloadExperiences(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const experiences = await firstValueFrom(this.http.get<Experience[]>(url));

      if (experiences && Array.isArray(experiences)) {
        this.experiencesSubject.next(experiences);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Experience');
        this.experiencesSubject.next([]);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Experience');
      this.experiencesSubject.next([]);
    }
  }
}
