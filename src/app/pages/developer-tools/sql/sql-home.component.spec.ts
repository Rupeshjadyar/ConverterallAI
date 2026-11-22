import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlHomeComponent } from './sql-home.component';

describe('SqlHomeComponent', () => {
  let component: SqlHomeComponent;
  let fixture: ComponentFixture<SqlHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlHomeComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
