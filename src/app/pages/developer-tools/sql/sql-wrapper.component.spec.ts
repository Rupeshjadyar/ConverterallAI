import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlWrapperComponent } from './sql-wrapper.component';

describe('SqlWrapperComponent', () => {
  let component: SqlWrapperComponent;
  let fixture: ComponentFixture<SqlWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlWrapperComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlWrapperComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
