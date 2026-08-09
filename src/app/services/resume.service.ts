import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ResumeData } from '../models/resume.model';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private defaultData: ResumeData = {
    personalDetails: {
      fullName: 'Rahul Sharma',
      jobTitle: 'Professional',
      email: 'ramoznexample.com',
      phone: '30122355573',
      website: 'ramasinn@gmail.com',
      summary: ''
    },
    experience: [
      {
        id: '1',
        jobTitle: 'Team Lead',
        company: 'Company Comple, Inc.',
        startDate: 'July 2022',
        endDate: 'June 2024',
        description: 'Team lead in tarah kaam kiya. small teams.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Rahul Sharma (Star sit Ame)',
        school: 'Education - Success',
        startDate: '2018',
        endDate: '2022',
        description: ''
      }
    ],
    skills: ['Skills', 'Stnari', 'Patation']
  };

  private resumeDataSubject = new BehaviorSubject<ResumeData>(this.defaultData);
  resumeData$ = this.resumeDataSubject.asObservable();

  updateData(data: ResumeData) {
    this.resumeDataSubject.next({ ...data });
  }

  getCurrentData(): ResumeData {
    return this.resumeDataSubject.getValue();
  }
}
