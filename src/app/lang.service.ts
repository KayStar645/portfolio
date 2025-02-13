import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LangService {

  private readonly validLangs: string[] = ['vi-VN', 'en-US'];

  private lang: string = 'vi-VN';

  constructor(
      private translate: TranslateService
    ) {}

  getLang(): string {
    return this.lang;
  }

  setLang(lang: string): void {
    if (this.validLangs.includes(lang)) {
      this.lang = lang;
      this.translate.use(this.lang);
    } else {
      console.error(`Invalid language: ${lang}. Please use 'vi-VN' or 'en-US'.`);
    }
  }
}
