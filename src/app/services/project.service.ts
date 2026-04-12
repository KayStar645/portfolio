import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';

export interface Project {
  label: string;
  icon: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileName = 'project.json';

  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.reloadProjects();
      });

    void this.reloadProjects();
  }

  private async reloadProjects(): Promise<void> {
    try {
      const lang = this.langService.getLang();
      const projects = await this.contentLoader.loadJson<Project[]>(lang, this.fileName);

      if (projects && Array.isArray(projects)) {
        this.projectsSubject.next(projects);
      } else {
        this.toast.error('Failed to load project data.', 'Project');
        this.projectsSubject.next([]);
      }
    } catch {
      this.toast.error('Failed to load project data.', 'Project');
      this.projectsSubject.next([]);
    }
  }
}
