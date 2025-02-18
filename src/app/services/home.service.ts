import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
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

  private homeSubject = new BehaviorSubject<Home | null>(null);
  public home$ = this.homeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadHome();
    });

    this.reloadHome();
  }

  private async reloadHome(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const home = await this.http.get<Home>(url).toPromise();
      if (home) {
        this.homeSubject.next(home);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Home');
        this.homeSubject.next(null);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Home');
      this.homeSubject.next(null);
    }
  }
}
