import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { LangService } from '../shared/services/lang.service';
import { ContentLoaderService } from './content-loader.service';
import { ResumeBaseContent, ResumeService } from './resume.service';

const baseResume: ResumeBaseContent = {
  profile: { name: 'Thuan', title: 'Software Engineer', avatar: '', location: 'Ho Chi Minh City', contacts: [] },
  summary: 'Summary', skillGroups: [], experiences: [], education: [], certificates: [], languages: [],
};
const achievements = [
  ...Array.from({ length: 6 }, (_, index) => ({ id: `award-${index}`, name: `Award ${index}`, role: 'Lead', team: '', result: 'Prize', address: 'HUIT', time: '2024', image: '', type: 'prize' })),
  ...Array.from({ length: 3 }, (_, index) => ({ id: `research-${index}`, name: `Research ${index}`, role: 'PI', team: '', result: 'In Progress', address: 'HUIT', time: '2025', image: '', type: 'science' })),
];

class LangServiceStub {
  readonly langChanged$ = new BehaviorSubject('en-US');
  getLang(): string { return this.langChanged$.value; }
}

describe('ResumeService', () => {
  let service: ResumeService;
  let loader: jasmine.SpyObj<ContentLoaderService>;

  beforeEach(() => {
    loader = jasmine.createSpyObj<ContentLoaderService>('ContentLoaderService', ['loadJson']);
    loader.loadJson.and.callFake(async <T>(_lang: string, file: string): Promise<T> => (file === 'resume.json' ? baseResume : achievements) as T);
    TestBed.configureTestingModule({ providers: [ResumeService, { provide: ContentLoaderService, useValue: loader }, { provide: LangService, useClass: LangServiceStub }] });
    service = TestBed.inject(ResumeService);
  });

  it('combines resume data with six awards and three research projects', async () => {
    const resume = await firstValueFrom(service.resume$);
    expect(resume?.awards.length).toBe(6);
    expect(resume?.researchProjects.length).toBe(3);
    expect(loader.loadJson).toHaveBeenCalledWith('en-US', 'resume.json');
    expect(loader.loadJson).toHaveBeenCalledWith('en-US', 'achievement.json');
  });

  it('reloads both sources when the locale changes', async () => {
    const lang = TestBed.inject(LangService) as unknown as LangServiceStub;
    const values: string[] = [];
    const subscription = service.resume$.subscribe(resume => { if (resume) values.push(resume.profile.name); });
    await Promise.resolve();
    lang.langChanged$.next('vi-VN');
    await Promise.resolve();
    await Promise.resolve();
    expect(loader.loadJson).toHaveBeenCalledWith('vi-VN', 'resume.json');
    expect(loader.loadJson).toHaveBeenCalledWith('vi-VN', 'achievement.json');
    subscription.unsubscribe();
  });
});
