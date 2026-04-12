import { Injectable, inject } from '@angular/core';
import { catchError, from, map, of, shareReplay, switchMap } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ContentLoaderService } from './content-loader.service';

export interface ResumePdfLink {
  href: string;
  fileName: string;
}

export interface ResumeContactItem {
  label: string;
  value: string;
  icon: string;
  href?: string;
}

export interface ResumeProfile {
  name: string;
  title: string;
  avatar: string;
  location: string;
  contacts: ResumeContactItem[];
}

export interface ResumeSkillGroup {
  title: string;
  items: string[];
}

export interface ResumeTimelineItem {
  title: string;
  organization: string;
  period: string;
  description?: string;
  details: string[];
}

export interface ResumeSimpleItem {
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
  meta?: string;
}

export interface ResumeLanguage {
  name: string;
  level: string;
}

export interface ResumeContent {
  profile: ResumeProfile;
  summary: string;
  skillGroups: ResumeSkillGroup[];
  experiences: ResumeTimelineItem[];
  education: ResumeSimpleItem[];
  certificates: ResumeSimpleItem[];
  research: ResumeSimpleItem[];
  achievements: ResumeSimpleItem[];
  languages: ResumeLanguage[];
}

@Injectable({
  providedIn: 'root',
})
export class ResumeService {
  private readonly contentLoader = inject(ContentLoaderService);
  private readonly langService = inject(LangService);
  private readonly fileName = 'resume.json';
  private readonly supportedLangs = new Set(['vi-VN', 'en-US']);

  readonly resume$ = this.langService.langChanged$.pipe(
    map(lang => this.normalizeLang(lang)),
    switchMap(lang =>
      from(this.contentLoader.loadJson<ResumeContent>(lang, this.fileName)).pipe(
        catchError(() => of(null)),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getPdfLink(lang = this.langService.getLang()): ResumePdfLink {
    const normalizedLang = this.normalizeLang(lang);
    const assetFileName = `resume-${normalizedLang}.pdf`;
    const fileName = normalizedLang === 'vi-VN'
      ? 'Phạm Tấn Thuận-vi-VN.pdf'
      : 'Pham Tan Thuan-en-US.pdf';

    return {
      href: `assets/files/${assetFileName}`,
      fileName,
    };
  }

  private normalizeLang(lang: string): string {
    return this.supportedLangs.has(lang) ? lang : 'en-US';
  }
}
