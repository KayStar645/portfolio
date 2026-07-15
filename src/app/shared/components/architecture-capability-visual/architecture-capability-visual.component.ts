import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

interface CapabilityCluster {
  id: 'frontend' | 'backend' | 'distributed';
  index: string;
  titleKey: string;
  technologies: string[];
}

@Component({
  selector: 'app-architecture-capability-visual',
  standalone: true,
  imports: [NgFor, TranslateModule],
  templateUrl: './architecture-capability-visual.component.html',
  styleUrl: './architecture-capability-visual.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class ArchitectureCapabilityVisualComponent {
  @ViewChild('system') private system?: ElementRef<HTMLElement>;

  readonly clusters: CapabilityCluster[] = [
    { id: 'frontend', index: '01', titleKey: 'home.architectureVisual.frontend', technologies: ['MFE', 'FSD', 'Metadata UI'] },
    { id: 'backend', index: '02', titleKey: 'home.architectureVisual.backend', technologies: ['.NET', 'Clean Architecture', 'DDD / CQRS'] },
    { id: 'distributed', index: '03', titleKey: 'home.architectureVisual.distributed', technologies: ['RabbitMQ', 'Idempotent Workers', 'Multi-Tenancy / CI/CD'] },
  ];

  move(event: PointerEvent): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = this.system?.nativeElement;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${(event.clientX - bounds.left) / bounds.width * 2 - 1}`);
    node.style.setProperty('--my', `${(event.clientY - bounds.top) / bounds.height * 2 - 1}`);
  }

  reset(): void {
    const node = this.system?.nativeElement;
    node?.style.setProperty('--mx', '0');
    node?.style.setProperty('--my', '0');
  }

  trackByCluster(_index: number, cluster: CapabilityCluster): string { return cluster.id; }
  trackByTechnology(_index: number, technology: string): string { return technology; }
}
