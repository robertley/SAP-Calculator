import { describe, expect, it } from 'vitest';
import { createAppShellBoardFacade } from 'app/ui/shell/components/app-shell-board.facade';

type PetSelectorStub = {
  showSelectionDialog: boolean;
};

function makeAppStub(options?: {
  overlayOpen?: boolean;
  petSelectors?: PetSelectorStub[];
}) {
  return {
    overlayState: {
      showSelectionDialog: options?.overlayOpen ?? false,
    },
    petSelectors: {
      toArray: () => options?.petSelectors ?? [],
    },
  } as Parameters<typeof createAppShellBoardFacade>[0];
}

describe('createAppShellBoardFacade', () => {
  it('disables pet slot dragging while the global item selector is open', () => {
    const facade = createAppShellBoardFacade(
      makeAppStub({
        overlayOpen: true,
      }),
    );

    expect(facade.petSlotDragDisabled).toBe(true);
  });

  it('disables pet slot dragging while a pet selector item dialog is open', () => {
    const facade = createAppShellBoardFacade(
      makeAppStub({
        petSelectors: [{ showSelectionDialog: false }, { showSelectionDialog: true }],
      }),
    );

    expect(facade.petSlotDragDisabled).toBe(true);
  });

  it('keeps pet slot dragging enabled when no item selector is open', () => {
    const facade = createAppShellBoardFacade(
      makeAppStub({
        petSelectors: [{ showSelectionDialog: false }],
      }),
    );

    expect(facade.petSlotDragDisabled).toBe(false);
  });
});
