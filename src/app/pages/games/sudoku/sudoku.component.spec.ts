import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SudokuComponent } from './sudoku.component';

describe('SudokuComponent', () => {
  let component: SudokuComponent;
  let fixture: ComponentFixture<SudokuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SudokuComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SudokuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
