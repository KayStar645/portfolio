import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';

export interface Home {
  image: string;
  description: string;
}


@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'home.json';

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
  }

  async getItem(): Promise<Home> {
    const lang = this.langService.getLang();
    const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
    const home = await firstValueFrom(this.http.get<Home>(url));
    if (!home) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Home');
    }
    return home;
  }
}
