import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';

export interface Skill {
  name: string;
  icon: string;
  url: string;
  is_main: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'skill.json';

  private skillsSubject = new BehaviorSubject<Skill[]>([]);
  public skills$ = this.skillsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadSkills();
    });

    this.reloadSkills();
  }

  private async reloadSkills(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const skills = await this.http.get<Skill[]>(url).toPromise();

      if (skills && Array.isArray(skills)) {
        this.skillsSubject.next(skills);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Skill');
        this.skillsSubject.next([]);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Skill');
      this.skillsSubject.next([]);
    }
  }
}
