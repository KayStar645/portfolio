import { AsyncPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import { AchievementsService } from '../../../services/achievement.service';
import { EducationsService } from '../../../services/education.service';
import { ExperiencesService } from '../../../services/experience.service';
import { ProjectsService } from '../../../services/project.service';
import { GroupedSkill, SkillService } from '../../../services/skill.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, SlicePipe, RouterLink, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @ViewChild('architectureVisual') architectureVisual?: ElementRef<HTMLElement>;

  private readonly projectsService = inject(ProjectsService);
  private readonly experiencesService = inject(ExperiencesService);
  private readonly skillService = inject(SkillService);
  private readonly achievementsService = inject(AchievementsService);
  private readonly educationsService = inject(EducationsService);

  readonly vm$ = combineLatest([
    this.projectsService.projects$,
    this.experiencesService.experiences$,
    this.skillService.skills$,
    this.achievementsService.achievements$,
    this.educationsService.educations$,
  ]).pipe(map(([projects, experiences, skills, achievements, educations]) => {
    const grouped = skills.filter(skill => !skill.is_hidden).reduce((result, skill) => {
      result[skill.group_id] ??= { group_id: skill.group_id, group_name: skill.group_name, items: [] };
      result[skill.group_id].items.push(skill);
      return result;
    }, {} as Record<number, GroupedSkill>);
    return {
      projects: projects.slice(0, 2),
      experiences: experiences.slice(0, 3),
      expertise: Object.values(grouped).filter(group => group.group_id <= 3),
      awards: achievements.filter(item => item.type === 'prize'),
      researchProjects: achievements.filter(item => item.type === 'science'),
      education: educations[0],
    };
  }));

  moveVisual(event: PointerEvent): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = this.architectureVisual?.nativeElement;
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty('--mx', `${(event.clientX - bounds.left) / bounds.width * 2 - 1}`);
    target.style.setProperty('--my', `${(event.clientY - bounds.top) / bounds.height * 2 - 1}`);
  }
}
