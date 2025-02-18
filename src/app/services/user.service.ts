import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';

export interface User {
  name: string;
  avatar: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'user.json';

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadUser();
    });

    this.reloadUser();
  }

  private async reloadUser(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const user = await this.http.get<User>(url).toPromise();
      if (user) {
        this.userSubject.next(user);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'User');
        this.userSubject.next(null);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'User');
      this.userSubject.next(null);
    }
  }
}
