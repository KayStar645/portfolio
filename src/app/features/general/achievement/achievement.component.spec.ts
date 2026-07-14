import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AchievementsService } from '../../../services/achievement.service';
import { AchievementComponent } from './achievement.component';

describe('AchievementComponent', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [AchievementComponent, TranslateModule.forRoot()], providers: [{ provide: AchievementsService, useValue: { achievements$: of([{ id: 'award', name: 'Research Award', role: 'Team Leader', team: 'Research team', result: 'First Prize', address: 'HUIT', time: '2024', image: '', type: 'prize' }]) } }] }).compileComponents(); });
  it('renders achievements from the data service', () => { const fixture = TestBed.createComponent(AchievementComponent); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Research Award'); expect(fixture.nativeElement.textContent).toContain('First Prize'); });
});
