import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketResultPage } from './ticket-result.page';

describe('TicketResultPage', () => {
  let component: TicketResultPage;
  let fixture: ComponentFixture<TicketResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketResultPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
