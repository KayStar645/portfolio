import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { LangService } from '../../services/lang.service';
import { ThemeService } from '../../services/theme.service';
import { HeaderComponent } from './header.component';

@Component({ standalone: true, template: '' }) class RouteStub {}
class LangStub { private lang = 'en-US'; readonly langChanged$ = of(this.lang); getLang(): string { return this.lang; } setLang(value: string): void { this.lang = value; } }
class ThemeStub { private theme = 'dark'; getCurrentTheme(): string { return this.theme; } toggleTheme(): void { this.theme = this.theme === 'dark' ? 'light' : 'dark'; } }

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeaderComponent, TranslateModule.forRoot()], providers: [provideRouter([{ path: 'project', component: RouteStub }]), { provide: UserService, useValue: { user$: of({ name: 'KayStar', avatar: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', link: '/' }) } }, { provide: LangService, useClass: LangStub }, { provide: ThemeService, useClass: ThemeStub }] }).compileComponents();
  });

  it('closes the mobile menu after navigation and keeps language/theme controls working', fakeAsync(() => {
    const fixture = TestBed.createComponent(HeaderComponent); fixture.detectChanges(); const component = fixture.componentInstance;
    component.openMenu(); expect(component.isMenuVisible).toBeTrue();
    component.switchLanguage(); component.toggleTheme(); expect(component.currentLang).toBe('vi-VN'); expect(component.currentTheme).toBe('light');
    TestBed.inject(Router).navigateByUrl('/project'); tick(); fixture.detectChanges();
    expect(component.isMenuVisible).toBeFalse(); expect(document.body.classList.contains('menu-open')).toBeFalse();
  }));
});
