import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface Education {
  label: string;
  name: string;
  address: string;
  time: string;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class EducationsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'education.json';

  private readonly educationsSubject = new BehaviorSubject<Education[]>([]);
  public educations$ = this.educationsSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadEducations();
      });

    void this.reloadEducations();
  }

  private async reloadEducations(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const educations = await this.contentLoader.loadJson<Education[]>(lang, this.fileName);

      if (educations && Array.isArray(educations)) {
        this.educationsSubject.next(educations);
      } else {
        this.toast.error('Failed to load education data.', 'Education');
        this.educationsSubject.next([]);
      }
    } catch {
      this.toast.error('Failed to load education data.', 'Education');
      this.educationsSubject.next([]);
    }
  }
}
