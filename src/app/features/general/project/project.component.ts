import { AsyncPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project, ProjectsService } from '../../../services/project.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, SlicePipe, RouterLink, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectComponent {
  readonly projects$ = inject(ProjectsService).projects$;
  trackByProject(_index: number, project: Project): number { return project.id; }
}
