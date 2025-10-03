import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-resume',
  imports: [CommonModule, TranslateModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit {
  private translateService = inject(TranslateService);
  private userService = inject(UserService);
  
  user: any = null;
  currentLang = 'vi-VN';

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
    
    this.currentLang = this.translateService.currentLang || 'vi-VN';
    this.translateService.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  downloadPDF() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to download the PDF');
      return;
    }

    // Get the resume content
    const resumeContent = document.getElementById('resume-content');
    if (!resumeContent) return;

    // Create the HTML content for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Resume - ${this.user?.name || 'Phạm Tấn Thuận'}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            
            .resume-content {
              max-width: 800px;
              margin: 0 auto;
              background: white;
            }
            
            .personal-info-card {
              display: flex;
              align-items: center;
              gap: 20px;
              padding: 20px;
              border: 2px solid #8b5cf6;
              border-radius: 10px;
              margin-bottom: 20px;
              background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(255, 107, 53, 0.05));
            }
            
            .profile-photo {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 3px solid #8b5cf6;
              object-fit: cover;
            }
            
            .name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            
            .job-title {
              font-size: 16px;
              color: #8b5cf6;
              font-weight: 600;
              margin-bottom: 15px;
            }
            
            .contact-info {
              display: flex;
              flex-direction: column;
              gap: 5px;
            }
            
            .contact-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              color: #666;
            }
            
            .resume-card {
              margin-bottom: 20px;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
              background: white;
            }
            
            .section-title {
              font-size: 18px;
              font-weight: bold;
              color: #333;
              margin-bottom: 15px;
              display: flex;
              align-items: center;
              gap: 8px;
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 5px;
            }
            
            .skills-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            
            .skill-category h4 {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-bottom: 8px;
            }
            
            .skill-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 5px;
            }
            
            .skill-tag {
              background: #f3f4f6;
              border: 1px solid #8b5cf6;
              color: #333;
              padding: 3px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .experience-item, .education-item {
              margin-bottom: 15px;
            }
            
            .experience-header, .education-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 5px;
            }
            
            .experience-header h4, .education-header h4 {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
            
            .experience-period, .education-period {
              background: #8b5cf6;
              color: white;
              padding: 2px 8px;
              border-radius: 10px;
              font-size: 12px;
              font-weight: 500;
            }
            
            .company, .university {
              font-size: 14px;
              color: #8b5cf6;
              font-weight: 600;
              margin-bottom: 5px;
            }
            
            .experience-list {
              list-style: none;
              padding: 0;
            }
            
            .experience-list li {
              position: relative;
              padding-left: 15px;
              margin-bottom: 3px;
              font-size: 13px;
              color: #666;
            }
            
            .experience-list li::before {
              content: '▸';
              position: absolute;
              left: 0;
              color: #8b5cf6;
              font-weight: bold;
            }
            
            .specialization {
              font-size: 13px;
              color: #666;
            }
            
            .achievements-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 10px;
            }
            
            .achievement-item {
              display: flex;
              gap: 10px;
              align-items: flex-start;
            }
            
            .achievement-icon {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: white;
              flex-shrink: 0;
            }
            
            .first-place {
              background: #f59e0b;
            }
            
            .second-place {
              background: #6b7280;
            }
            
            .achievement-content h4 {
              font-size: 14px;
              font-weight: 600;
              color: #333;
              margin-bottom: 3px;
            }
            
            .achievement-content p {
              font-size: 12px;
              color: #666;
              margin-bottom: 3px;
            }
            
            .achievement-year {
              font-size: 11px;
              color: #999;
              font-weight: 500;
            }
            
            .languages-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px;
            }
            
            .language-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
            }
            
            .language-name {
              font-weight: 600;
              color: #333;
              font-size: 13px;
            }
            
            .language-level {
              font-size: 12px;
              color: #666;
              font-weight: 500;
            }
            
            .about-text {
              font-size: 14px;
              line-height: 1.5;
              color: #666;
            }
            
            @media print {
              body {
                padding: 0;
              }
              
              .resume-content {
                max-width: none;
              }
            }
          </style>
        </head>
        <body>
          ${resumeContent.innerHTML}
        </body>
      </html>
    `;

    // Write content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  }
}
