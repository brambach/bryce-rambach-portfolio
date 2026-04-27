import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectFromUrl } from './use-project-from-url';

describe('useProjectFromUrl', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

  it('returns null when no ?project= present', () => {
    const { result } = renderHook(() => useProjectFromUrl());
    expect(result.current.openSlug).toBeNull();
  });

  it('reads the initial slug from the URL', () => {
    window.history.replaceState({}, '', '/?project=dd-portal');
    const { result } = renderHook(() => useProjectFromUrl());
    expect(result.current.openSlug).toBe('dd-portal');
  });

  it('openProject pushes ?project= and updates state', () => {
    const { result } = renderHook(() => useProjectFromUrl());
    act(() => result.current.openProject('sidequest'));
    expect(window.location.search).toBe('?project=sidequest');
    expect(result.current.openSlug).toBe('sidequest');
  });

  it('closeProject removes ?project= and updates state', () => {
    window.history.replaceState({}, '', '/?project=ops-portal');
    const { result } = renderHook(() => useProjectFromUrl());
    act(() => result.current.closeProject());
    expect(window.location.search).toBe('');
    expect(result.current.openSlug).toBeNull();
  });

  it('responds to popstate events', () => {
    const { result } = renderHook(() => useProjectFromUrl());
    act(() => {
      window.history.pushState({}, '', '/?project=portfolio');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(result.current.openSlug).toBe('portfolio');
  });
});
