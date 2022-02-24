import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterConfirmPage } from './register-confirm.page';

describe('RegisterConfirmPage', () => {
  let component: RegisterConfirmPage;
  let fixture: ComponentFixture<RegisterConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterConfirmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
