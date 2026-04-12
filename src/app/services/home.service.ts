import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface Home {
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'home.json';

  private readonly homeSubject = new BehaviorSubject<Home | null>(null);
  public home$ = this.homeSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadHome();
      });

    void this.reloadHome();
  }

  private async reloadHome(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const home = await this.contentLoader.loadJson<Home>(lang, this.fileName);

      if (home) {
        this.homeSubject.next(home);
      } else {
        this.toast.error('Failed to load home data.', 'Home');
        this.homeSubject.next(null);
      }
    } catch {
      this.toast.error('Failed to load home data.', 'Home');
      this.homeSubject.next(null);
    }
  }
}
