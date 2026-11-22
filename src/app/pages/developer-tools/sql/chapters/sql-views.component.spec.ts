import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlViewsComponent } from './sql-views.component';

describe('SqlViewsComponent', () => {
  let component: SqlViewsComponent;
  let fixture: ComponentFixture<SqlViewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlViewsComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlViewsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
