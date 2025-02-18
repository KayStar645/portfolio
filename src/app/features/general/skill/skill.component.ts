import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GroupedSkill, SkillService } from './../../../services/skill.service';

@Component({
  selector: 'app-skill',
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss'
})
export class SkillComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  groupedSkills: GroupedSkill[] = [];

  constructor(
    private skillService: SkillService,
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.groupedSkills = await this.skillService.getGroupedItems();
    } catch (error) {
      this.groupedSkills = [];
    }
  }
}
