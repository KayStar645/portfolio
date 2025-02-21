import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ToastrService } from 'ngx-toastr';

export interface Project {
  label: string;
  icon: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private jsonUrl: string = environment.config.jsonUrl;
  private fileName: string = 'project.json';

  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private langService: LangService,
    private toast: ToastrService,
  ) {
    this.langService.langChanged$.subscribe(() => {
      this.reloadProjects();
    });

    this.reloadProjects();
  }

  private async reloadProjects(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const url = `${this.jsonUrl}/${lang}/${this.fileName}`;
      const projects = await this.http.get<Project[]>(url).toPromise();

      if (projects && Array.isArray(projects)) {
        this.projectsSubject.next(projects);
      } else {
        this.toast.error('Đọc dữ liệu thất bại!', 'Project');
        this.projectsSubject.next([]);
      }
    } catch (error) {
      this.toast.error('Đọc dữ liệu thất bại!', 'Project');
      this.projectsSubject.next([]);
    }
  }
}
