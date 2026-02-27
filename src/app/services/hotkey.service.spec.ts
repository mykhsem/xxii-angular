import { TestBed } from '@angular/core/testing';
import { HotkeyService } from './hotkey.service';
import { UiStateService } from './ui-state.service';

describe('HotkeyService', () => {
  let service: HotkeyService;
  let uiState: UiStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotkeyService);
    uiState = TestBed.inject(UiStateService);
    service.init();
  });

  function dispatch(key: string, ctrlKey = false): void {
    const event = new KeyboardEvent('keydown', { key, ctrlKey, bubbles: true });
    document.dispatchEvent(event);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Escape closes right panel', () => {
    uiState.openRightPanel('search');
    dispatch('Escape');
    expect(uiState.snapshot.rightPanelOpen).toBe(false);
    expect(uiState.snapshot.rightPanelTab).toBeNull();
  });

  it('Ctrl+F opens search panel', () => {
    dispatch('f', true);
    expect(uiState.snapshot.rightPanelOpen).toBe(true);
    expect(uiState.snapshot.rightPanelTab).toBe('search');
  });

  it('Ctrl+P opens pins panel', () => {
    dispatch('p', true);
    expect(uiState.snapshot.rightPanelOpen).toBe(true);
    expect(uiState.snapshot.rightPanelTab).toBe('pins');
  });

  it('init() is idempotent — calling twice does not double-register', () => {
    const spy = vi.spyOn(uiState, 'closeRightPanel');
    service.init();
    service.init();
    uiState.openRightPanel('search');
    dispatch('Escape');
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
