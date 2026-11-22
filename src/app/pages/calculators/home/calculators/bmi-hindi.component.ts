import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BMI_EN, BMI_HINDI } from '../../../../data/tool-locales.data';

@Component({
  selector: 'app-bmi-hindi',
  imports: [RouterLink],
  template: `
    <section lang="hi-IN">
      <h1>{{ copy.name }}</h1>
      <p>{{ copy.description }}</p>
      <form (submit)="$event.preventDefault(); calculate(weight.valueAsNumber, height.valueAsNumber)">
        <label for="weight-hi">वज़न (किलोग्राम)</label>
        <input id="weight-hi" #weight type="number" min="0.1" step="any" required>
        <label for="height-hi">कद (सेंटीमीटर)</label>
        <input id="height-hi" #height type="number" min="0.1" step="any" required>
        <button type="submit">बीएमआई निकालें</button>
      </form>
      <output aria-live="polite">{{ result() }}</output>
      <h2>गणना कैसे करें</h2>
      <ol>@for (step of copy.steps; track step) { <li>{{ step }}</li> }</ol>
      <p>बीएमआई का सूत्र है वज़न (किलोग्राम) ÷ कद (मीटर)²।</p>
      <p>बीएमआई स्वास्थ्य का एक सामान्य संकेतक है।</p>
      <a [routerLink]="english" lang="en-IN" hreflang="en-IN">BMI calculator in English</a>
    </section>
  `,
  styles: `
    section { max-inline-size: 44rem; margin-inline: auto; padding: 1rem; }
    form { display: grid; gap: .5rem; max-inline-size: 24rem; }
    input, button { min-block-size: 44px; padding: .5rem; font: inherit; }
    output { display: block; min-block-size: 2rem; margin-block: 1rem; }
  `,
})
export class BmiHindiComponent {
  protected readonly copy = BMI_HINDI;
  protected readonly english = BMI_EN;
  protected readonly result = signal('');

  protected calculate(weight: number, height: number): void {
    const bmi = weight / (height / 100) ** 2;
    if (weight > 0 && height > 0 && Number.isFinite(bmi)) {
      this.result.set('आपका बीएमआई: ' + new Intl.NumberFormat('hi-IN', { maximumFractionDigits: 1 }).format(bmi));
    }
  }
}
