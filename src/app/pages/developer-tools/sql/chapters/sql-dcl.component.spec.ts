import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlDclComponent } from './sql-dcl.component';

describe('SqlDclComponent', () => {
  let component: SqlDclComponent;
  let fixture: ComponentFixture<SqlDclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlDclComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlDclComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
