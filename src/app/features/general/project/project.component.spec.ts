import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Project, ProjectsService } from '../../../services/project.service';
import { ProjectComponent } from './project.component';

const makeProject = (id: number, slug: string, title: string): Project => ({
  id, slug, title, summary: 'Case summary', role: 'Software Engineer', period: '2026', type: 'Platform', status: id === 1 ? 'current' : 'completed', featured: id === 1,
  overviewFacts: [{ label: 'Role', value: 'Software Engineer' }], problem: { context: 'Context', statement: 'Problem', constraints: ['Constraint'] },
  process: [{ title: 'Process', description: 'Description' }], decisions: [{ title: 'Decision', rationale: 'Rationale', tradeOff: 'Trade-off', practices: ['Practice'] }],
  solution: [{ title: 'Capability', description: 'Description', deliverables: ['Deliverable'] }], outcomes: [{ title: 'Outcome', description: 'Description' }], learnings: ['Learning'], technologies: ['React'],
});
class ProjectsServiceStub { readonly projects$ = of([makeProject(1, 'enterprise-platform-architecture', 'Enterprise Platform Architecture'), makeProject(2, 'multi-channel-engagement-platform', 'Multi-channel Customer Engagement Platform')]); }

describe('ProjectComponent', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [ProjectComponent, TranslateModule.forRoot()], providers: [provideRouter([]), { provide: ProjectsService, useClass: ProjectsServiceStub }] }).compileComponents(); });
  it('renders the flagship case study first and links both detail routes', () => {
    const fixture = TestBed.createComponent(ProjectComponent); fixture.detectChanges(); const entries = fixture.nativeElement.querySelectorAll('.work-entry') as NodeListOf<HTMLElement>;
    expect(entries.length).toBe(2); expect(entries[0].textContent).toContain('Enterprise Platform Architecture'); expect(entries[1].textContent).toContain('Multi-channel Customer Engagement Platform'); expect(fixture.nativeElement.querySelector('.architecture-flow')).toBeNull();
  });
});
