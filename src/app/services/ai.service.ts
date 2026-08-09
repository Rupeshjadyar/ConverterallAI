import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor() {}

  suggestImprovements(text: string, type: 'action_verbs' | 'quantify'): Observable<string> {
    // Mocking an AI response for now
    let suggestion = '';
    if (type === 'action_verbs') {
      suggestion = 'Led a small team to successfully complete project deliverables...';
    } else {
      suggestion = 'Managed a team of 5 to increase productivity by 20%...';
    }
    
    // Simulate network delay
    return of(suggestion).pipe(delay(1000));
  }
}
