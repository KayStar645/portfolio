import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Project, ProjectsService } from '../../../services/project.service';
import { ProjectDetailComponent } from './project-detail.component';

const project: Project = {
  id: 1, slug: 'enterprise-platform-architecture', title: 'Enterprise Platform Architecture', summary: 'A deep architecture case study.', role: 'Software Engineer', period: '2026', type: 'Platform', status: 'current', featured: true,
  overviewFacts: [{ label: 'Role', value: 'Software Engineer' }],
  problem: { context: 'Modular growth increased coordination cost.', statement: 'Create explicit evolution boundaries.', constraints: ['No shared data access'] },
  process: [{ title: 'Frame the change surface', description: 'Map responsibilities.' }],
  decisions: [{ title: 'Composable frontend', rationale: 'Independent evolution.', tradeOff: 'Contract discipline.', practices: ['MFE', 'Feature-Sliced Design'] }],
  solution: [{ title: 'Frontend Architecture', description: 'Owned UI slices.', deliverables: ['Host composition'] }],
  outcomes: [{ title: 'Explicit ownership', description: 'Boundaries are visible.' }], learnings: ['Boundaries must be executable.'], technologies: ['React', '.NET'],
};

describe('ProjectDetailComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: ProjectsService, useValue: { projects$: of([project]) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ slug: project.slug })) } },
      ],
    }).compileComponents();
  });

  it('renders Problem, Process, Decisions, Solution, Outcomes and Learnings', () => {
    const fixture = TestBed.createComponent(ProjectDetailComponent); fixture.detectChanges();
    for (const id of ['problem', 'process', 'decisions', 'solution', 'outcomes', 'learnings']) expect(fixture.nativeElement.querySelector(`#${id}`)).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Feature-Sliced Design');
  });
});
