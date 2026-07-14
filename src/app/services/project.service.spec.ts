import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, take } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ContentLoaderService } from './content-loader.service';
import { Project, ProjectsService } from './project.service';

class MockLangService {
  private readonly subject = new BehaviorSubject('en-US');
  readonly langChanged$ = this.subject.asObservable();
  getLang(): string { return this.subject.value; }
  setLang(lang: string): void { this.subject.next(lang); }
}

const project: Project = {
  id: 1, slug: 'enterprise-platform-architecture', title: 'Enterprise Platform Architecture', summary: 'Architecture case study.',
  role: 'Software Engineer', period: '2026–Present', type: 'Enterprise Platform', status: 'current', featured: true,
  overviewFacts: [{ label: 'Role', value: 'Software Engineer' }],
  problem: { context: 'Modular growth.', statement: 'Keep boundaries explicit.', constraints: ['No shared data access'] },
  process: [{ title: 'Frame', description: 'Map change boundaries.' }],
  decisions: [{ title: 'Composable frontend', rationale: 'Independent evolution.', tradeOff: 'More contract discipline.', practices: ['MFE'] }],
  solution: [{ title: 'Frontend Architecture', description: 'Composable UI.', deliverables: ['Feature boundaries'] }],
  outcomes: [{ title: 'Explicit ownership', description: 'Responsibilities are visible.' }],
  learnings: ['Contracts make boundaries executable.'], technologies: ['React', '.NET'],
};

describe('ProjectsService', () => {
  let service: ProjectsService; let httpMock: HttpTestingController; let langService: MockLangService;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [ContentLoaderService, ProjectsService, { provide: LangService, useClass: MockLangService }, { provide: ToastrService, useValue: { error: jasmine.createSpy('error') } }] });
    service = TestBed.inject(ProjectsService); httpMock = TestBed.inject(HttpTestingController); langService = TestBed.inject(LangService) as unknown as MockLangService;
  });
  afterEach(() => httpMock.verify());
  it('loads the current locale and reloads when language changes', fakeAsync(() => {
    let latest: Project[] = []; service.projects$.subscribe(value => latest = value);
    httpMock.expectOne('assets/params/json/en-US/project.json').flush([project]); flushMicrotasks(); expect(latest[0].slug).toBe(project.slug);
    langService.setLang('vi-VN'); httpMock.expectOne('assets/params/json/vi-VN/project.json').flush([{ ...project, title: 'Kiến trúc nền tảng doanh nghiệp' }]); flushMicrotasks();
    expect(latest[0].title).toBe('Kiến trúc nền tảng doanh nghiệp');
  }));
  it('finds a loaded project by slug', fakeAsync(() => {
    httpMock.expectOne('assets/params/json/en-US/project.json').flush([project]); flushMicrotasks();
    let found: Project | undefined; service.getBySlug(project.slug).pipe(take(1)).subscribe(value => found = value); expect(found?.id).toBe(1);
  }));
});
