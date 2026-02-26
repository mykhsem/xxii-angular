import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { skip } from 'rxjs/operators';
import { UiStateService } from './ui-state.service';

describe('UiStateService', () => {
  let service: UiStateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have null active item by default', () => {
    expect(service.snapshot.activeItemId).toBeNull();
    expect(service.snapshot.activeItemType).toBeNull();
  });

  it('selectItem() updates activeItemType and activeItemId', () => {
    service.selectItem('chat', 'chat-1');
    expect(service.snapshot.activeItemType).toBe('chat');
    expect(service.snapshot.activeItemId).toBe('chat-1');
  });

  it('selectItem() emits new state via observable', async () => {
    const next = firstValueFrom(service.state.pipe(skip(1)));
    service.selectItem('feed', 'feed-1');
    const state = await next;
    expect(state.activeItemType).toBe('feed');
    expect(state.activeItemId).toBe('feed-1');
  });

  it('openRightPanel() sets rightPanelOpen and rightPanelTab', () => {
    service.openRightPanel('members');
    expect(service.snapshot.rightPanelOpen).toBe(true);
    expect(service.snapshot.rightPanelTab).toBe('members');
  });

  it('closeRightPanel() resets rightPanelOpen and rightPanelTab', () => {
    service.openRightPanel('pins');
    service.closeRightPanel();
    expect(service.snapshot.rightPanelOpen).toBe(false);
    expect(service.snapshot.rightPanelTab).toBeNull();
  });

  it('toggleLeftSidebar() flips leftSidebarOpen', () => {
    const initial = service.snapshot.leftSidebarOpen;
    service.toggleLeftSidebar();
    expect(service.snapshot.leftSidebarOpen).toBe(!initial);
  });

  it('toggleLeftSidebar() persists to localStorage', () => {
    service.toggleLeftSidebar();
    const stored = localStorage.getItem('xxii.ui.leftSidebarOpen');
    expect(stored).toBe(String(service.snapshot.leftSidebarOpen));
  });

  it('setLeftSidebarOpen() sets and persists state', () => {
    service.setLeftSidebarOpen(false);
    expect(service.snapshot.leftSidebarOpen).toBe(false);
    expect(localStorage.getItem('xxii.ui.leftSidebarOpen')).toBe('false');
  });

  it('loads leftSidebarOpen from localStorage on init', () => {
    localStorage.setItem('xxii.ui.leftSidebarOpen', 'false');
    // Bypass the singleton cache by constructing directly (loadSidebarState reads localStorage at construction time)
    const freshService = new UiStateService();
    expect(freshService.snapshot.leftSidebarOpen).toBe(false);
  });
});
