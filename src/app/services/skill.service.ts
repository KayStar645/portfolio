import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

export interface Skill {
  group_id: number;
  group_name: string;
  name: string;
  icon: string;
  url: string;
  is_main: boolean;
  is_hidden: boolean;
}

export interface GroupedSkill {
  group_id: number;
  group_name: string;
  items: Skill[];
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

  async getItems(is_main: boolean = false): Promise<Skill[]> {
    const lang = this.langService.getLang();
    const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
    let skills = await firstValueFrom(this.http.get<Skill[]>(url));

    if (!skills || !Array.isArray(skills)) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Skill');
      return [];
    }

    if (is_main)
      skills = skills.filter(item => item.is_main === is_main);
    skills = skills.filter(item => item.is_hidden === false);
    return skills;
  }

  async getGroupedItems(is_main: boolean = false): Promise<GroupedSkill[]> {
    const skills = await this.getItems(is_main);
    const grouped = skills.reduce((acc: Record<number, GroupedSkill>, skill: Skill) => {
      if (!acc[skill.group_id]) {
        acc[skill.group_id] = {
          group_id: skill.group_id,
          group_name: skill.group_name,
          items: []
        };
      }
      acc[skill.group_id].items.push(skill);
      return acc;
    }, {} as Record<number, GroupedSkill>);

    return Object.values(grouped);
  }

  private async reloadSkills(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const skills = await firstValueFrom(this.http.get<Skill[]>(url));

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
