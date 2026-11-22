import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sql-code-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sql-code-box.component.html',
  styleUrls: ['./sql-code-box.component.css']
})
export class SqlCodeBoxComponent {
  @Input() code: string = '';
  @Input() title: string = '';
  @Input() output?: string;
  @Input() isRunnable: boolean = true;

  private router = inject(Router);
  copied = signal<boolean>(false);

  copyCode() {
    if (!this.code) return;
    navigator.clipboard?.writeText(this.code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  runInPlayground() {
    this.router.navigate(['/developer-tools/sql/playground'], {
      queryParams: { q: this.code.trim() }
    });
  }
}
