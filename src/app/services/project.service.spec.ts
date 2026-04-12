import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { LangService } from '../shared/services/lang.service';

import { ContentLoaderService } from './content-loader.service';
import { ProjectsService } from './project.service';

class MockLangService {
  private readonly subject = new BehaviorSubject<string>('en-US');
  readonly langChanged$ = this.subject.asObservable();

  getLang(): string {
    return this.subject.value;
  }

  setLang(lang: string): void {
    this.subject.next(lang);
  }
}

describe('ProjectsService', () => {
  let service: ProjectsService;
  let httpMock: HttpTestingController;
  let langService: MockLangService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContentLoaderService,
        ProjectsService,
        { provide: LangService, useClass: MockLangService },
        { provide: ToastrService, useValue: { error: jasmine.createSpy('error') } },
      ],
    });

    service = TestBed.inject(ProjectsService);
    httpMock = TestBed.inject(HttpTestingController);
    langService = TestBed.inject(LangService) as unknown as MockLangService;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads projects for the current language and reloads on language change', fakeAsync(() => {
    const emissions: unknown[] = [];
    service.projects$.subscribe(value => emissions.push(value));

    const initialRequest = httpMock.expectOne('assets/params/json/en-US/project.json');
    expect(initialRequest.request.method).toBe('GET');
    initialRequest.flush([{ label: 'EN' }]);
    flushMicrotasks();

    expect(emissions.at(-1)).toEqual([{ label: 'EN' }]);

    langService.setLang('vi-VN');
    const reloadRequest = httpMock.expectOne('assets/params/json/vi-VN/project.json');
    expect(reloadRequest.request.method).toBe('GET');
    reloadRequest.flush([{ label: 'VI' }]);
    flushMicrotasks();

    expect(emissions.at(-1)).toEqual([{ label: 'VI' }]);
  }));
});
