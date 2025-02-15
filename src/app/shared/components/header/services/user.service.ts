import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { LangService } from '../../../services/lang.service';
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

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
  }

  async getItem(): Promise<User> {
    const lang = this.langService.getLang();
    const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
    const user = await firstValueFrom(this.http.get<User>(url));
    if (!user) {
      this.toast.error('Đọc dữ liệu thất bại!', 'User');
    }
    return user;
  }
}
