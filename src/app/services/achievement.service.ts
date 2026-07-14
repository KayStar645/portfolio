import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface Achievement {
  id: string;
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'achievement.json';

  private readonly achievementsSubject = new BehaviorSubject<Achievement[]>([]);
  public achievements$ = this.achievementsSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadAchievements();
      });

    void this.reloadAchievements();
  }

  private async reloadAchievements(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const achievements = await this.contentLoader.loadJson<Achievement[]>(lang, this.fileName);

      if (achievements && Array.isArray(achievements)) {
        this.achievementsSubject.next(achievements);
      } else {
        this.toast.error('Failed to load achievement data.', 'Achievement');
        this.achievementsSubject.next([]);
      }
    } catch {
      this.toast.error('Failed to load achievement data.', 'Achievement');
      this.achievementsSubject.next([]);
    }
  }
}
