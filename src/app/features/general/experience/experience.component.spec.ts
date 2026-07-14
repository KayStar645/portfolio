import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ExperiencesService } from '../../../services/experience.service';
import { ExperienceComponent } from './experience.component';

class ExperiencesServiceStub {
  readonly experiences$ = of([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Vu Thao Technology',
      time: '01/2026 - Present',
      location: 'Ho Chi Minh City',
      type: 'full-time',
      status: 'current',
      description: 'Build a modular enterprise platform.',
      responsibilities: ['Design the end-to-end architecture.'],
      technologies: ['.NET', 'RabbitMQ'],
    },
  ]);
}

describe('ExperienceComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent, TranslateModule.forRoot()],
      providers: [{ provide: ExperiencesService, useClass: ExperiencesServiceStub }],
    }).compileComponents();
  });

  it('renders structured experience content and technologies', () => {
    const fixture = TestBed.createComponent(ExperienceComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Software Engineer');
    expect(text).toContain('Design the end-to-end architecture.');
    expect(text).toContain('RabbitMQ');
  });
});
