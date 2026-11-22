import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlSubqueriesComponent } from './sql-subqueries.component';

describe('SqlSubqueriesComponent', () => {
  let component: SqlSubqueriesComponent;
  let fixture: ComponentFixture<SqlSubqueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlSubqueriesComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlSubqueriesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
