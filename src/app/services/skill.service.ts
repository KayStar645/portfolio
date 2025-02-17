import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
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

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
  }

  async getItems(): Promise<Skill[]> {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const skills = await firstValueFrom(this.http.get<Skill[]>(url));

      if (!skills || !Array.isArray(skills)) {
        this.toast.error('Đọc dữ liệu thất bại!', 'Skill');
      }

      return skills;
    }
}
