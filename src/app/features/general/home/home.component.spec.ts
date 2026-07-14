import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AchievementsService } from '../../../services/achievement.service';
import { EducationsService } from '../../../services/education.service';
import { ExperiencesService } from '../../../services/experience.service';
import { ProjectsService } from '../../../services/project.service';
import { SkillService } from '../../../services/skill.service';
import { HomeComponent } from './home.component';

const achievements = [
  ...Array.from({ length: 6 }, (_, index) => ({ id: `award-${index}`, name: `Award ${index + 1}`, role: 'Team Leader', team: '', result: 'Prize', address: 'HUIT', time: '2024', image: '', type: 'prize' })),
  ...Array.from({ length: 3 }, (_, index) => ({ id: `research-${index}`, name: `Research ${index + 1}`, role: 'Principal Investigator', team: '', result: 'In Progress', address: 'HUIT', time: '2025', image: '', type: 'science' })),
];

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: ProjectsService, useValue: { projects$: of([]) } },
        { provide: ExperiencesService, useValue: { experiences$: of([]) } },
        { provide: SkillService, useValue: { skills$: of([]) } },
        { provide: AchievementsService, useValue: { achievements$: of(achievements) } },
        { provide: EducationsService, useValue: { educations$: of([{ id: 'huit', label: 'MSc', name: 'HUIT', address: 'Ho Chi Minh City', time: '2025', image: '' }]) } },
      ],
    }).compileComponents();
  });

  it('renders all six awards and three research projects', () => {
    const fixture = TestBed.createComponent(HomeComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.evidence-item').length).toBe(9);
    expect(fixture.nativeElement.textContent).toContain('Award 6');
    expect(fixture.nativeElement.textContent).toContain('Research 3');
  });
});
