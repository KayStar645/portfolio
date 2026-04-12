import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterOutlet } from '@angular/router';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  standalone: true,
  template: '',
})
class HeaderStubComponent {}

@Component({
  selector: 'app-footer',
  standalone: true,
  template: '',
})
class FooterStubComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(AppComponent, {
        set: {
          imports: [RouterOutlet, HeaderStubComponent, FooterStubComponent],
        },
      })
      .compileComponents();
  });

  it('renders the app shell with header, router outlet, and footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-header')).not.toBeNull();
    expect(element.querySelector('router-outlet')).not.toBeNull();
    expect(element.querySelector('app-footer')).not.toBeNull();
  });
});
