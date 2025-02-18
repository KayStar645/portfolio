import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  private readonly validLangs: string[] = ['vi-VN', 'en-US'];
  private readonly langKey = 'app-lang';
  private defaultLang: string = 'en-US';
  private lang: string = this.getLang();

  public langChanged$ = new BehaviorSubject<string>(this.lang);

  constructor(private translate: TranslateService) {
    this.loadLang();
  }

  getLang(): string {
    return localStorage.getItem(this.langKey) || this.defaultLang;
  }

  loadLang(): void {
    const storedLang = localStorage.getItem(this.langKey);
    if (storedLang && this.validLangs.includes(storedLang)) {
      this.lang = storedLang;
    } else {
      this.lang = this.defaultLang;
      localStorage.setItem(this.langKey, this.defaultLang);
    }
    this.translate.use(this.lang);
  }

  setLang(lang: string): void {
    if (this.validLangs.includes(lang)) {
      this.lang = lang;
      localStorage.setItem(this.langKey, lang);
      this.translate.use(lang);

      this.langChanged$.next(lang);
    } else {
      console.error(`Invalid language: ${lang}. Please use 'vi-VN' or 'en-US'.`);
    }
  }
}
