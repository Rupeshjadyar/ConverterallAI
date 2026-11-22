import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlDmlComponent } from './sql-dml.component';

describe('SqlDmlComponent', () => {
  let component: SqlDmlComponent;
  let fixture: ComponentFixture<SqlDmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDmlComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDmlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
