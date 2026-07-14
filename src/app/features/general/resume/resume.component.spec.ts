import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { ResumeContent, ResumeService } from '../../../services/resume.service';
import { LangService } from '../../../shared/services/lang.service';
import { ResumeComponent } from './resume.component';

const resumeContent: ResumeContent = {
  profile: { name: 'Tan Thuan Pham', title: 'Software Engineer', avatar: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', location: 'Ho Chi Minh City', contacts: [{ label: 'Email', value: 'thuanpt182@gmail.com', href: 'mailto:thuanpt182@gmail.com' }] },
  summary: 'Summary', skillGroups: [{ title: 'Backend', items: ['.NET'] }],
  experiences: [{ title: 'Software Engineer', organization: 'Technology Company', period: '2026–Present', details: ['Build modular enterprise systems'] }],
  education: [], certificates: [],
  awards: Array.from({ length: 6 }, (_, index) => ({ id: `award-${index}`, name: `Award ${index + 1}`, role: 'Team Leader', team: 'Research team', result: 'Prize', address: 'HUIT', time: '2024', image: '', type: 'prize' })),
  researchProjects: Array.from({ length: 3 }, (_, index) => ({ id: `research-${index}`, name: `Research ${index + 1}`, role: 'Principal Investigator', team: 'Research team', result: 'In Progress', address: 'HUIT', time: '2025', image: '', type: 'science' })),
  languages: [{ name: 'English', level: 'Professional' }],
};
class ResumeServiceStub {
  readonly resume$ = of(resumeContent);
  getPdfLink(lang: string) { return { href: `assets/files/resume-${lang}.pdf`, fileName: lang === 'vi-VN' ? 'Pham-Tan-Thuan-vi-VN.pdf' : 'Pham-Tan-Thuan-en-US.pdf' }; }
}
class LangServiceStub { readonly langChanged$ = new BehaviorSubject('vi-VN'); getLang(): string { return this.langChanged$.value; } }

describe('ResumeComponent', () => {
  let langService: LangServiceStub;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ResumeComponent, TranslateModule.forRoot()], providers: [{ provide: ResumeService, useClass: ResumeServiceStub }, { provide: LangService, useClass: LangServiceStub }] }).compileComponents();
    langService = TestBed.inject(LangService) as unknown as LangServiceStub;
  });
  it('uses the Vietnamese PDF asset', () => {
    const fixture = TestBed.createComponent(ResumeComponent); fixture.detectChanges(); const link = fixture.nativeElement.querySelector('.button--primary') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('assets/files/resume-vi-VN.pdf'); expect(link.getAttribute('download')).toBe('Pham-Tan-Thuan-vi-VN.pdf');
  });
  it('updates the PDF asset when language changes', () => {
    const fixture = TestBed.createComponent(ResumeComponent); fixture.detectChanges(); langService.langChanged$.next('en-US'); fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('.button--primary') as HTMLAnchorElement; expect(link.getAttribute('href')).toBe('assets/files/resume-en-US.pdf'); expect(link.getAttribute('download')).toBe('Pham-Tan-Thuan-en-US.pdf');
  });
  it('renders all awards and research projects', () => {
    const fixture = TestBed.createComponent(ResumeComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.resume-evidence').length).toBe(9);
    expect(fixture.nativeElement.textContent).toContain('Award 6');
    expect(fixture.nativeElement.textContent).toContain('Research 3');
  });
});
