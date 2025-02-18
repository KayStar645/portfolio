import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
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

  private menusSubject = new BehaviorSubject<Menu[]>([]);
  public menus$ = this.menusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadMenus();
    });

    this.reloadMenus();
  }

  private async reloadMenus(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const menus = await this.http.get<Menu[]>(url).toPromise();

      if (menus && Array.isArray(menus)) {
        this.menusSubject.next(menus);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Menu');
        this.menusSubject.next([]);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Menu');
      this.menusSubject.next([]);
    }
  }
}
