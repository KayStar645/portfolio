import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { ResumeContent, ResumeService } from '../../../services/resume.service';
import { LangService } from '../../../shared/services/lang.service';
import { ResumeComponent } from './resume.component';

const resumeContent: ResumeContent = {
  profile: {
    name: 'Tan Thuan Pham',
    title: 'Full-stack Developer',
    avatar: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=',
    location: 'Ho Chi Minh City',
    contacts: [
      {
        label: 'Email',
        value: 'thuanpt182@gmail.com',
        icon: 'fas fa-envelope',
        href: 'mailto:thuanpt182@gmail.com',
      },
    ],
  },
  summary: 'Summary',
  skillGroups: [
    {
      title: 'Backend',
      items: ['.NET Core'],
    },
  ],
  experiences: [
    {
      title: 'Developer',
      organization: 'Vu Thao Technology',
      period: '01/2026 - Present',
      details: ['Build DPM systems'],
    },
  ],
  education: [],
  certificates: [],
  research: [],
  achievements: [],
  languages: [
    {
      name: 'English',
      level: 'Intermediate',
    },
  ],
};

class ResumeServiceStub {
  readonly resume$ = of(resumeContent);

  getPdfLink(lang: string) {
    const fileName = `resume-${lang}.pdf`;

    return {
      href: `assets/files/${fileName}`,
      fileName,
    };
  }
}

class LangServiceStub {
  readonly langChanged$ = new BehaviorSubject<string>('vi-VN');

  getLang(): string {
    return this.langChanged$.value;
  }
}

describe('ResumeComponent', () => {
  let langService: LangServiceStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ResumeService, useClass: ResumeServiceStub },
        { provide: LangService, useClass: LangServiceStub },
      ],
    }).compileComponents();

    langService = TestBed.inject(LangService) as unknown as LangServiceStub;
  });

  it('uses a real Vietnamese PDF asset for the download link', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.download-btn') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('assets/files/resume-vi-VN.pdf');
    expect(link.getAttribute('download')).toBe('resume-vi-VN.pdf');
    expect((fixture.componentInstance as unknown as { downloadPDF?: unknown }).downloadPDF).toBeUndefined();
  });

  it('updates the PDF asset when the language changes', () => {
    const fixture = TestBed.createComponent(ResumeComponent);
    fixture.detectChanges();

    langService.langChanged$.next('en-US');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.download-btn') as HTMLAnchorElement;

    expect(link.getAttribute('href')).toBe('assets/files/resume-en-US.pdf');
    expect(link.getAttribute('download')).toBe('resume-en-US.pdf');
  });
});
