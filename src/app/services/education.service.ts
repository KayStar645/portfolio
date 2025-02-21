import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

export interface Education {
  label: string,
  name: string;
  address: string;
  time: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class EducationsService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'education.json';

  private educationsSubject = new BehaviorSubject<Education[]>([]);
  public educations$ = this.educationsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadEducations();
    });

    this.reloadEducations();
  }

  private async reloadEducations(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const educations = await firstValueFrom(this.http.get<Education[]>(url));

      if (educations && Array.isArray(educations)) {
        this.educationsSubject.next(educations);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Education');
        this.educationsSubject.next([]);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Education');
      this.educationsSubject.next([]);
    }
  }
}
