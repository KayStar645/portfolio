import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Experience, ExperiencesService } from './../../../services/experience.service';

@Component({
  selector: 'app-experience',
  imports: [
    TranslateModule,
  ],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  experiences: Experience[] = [];

    constructor(
      private experiencesService: ExperiencesService,
    ) { }

    async ngOnInit(): Promise<void> {
      try {
        this.experiencesService.experiences$.subscribe(experiences => {
          this.experiences = experiences;
        });
      } catch (error) {
      }
    }

}
