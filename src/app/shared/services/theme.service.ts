import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'theme-mode';
  private defaultTheme: string = 'dark';
  private availableThemes: string[] = ['light', 'dark'];

  constructor(
    private toast: ToastrService,
  ) {
    this.loadTheme();
  }

  getCurrentTheme(): string {
    return localStorage.getItem(this.themeKey) || this.defaultTheme;
  }

  toggleTheme() {
    const currentIndex = this.availableThemes.indexOf(this.getCurrentTheme());
    const nextTheme = this.availableThemes[(currentIndex + 1) % this.availableThemes.length];
    this.setTheme(nextTheme);
  }

  setTheme(theme: string) {
    if (!this.availableThemes.includes(theme)) {
      this.toast.error(`Theme "${theme}" không hợp lệ!`);
      return;
    }

    document.documentElement.classList.remove(...this.availableThemes);
    document.documentElement.classList.add(theme);
    localStorage.setItem(this.themeKey, theme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.themeKey);
    this.setTheme(savedTheme || this.defaultTheme);
  }
}
