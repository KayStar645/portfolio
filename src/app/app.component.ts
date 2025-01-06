import { Component, inject } from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  translate: TranslateService = inject(TranslateService);

  translateText(lang: string) {
    this.translate.use(lang);
  }
}
