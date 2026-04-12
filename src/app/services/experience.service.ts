import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface Experience {
  id: number;
  title: string;
  company: string;
  time: string;
  location: string;
  type: string;
  status: 'current' | 'completed' | string;
  description: string;
  responsibilities: string[];
  technologies: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ExperiencesService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'experience.json';

  private readonly experiencesSubject = new BehaviorSubject<Experience[]>([]);
  public experiences$ = this.experiencesSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadExperiences();
      });

    void this.reloadExperiences();
  }

  private async reloadExperiences(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const experiences = await this.contentLoader.loadJson<Experience[]>(lang, this.fileName);

      if (experiences && Array.isArray(experiences)) {
        this.experiencesSubject.next(experiences);
      } else {
        this.toast.error('Failed to load experience data.', 'Experience');
        this.experiencesSubject.next([]);
      }
    } catch {
      this.toast.error('Failed to load experience data.', 'Experience');
      this.experiencesSubject.next([]);
    }
  }
}
