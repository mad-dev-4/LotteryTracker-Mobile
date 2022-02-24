import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TicketNewPage } from './ticket-new.page';

describe('TicketNewPage', () => {
  let component: TicketNewPage;
  let fixture: ComponentFixture<TicketNewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketNewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
