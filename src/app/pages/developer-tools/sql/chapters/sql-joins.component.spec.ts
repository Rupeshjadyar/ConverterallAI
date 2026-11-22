import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlJoinsComponent } from './sql-joins.component';

describe('SqlJoinsComponent', () => {
  let component: SqlJoinsComponent;
  let fixture: ComponentFixture<SqlJoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlJoinsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlJoinsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
