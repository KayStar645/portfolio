import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import {
  ResumeLanguage,
  ResumeContactItem,
  ResumePdfLink,
  ResumeService,
  ResumeSimpleItem,
  ResumeSkillGroup,
  ResumeTimelineItem,
} from '../../../services/resume.service';
import { LangService } from '../../../shared/services/lang.service';

@Component({
  selector: 'app-resume',
  imports: [CommonModule, TranslateModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeComponent {
  private readonly resumeService = inject(ResumeService);
  private readonly langService = inject(LangService);

  readonly resume$ = this.resumeService.resume$;
  readonly pdfLink$ = this.langService.langChanged$.pipe(
    map(lang => this.resumeService.getPdfLink(lang)),
  );

  trackBySkillGroup(_index: number, item: ResumeSkillGroup): string {
    return item.title;
  }

  trackByTimelineItem(_index: number, item: ResumeTimelineItem): string {
    return `${item.title}-${item.organization}-${item.period}`;
  }

  trackBySimpleItem(_index: number, item: ResumeSimpleItem): string {
    return `${item.title}-${item.period ?? item.subtitle ?? _index}`;
  }

  trackByLanguage(_index: number, item: ResumeLanguage): string {
    return item.name;
  }

  trackByContact(_index: number, item: ResumeContactItem): string {
    return `${item.label}-${item.value}`;
  }

  trackByString(_index: number, item: string): string {
    return item;
  }

  trackByPdfLink(_index: number, item: ResumePdfLink): string {
    return item.href;
  }
}
