import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroupManagePage } from './group-manage.page';

describe('GroupManagePage', () => {
  let component: GroupManagePage;
  let fixture: ComponentFixture<GroupManagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupManagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroupManagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
