import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Education, EducationCertificate, EducationsService } from '../../../services/education.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { RevealDirective } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-education', standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TranslateModule, IconComponent, RevealDirective],
  templateUrl: './education.component.html', styleUrl: './education.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EducationComponent {
  private readonly service = inject(EducationsService);
  readonly content$ = this.service.content$;
  trackEducation(_index: number, item: Education): string { return item.id; }
  trackCertificate(_index: number, item: EducationCertificate): string { return item.id; }
}
