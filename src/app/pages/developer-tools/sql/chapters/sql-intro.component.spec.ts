import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlIntroComponent } from './sql-intro.component';

describe('SqlIntroComponent', () => {
  let component: SqlIntroComponent;
  let fixture: ComponentFixture<SqlIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlIntroComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlIntroComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
