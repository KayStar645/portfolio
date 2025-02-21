import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Project, ProjectsService } from './../../../services/project.service';

@Component({
  selector: 'app-project',
  imports: [
    TranslateModule,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  projects: Project[] = [];

    constructor(
      private projectsService: ProjectsService,
    ) { }

    async ngOnInit(): Promise<void> {
      try {
        this.projectsService.projects$.subscribe(projects => {
          this.projects = projects;
        });
      } catch (error) {
      }
    }

}
