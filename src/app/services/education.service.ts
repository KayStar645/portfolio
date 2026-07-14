import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, distinctUntilChanged, map, skip } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ContentLoaderService } from './content-loader.service';

export interface Education {
  id: string;
  label: string;
  name: string;
  address: string;
  time: string;
  image: string;
}

export interface EducationCertificate {
  id: string;
  name: string;
  issuer: string;
  time: string;
  result: string;
}

export interface EducationContent {
  education: Education[];
  certificates: EducationCertificate[];
}

@Injectable({ providedIn: 'root' })
export class EducationsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly contentSubject = new BehaviorSubject<EducationContent>({ education: [], certificates: [] });
  readonly content$ = this.contentSubject.asObservable();
  readonly educations$ = this.content$.pipe(map(content => content.education));
  readonly certificates$ = this.content$.pipe(map(content => content.certificates));

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$.pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => void this.reload());
    void this.reload();
  }

  private async reload(): Promise<void> {
    try {
      const content = await this.contentLoader.loadJson<EducationContent>(this.langService.getLang(), 'education.json');
      if (content && Array.isArray(content.education) && Array.isArray(content.certificates)) {
        this.contentSubject.next(content);
      } else {
        throw new Error('Invalid education content');
      }
    } catch {
      this.toast.error('Failed to load education data.', 'Education');
      this.contentSubject.next({ education: [], certificates: [] });
    }
  }
}
