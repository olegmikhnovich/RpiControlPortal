import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SSHComponent } from './ssh.component';

describe('SSHComponent', () => {
  let component: SSHComponent;
  let fixture: ComponentFixture<SSHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SSHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SSHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
