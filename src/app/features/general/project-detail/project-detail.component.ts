import { AsyncPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, filter, map, shareReplay, tap } from 'rxjs';
import { ProjectsService } from '../../../services/project.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, SlicePipe, RouterLink, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectsService = inject(ProjectsService);

  readonly project$ = combineLatest([this.route.paramMap, this.projectsService.projects$]).pipe(
    filter(([, projects]) => projects.length > 0),
    map(([params, projects]) => projects.find(project => project.slug === params.get('slug'))),
    tap(project => { if (!project) void this.router.navigate(['/project']); }),
    filter(project => !!project),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly sections = ['overview', 'problem', 'process', 'decisions', 'solution', 'outcomes', 'learnings'];
  trackByTitle(_index: number, value: { title: string }): string { return value.title; }
  trackByText(_index: number, value: string): string { return value; }
}
