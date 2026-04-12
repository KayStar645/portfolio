import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'skill.json';

  private readonly skillsSubject = new BehaviorSubject<Skill[]>([]);
  public skills$ = this.skillsSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadSkills();
      });

    void this.reloadSkills();
  }

  async getItems(is_main: boolean = false): Promise<Skill[]> {
    const lang = this.langService.getLang();
    const skills = await this.contentLoader.loadJson<Skill[]>(lang, this.fileName);

    if (!skills || !Array.isArray(skills)) {
      this.toast.error('Failed to load skill data.', 'Skill');
      return [];
    }

    let filteredSkills = skills.filter(item => item.is_hidden === false);
    if (is_main) {
      filteredSkills = filteredSkills.filter(item => item.is_main === is_main);
    }

    return filteredSkills;
  }

  async getGroupedItems(is_main: boolean = false): Promise<GroupedSkill[]> {
    const skills = await this.getItems(is_main);
    const grouped = skills.reduce((acc: Record<number, GroupedSkill>, skill: Skill) => {
      if (!acc[skill.group_id]) {
        acc[skill.group_id] = {
          group_id: skill.group_id,
          group_name: skill.group_name,
          items: [],
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
      const skills = await this.contentLoader.loadJson<Skill[]>(lang, this.fileName);

      if (skills && Array.isArray(skills)) {
        this.skillsSubject.next(skills);
      } else {
        this.toast.error('Failed to load skill data.', 'Skill');
        this.skillsSubject.next([]);
      }
    } catch {
      this.toast.error('Failed to load skill data.', 'Skill');
      this.skillsSubject.next([]);
    }
  }
}
