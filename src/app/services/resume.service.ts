import { Injectable, inject } from '@angular/core';
import { catchError, from, map, of, shareReplay, switchMap } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import type { Achievement } from './achievement.service';
import { ContentLoaderService } from './content-loader.service';

export interface ResumePdfLink { href: string; fileName: string; }
export interface ResumeContactItem { label: string; value: string; href?: string; }
export interface ResumeProfile { name: string; title: string; avatar: string; location: string; contacts: ResumeContactItem[]; }
export interface ResumeSkillGroup { title: string; items: string[]; }
export interface ResumeTimelineItem { title: string; organization: string; period: string; description?: string; details: string[]; }
export interface ResumeSimpleItem { title: string; subtitle?: string; period?: string; description?: string; meta?: string; }
export interface ResumeLanguage { name: string; level: string; }
export interface ResumeBaseContent {
  profile: ResumeProfile;
  summary: string;
  skillGroups: ResumeSkillGroup[];
  experiences: ResumeTimelineItem[];
  education: ResumeSimpleItem[];
  certificates: ResumeSimpleItem[];
  languages: ResumeLanguage[];
}
export interface ResumeContent extends ResumeBaseContent {
  awards: Achievement[];
  researchProjects: Achievement[];
}

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private readonly contentLoader = inject(ContentLoaderService);
  private readonly langService = inject(LangService);
  private readonly supportedLangs = new Set(['vi-VN', 'en-US']);

  readonly resume$ = this.langService.langChanged$.pipe(
    map(lang => this.normalizeLang(lang)),
    switchMap(lang => from(Promise.all([
      this.contentLoader.loadJson<ResumeBaseContent>(lang, 'resume.json'),
      this.contentLoader.loadJson<Achievement[]>(lang, 'achievement.json'),
    ])).pipe(
      map(([resume, achievements]) => ({
        ...resume,
        awards: achievements.filter(item => item.type === 'prize'),
        researchProjects: achievements.filter(item => item.type === 'science'),
      } satisfies ResumeContent)),
      catchError(() => of(null)),
    )),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  getPdfLink(lang = this.langService.getLang()): ResumePdfLink {
    const normalizedLang = this.normalizeLang(lang);
    return {
      href: `assets/files/resume-${normalizedLang}.pdf`,
      fileName: normalizedLang === 'vi-VN' ? 'Pham-Tan-Thuan-vi-VN.pdf' : 'Pham-Tan-Thuan-en-US.pdf',
    };
  }

  private normalizeLang(lang: string): string { return this.supportedLangs.has(lang) ? lang : 'en-US'; }
}
