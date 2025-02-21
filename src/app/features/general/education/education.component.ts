import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Education, EducationsService } from './../../../services/education.service';

@Component({
  selector: 'app-education',
  imports: [
    TranslateModule,
    CommonModule,
  ],
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {
  translate: TranslateService = inject(TranslateService);
  educations: Education[] = [];

    constructor(
      private educationsService: EducationsService,
    ) { }

    async ngOnInit(): Promise<void> {
      try {
        this.educationsService.educations$.subscribe(educations => {
          this.educations = educations;
        });
      } catch (error) {
        this.educations = [];
      }
    }

}
