import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, ReplaySubject, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private readonly validLangs = new Set(['vi-VN', 'en-US']);
  private readonly langKey = 'app-lang';
  private readonly defaultLang = 'en-US';
  private lang = this.defaultLang;
  private initializationPromise?: Promise<void>;
  private readonly langChangedSubject = new ReplaySubject<string>(1);

  readonly langChanged$ = this.langChangedSubject.asObservable();

  constructor(private readonly translate: TranslateService) {}

  getLang(): string {
    return this.lang;
  }

  initialize(): Promise<void> {
    if (this.initializationPromise) return this.initializationPromise;
    const storedLang = localStorage.getItem(this.langKey);
    const requestedLang = storedLang && this.validLangs.has(storedLang) ? storedLang : this.defaultLang;
    this.initializationPromise = this.activate(requestedLang).catch(error => {
      if (requestedLang === this.defaultLang) throw error;
      return this.activate(this.defaultLang);
    });
    return this.initializationPromise;
  }

  async setLang(lang: string): Promise<void> {
    if (!this.validLangs.has(lang)) throw new Error(`Unsupported language: ${lang}`);
    if (lang === this.lang) return;
    await this.activate(lang);
  }

  private async activate(lang: string): Promise<void> {
    await firstValueFrom(this.translate.use(lang).pipe(take(1)));
    this.lang = lang;
    localStorage.setItem(this.langKey, lang);
    document.documentElement.lang = lang === 'vi-VN' ? 'vi' : 'en';
    this.langChangedSubject.next(lang);
  }
}
