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
  viewMode: 'web' | 'pdf' = 'web';

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.user = user;
    });
    
    this.currentLang = this.translateService.currentLang || 'vi-VN';
    this.translateService.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  setViewMode(mode: 'web' | 'pdf') {
    this.viewMode = mode;
  }

  downloadPDF() {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Please allow popups to download the PDF');
      return;
    }

    // Temporarily switch to PDF mode to get the compact content
    const originalMode = this.viewMode;
    this.viewMode = 'pdf';
    
    // Wait for DOM to update
    setTimeout(() => {
      const resumeContent = document.getElementById('resume-content');
      if (!resumeContent) {
        this.viewMode = originalMode;
        return;
      }

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
            
            @page {
              size: A4;
              margin: 15mm;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.4;
              color: #333;
              background: white;
              font-size: 12px;
            }
            
            .resume-content {
              max-width: 210mm;
              margin: 0 auto;
              background: white;
            }
            
            .personal-info-card {
              display: flex;
              align-items: center;
              gap: 15px;
              padding: 15px;
              border: 1px solid #8b5cf6;
              border-radius: 8px;
              margin-bottom: 15px;
              background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(255, 107, 53, 0.05));
            }
            
            .profile-photo {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 2px solid #8b5cf6;
              object-fit: cover;
            }
            
            .name {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 3px;
            }
            
            .job-title {
              font-size: 14px;
              color: #8b5cf6;
              font-weight: 600;
              margin-bottom: 10px;
            }
            
            .contact-info {
              display: flex;
              flex-direction: column;
              gap: 3px;
            }
            
            .contact-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 11px;
              color: #666;
            }
            
            .resume-card {
              margin-bottom: 15px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 6px;
              background: white;
            }
            
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 6px;
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 3px;
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
            // Restore original view mode
            this.viewMode = originalMode;
          }, 500);
        };
      }, 100);
    }
}
