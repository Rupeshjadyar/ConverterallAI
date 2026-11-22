import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlGroupByComponent } from './sql-group-by.component';

describe('SqlGroupByComponent', () => {
  let component: SqlGroupByComponent;
  let fixture: ComponentFixture<SqlGroupByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlGroupByComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlGroupByComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
