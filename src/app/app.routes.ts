import { Routes } from '@angular/router';
import { HomeComponent } from './features/general/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'achievement',
    loadComponent: () => import('./features/general/achievement/achievement.component')
      .then(mod => mod.AchievementComponent)
  },
  {
    path: 'education',
    loadComponent: () => import('./features/general/education/education.component')
      .then(mod => mod.EducationComponent)
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/general/experience/experience.component')
      .then(mod => mod.ExperienceComponent)
  },
  {
    path: 'project',
    loadComponent: () => import('./features/general/project/project.component')
      .then(mod => mod.ProjectComponent)
  },
  {
    path: 'skill',
    loadComponent: () => import('./features/general/skill/skill.component')
      .then(mod => mod.SkillComponent)
  },
  {
    path: 'resume',
    loadComponent: () => import('./features/general/resume/resume.component')
      .then(mod => mod.ResumeComponent)
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];
