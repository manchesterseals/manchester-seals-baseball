import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RosterComponent } from './roster.component';

describe('RosterComponent', () => {
  let component: RosterComponent;
  let fixture: ComponentFixture<RosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RosterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display player data', () => {
    expect(component.players.length).toBe(6);
    expect(component.players[0].name).toBe('Joe Hanily');
    expect(component.players[0].position).toBe('Manager');
    expect(component.players[0].number).toBe('20');
  });
});
