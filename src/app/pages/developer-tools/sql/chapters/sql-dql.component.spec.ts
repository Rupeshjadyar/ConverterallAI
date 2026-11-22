import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlDqlComponent } from './sql-dql.component';

describe('SqlDqlComponent', () => {
  let component: SqlDqlComponent;
  let fixture: ComponentFixture<SqlDqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDqlComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDqlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
