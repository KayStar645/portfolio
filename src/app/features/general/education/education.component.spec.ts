import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { EducationsService } from '../../../services/education.service';
import { EducationComponent } from './education.component';

describe('EducationComponent', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [EducationComponent, TranslateModule.forRoot()], providers: [{ provide: EducationsService, useValue: { content$: of({ education: [{ id: 'msc', label: 'Scholarship', name: 'MSc', address: 'HUIT', time: '2025–Present', image: '' }], certificates: [{ id: 'b1', name: 'English B1', issuer: 'CEFR', time: '2025', result: 'B1' }] }) } }] }).compileComponents(); });
  it('renders education and certificates from the data service', () => { const fixture = TestBed.createComponent(EducationComponent); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('MSc'); expect(fixture.nativeElement.textContent).toContain('English B1'); });
});
