import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type IconName = 'arrow' | 'award' | 'briefcase' | 'calendar' | 'check' | 'close' |
  'code' | 'download' | 'education' | 'external' | 'github' | 'language' | 'layers' |
  'mail' | 'menu' | 'moon' | 'sun';

const ICON_PATHS: Record<IconName, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  award: 'M12 15l-3.5 2 1-4-3-2.7 4-.4L12 6l1.5 3.9 4 .4-3 2.7 1 4z M8 3h8',
  briefcase: 'M9 7V5h6v2M4 8h16v11H4zM4 12h16M10 12v2h4v-2',
  calendar: 'M6 3v3M18 3v3M4 8h16M5 5h14v15H5z',
  check: 'M5 12l4 4L19 6',
  close: 'M6 6l12 12M18 6L6 18',
  code: 'M8 9l-3 3 3 3M16 9l3 3-3 3M14 5l-4 14',
  download: 'M12 3v12M7 10l5 5 5-5M5 20h14',
  education: 'M3 9l9-5 9 5-9 5zM7 12v5c3 2 7 2 10 0v-5M21 9v7',
  external: 'M14 5h5v5M19 5l-8 8M18 13v6H5V6h6',
  github: 'M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.5-.5-2 3-.3 6-1.5 6-6A4.7 4.7 0 0 0 19.7 7 4.4 4.4 0 0 0 19.6 3s-1.4-.4-4 1.5a14 14 0 0 0-7 0C6 2.6 4.6 3 4.6 3A4.4 4.4 0 0 0 4.5 7 4.7 4.7 0 0 0 3 10.5c0 4.5 3 5.7 6 6-.5.4-.7 1-.7 2V21',
  language: 'M4 5h10M9 3v2c0 5-2 8-5 10M6 9c2 3 4 4 7 5M14 21l4-10 4 10M16 17h4',
  layers: 'M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  moon: 'M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5z',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
};

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path [attr.d]="path"></path>
    </svg>
  `,
  styles: [':host{display:inline-flex;width:1.15em;height:1.15em;flex:0 0 auto}:host svg{width:100%;height:100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() size?: number;
  @HostBinding('style.width.px') get width(): number | null { return this.size ?? null; }
  @HostBinding('style.height.px') get height(): number | null { return this.size ?? null; }
  get path(): string { return ICON_PATHS[this.name]; }
}
