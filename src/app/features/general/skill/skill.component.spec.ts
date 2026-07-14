import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SkillService } from '../../../services/skill.service';
import { SkillComponent } from './skill.component';

class SkillServiceStub {
  readonly skills$ = of([
    { group_id: 1, group_name: 'Frontend Architecture', name: 'Feature-Sliced Design', icon: '', url: '', is_main: true, is_hidden: false },
    { group_id: 2, group_name: 'Backend Architecture', name: 'Clean Architecture', icon: '', url: '', is_main: true, is_hidden: false },
    { group_id: 3, group_name: 'Distributed & Platform Engineering', name: 'RabbitMQ', icon: '', url: '', is_main: true, is_hidden: false },
    { group_id: 4, group_name: 'Broader Experience', name: 'Laravel', icon: '', url: '', is_main: false, is_hidden: false },
  ]);
}

describe('SkillComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillComponent, TranslateModule.forRoot()],
      providers: [{ provide: SkillService, useClass: SkillServiceStub }],
    }).compileComponents();
  });

  it('renders frontend, backend, platform and broader experience as separate groups', () => {
    const fixture = TestBed.createComponent(SkillComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(fixture.nativeElement.querySelectorAll('.expertise-group').length).toBe(4);
    expect(text).toContain('Frontend Architecture');
    expect(text).toContain('Backend Architecture');
    expect(text).toContain('Distributed & Platform Engineering');
    expect(text).toContain('Laravel');
  });
});
