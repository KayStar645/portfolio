import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentLoaderService {
  private readonly jsonUrl = environment.config.jsonUrl;

  constructor(private readonly http: HttpClient) {}

  resolveUrl(lang: string, fileName: string): string {
    return `${this.jsonUrl}/${lang}/${fileName}`;
  }

  async loadJson<T>(lang: string, fileName: string): Promise<T> {
    return firstValueFrom(this.http.get<T>(this.resolveUrl(lang, fileName)));
  }
}
