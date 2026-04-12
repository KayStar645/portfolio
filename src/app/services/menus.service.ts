import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface Menu {
  label: string;
  icon: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'menu.json';

  private readonly menusSubject = new BehaviorSubject<Menu[]>([]);
  public menus$ = this.menusSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadMenus();
      });

    void this.reloadMenus();
  }

  private async reloadMenus(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const menus = await this.contentLoader.loadJson<Menu[]>(lang, this.fileName);

      if (menus && Array.isArray(menus)) {
        this.menusSubject.next(menus);
      } else {
        this.toast.error('Failed to load menu data.', 'Menu');
        this.menusSubject.next([]);
      }
    } catch {
      this.toast.error('Failed to load menu data.', 'Menu');
      this.menusSubject.next([]);
    }
  }
}
