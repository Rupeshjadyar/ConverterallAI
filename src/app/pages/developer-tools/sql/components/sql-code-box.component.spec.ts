import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SqlCodeBoxComponent } from './sql-code-box.component';

describe('SqlCodeBoxComponent', () => {
  let component: SqlCodeBoxComponent;
  let fixture: ComponentFixture<SqlCodeBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SqlCodeBoxComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SqlCodeBoxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
