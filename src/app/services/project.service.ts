import { DestroyRef, Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, skip } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { LangService } from '../shared/services/lang.service';
import { ContentLoaderService } from './content-loader.service';

export interface ProjectFact { label: string; value: string; }
export interface ProjectProblem { context: string; statement: string; constraints: string[]; }
export interface ProjectProcessStep { title: string; description: string; }
export interface ProjectDecision { title: string; rationale: string; tradeOff: string; practices: string[]; }
export interface ProjectSolutionGroup { title: string; description: string; deliverables: string[]; }
export interface ProjectOutcome { title: string; description: string; }
export interface ProjectLinks { demo?: string; source?: string; }

export interface Project {
  id: number;
  slug: string;
  title: string;
  summary: string;
  role: string;
  period: string;
  type: string;
  status: 'current' | 'completed' | string;
  featured: boolean;
  overviewFacts: ProjectFact[];
  problem: ProjectProblem;
  process: ProjectProcessStep[];
  decisions: ProjectDecision[];
  solution: ProjectSolutionGroup[];
  outcomes: ProjectOutcome[];
  learnings: string[];
  technologies: string[];
  links?: ProjectLinks;
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly projectsSubject = new BehaviorSubject<Project[]>([]);
  readonly projects$ = this.projectsSubject.asObservable();

  constructor(
    private readonly contentLoader: ContentLoaderService,
    private readonly langService: LangService,
    private readonly toast: ToastrService,
  ) {
    this.langService.langChanged$
      .pipe(skip(1), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => void this.reloadProjects());
    void this.reloadProjects();
  }

  getBySlug(slug: string) {
    return this.projects$.pipe(map(projects => projects.find(project => project.slug === slug)));
  }

  private async reloadProjects(): Promise<void> {
    try {
      const projects = await this.contentLoader.loadJson<Project[]>(this.langService.getLang(), 'project.json');
      if (!Array.isArray(projects)) throw new Error('Invalid project payload');
      this.projectsSubject.next(projects);
    } catch {
      this.projectsSubject.next([]);
      this.toast.error('Failed to load project data.', 'Project');
    }
  }
}
