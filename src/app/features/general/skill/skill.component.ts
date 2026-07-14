import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { GroupedSkill, Skill, SkillService } from '../../../services/skill.service';
import { IconComponent, IconName } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-skill',
  imports: [CommonModule, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillComponent {
  private readonly skillService = inject(SkillService);

  readonly groupedSkills$ = this.skillService.skills$.pipe(
    map(skills => {
      const grouped = skills
        .filter(skill => !skill.is_hidden)
        .reduce((result: Record<number, GroupedSkill>, skill) => {
          result[skill.group_id] ??= {
            group_id: skill.group_id,
            group_name: skill.group_name,
            items: [],
          };
          result[skill.group_id].items.push(skill);
          return result;
        }, {});

      return Object.values(grouped).sort((left, right) => left.group_id - right.group_id);
    }),
  );

  groupIcon(groupId: number): IconName {
    const icons: Record<number, IconName> = {
      1: 'layers',
      2: 'code',
      3: 'briefcase',
      4: 'external',
    };

    return icons[groupId] ?? 'code';
  }

  trackByGroup(_index: number, group: GroupedSkill): number {
    return group.group_id;
  }

  trackBySkill(_index: number, skill: Skill): string {
    return `${skill.group_id}-${skill.name}`;
  }
}
