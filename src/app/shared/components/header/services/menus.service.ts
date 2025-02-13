import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LangService } from '../../../../lang.service';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export interface Menu {
  label: string;
  icon: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenusService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'menu.json';

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
  }



  async getItems(): Promise<Menu[]> {
    const lang = this.langService.getLang();
    const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
    const menus = await firstValueFrom(this.http.get<Menu[]>(url));

    if (!menus || !Array.isArray(menus)) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Menu');
    }

    return menus;
  }
}

