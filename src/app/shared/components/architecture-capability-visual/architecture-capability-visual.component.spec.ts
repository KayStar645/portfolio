import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ArchitectureCapabilityVisualComponent } from './architecture-capability-visual.component';

describe('ArchitectureCapabilityVisualComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ArchitectureCapabilityVisualComponent, TranslateModule.forRoot()] }).compileComponents();
  });

  it('renders three independent capability clusters without a topology flow', () => {
    const fixture = TestBed.createComponent(ArchitectureCapabilityVisualComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.capability-cluster').length).toBe(3);
    expect(fixture.nativeElement.querySelector('.portrait-frame')).toBeNull();
    expect(fixture.nativeElement.querySelector('.visual-connector')).toBeNull();
  });
});
