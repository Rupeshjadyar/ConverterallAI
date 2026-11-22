import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlTutorialComponent } from './sql-tutorial.component';

describe('SqlTutorialComponent', () => {
  let component: SqlTutorialComponent;
  let fixture: ComponentFixture<SqlTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlTutorialComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlTutorialComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
