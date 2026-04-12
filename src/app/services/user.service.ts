import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface User {
  name: string;
  avatar: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'user.json';

  private readonly userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadUser();
      });

    void this.reloadUser();
  }

  private async reloadUser(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const user = await this.contentLoader.loadJson<User>(lang, this.fileName);

      if (user) {
        this.userSubject.next(user);
      } else {
        this.toast.error('Failed to load user data.', 'User');
        this.userSubject.next(null);
      }
    } catch {
      this.toast.error('Failed to load user data.', 'User');
      this.userSubject.next(null);
    }
  }
}
