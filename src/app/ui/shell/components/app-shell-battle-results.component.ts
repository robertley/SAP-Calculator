import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { AppComponent } from '../app.component';

type TabletPane = 'battle' | 'logs';

@Component({
  selector: 'app-shell-battle-results',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  templateUrl: './app-shell-battle-results.component.html',
})
export class AppShellBattleResultsComponent
  implements AfterViewInit, OnInit
{
  @Input({ required: true }) app: AppComponent;

  @ViewChild('battleSplitContainer')
  private battleSplitContainer?: ElementRef<HTMLElement>;

  @ViewChild('animationSplitContainer')
  private animationSplitContainer?: ElementRef<HTMLElement>;

  @ViewChild('logsAnalysisSplitContainer')
  private logsAnalysisSplitContainer?: ElementRef<HTMLElement>;

  @ViewChild('analysisSplitContainer')
  private analysisSplitContainer?: ElementRef<HTMLElement>;

  leftPaneWidthPx: number | null = null;

  animationTopHeightPx: number | null = null;

  logsTopHeightPx: number | null = null;

  timelineTopHeightPx: number | null = null;

  isTabletTabsLayout = false;

  activeTabletPane: TabletPane = 'battle';

  private readonly dividerStorageKey = 'sap.battleLogs.leftPaneWidthPx';

  private readonly tabletMediaQuery =
    '(min-width: 768px) and (max-width: 991.98px)';

  private readonly minPaneWidthPx = 320;

  private readonly minSectionHeightPx = 160;

  private resizeStartX = 0;

  private resizeStartY = 0;

  private resizeStartWidth = 0;

  private resizeContainerWidth = 0;

  private resizing = false;

  private animationResizing = false;

  private logsAnalysisResizing = false;

  private analysisResizing = false;

  ngOnInit(): void {
    this.updateTabletTabsLayoutState();
  }

  ngAfterViewInit(): void {
    this.updateTabletTabsLayoutState();

    if (typeof window === 'undefined') {
      return;
    }

    const storedRaw = window.localStorage.getItem(this.dividerStorageKey);
    if (!storedRaw) {
      return;
    }

    const storedWidth = Number(storedRaw);
    if (!Number.isFinite(storedWidth) || storedWidth <= 0) {
      return;
    }

    this.leftPaneWidthPx = this.clampPaneWidth(
      storedWidth,
      this.getSplitContainerWidth(),
    );
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateTabletTabsLayoutState();

    if (this.leftPaneWidthPx != null) {
      this.leftPaneWidthPx = this.clampPaneWidth(
        this.leftPaneWidthPx,
        this.getSplitContainerWidth(),
      );
    }

    if (this.animationTopHeightPx != null) {
      this.animationTopHeightPx = this.clampSectionHeight(
        this.animationTopHeightPx,
        this.getAnimationSplitHeight(),
      );
    }

    if (this.logsTopHeightPx != null) {
      this.logsTopHeightPx = this.clampSectionHeight(
        this.logsTopHeightPx,
        this.getLogsAnalysisSplitHeight(),
      );
    }

    if (this.timelineTopHeightPx != null) {
      this.timelineTopHeightPx = this.clampSectionHeight(
        this.timelineTopHeightPx,
        this.getAnalysisSplitHeight(),
      );
    }
  }

  setTabletActivePane(pane: TabletPane): void {
    this.activeTabletPane = pane;
  }

  onDividerPointerDown(event: PointerEvent): void {
    if (this.isTabletTabsLayout) {
      return;
    }

    const divider = event.target as HTMLElement | null;
    const splitContainer = divider?.closest('.bottom-container') as HTMLElement | null;
    const leftPane = splitContainer?.querySelector(
      '.battle-pane',
    ) as HTMLElement | null;
    if (!splitContainer || !leftPane) {
      return;
    }

    this.resizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartWidth = leftPane.getBoundingClientRect().width;
    this.resizeContainerWidth = this.getSplitContainerWidth();
    divider.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onDividerPointerMove(event: PointerEvent): void {
    if (!this.resizing) {
      return;
    }

    const deltaX = event.clientX - this.resizeStartX;
    const requestedWidth = this.resizeStartWidth + deltaX;
    this.leftPaneWidthPx = this.clampPaneWidth(
      requestedWidth,
      this.resizeContainerWidth,
    );
  }

  onDividerPointerUp(event: PointerEvent): void {
    if (!this.resizing) {
      return;
    }

    this.resizing = false;
    const divider = event.target as HTMLElement | null;
    divider?.releasePointerCapture?.(event.pointerId);

    if (this.leftPaneWidthPx != null && typeof window !== 'undefined') {
      window.localStorage.setItem(
        this.dividerStorageKey,
        `${Math.round(this.leftPaneWidthPx)}`,
      );
    }
  }

  onPaneDividerKeyDown(event: KeyboardEvent): void {
    if (this.isTabletTabsLayout) {
      return;
    }

    const nextWidth = this.getNextSizeFromKeyboard(
      event,
      this.leftPaneWidthPx,
      this.getSplitContainerWidth(),
      this.minPaneWidthPx,
      this.clampPaneWidth.bind(this),
    );
    if (nextWidth == null) {
      return;
    }

    this.leftPaneWidthPx = nextWidth;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        this.dividerStorageKey,
        `${Math.round(this.leftPaneWidthPx)}`,
      );
    }
  }

  onAnimationDividerPointerDown(event: PointerEvent): void {
    const divider = event.target as HTMLElement | null;
    const splitContainer = divider?.closest(
      '.vertical-resizable-stack',
    ) as HTMLElement | null;
    const topPane = splitContainer?.querySelector(
      '.animation-top-pane',
    ) as HTMLElement | null;
    if (!splitContainer || !topPane) {
      return;
    }

    this.animationResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeStartWidth = topPane.getBoundingClientRect().height;
    this.resizeContainerWidth = this.getAnimationSplitHeight();
    divider.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onAnimationDividerPointerMove(event: PointerEvent): void {
    if (!this.animationResizing) {
      return;
    }

    const deltaY = event.clientY - this.resizeStartY;
    const requestedHeight = this.resizeStartWidth + deltaY;
    this.animationTopHeightPx = this.clampSectionHeight(
      requestedHeight,
      this.resizeContainerWidth,
    );
  }

  onAnimationDividerPointerUp(event: PointerEvent): void {
    if (!this.animationResizing) {
      return;
    }

    this.animationResizing = false;
    const divider = event.target as HTMLElement | null;
    divider?.releasePointerCapture?.(event.pointerId);
  }

  onAnimationDividerKeyDown(event: KeyboardEvent): void {
    const nextHeight = this.getNextSizeFromKeyboard(
      event,
      this.animationTopHeightPx,
      this.getAnimationSplitHeight(),
      this.minSectionHeightPx,
      this.clampSectionHeight.bind(this),
      true,
    );
    if (nextHeight == null) {
      return;
    }

    this.animationTopHeightPx = nextHeight;
  }

  onLogsAnalysisDividerPointerDown(event: PointerEvent): void {
    const divider = event.target as HTMLElement | null;
    const splitContainer = divider?.closest(
      '.vertical-resizable-stack',
    ) as HTMLElement | null;
    const topPane = splitContainer?.querySelector(
      '.logs-top-pane',
    ) as HTMLElement | null;
    if (!splitContainer || !topPane) {
      return;
    }

    this.logsAnalysisResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeStartWidth = topPane.getBoundingClientRect().height;
    this.resizeContainerWidth = this.getLogsAnalysisSplitHeight();
    divider.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onLogsAnalysisDividerPointerMove(event: PointerEvent): void {
    if (!this.logsAnalysisResizing) {
      return;
    }

    const deltaY = event.clientY - this.resizeStartY;
    const requestedHeight = this.resizeStartWidth + deltaY;
    this.logsTopHeightPx = this.clampSectionHeight(
      requestedHeight,
      this.resizeContainerWidth,
    );
  }

  onLogsAnalysisDividerPointerUp(event: PointerEvent): void {
    if (!this.logsAnalysisResizing) {
      return;
    }

    this.logsAnalysisResizing = false;
    const divider = event.target as HTMLElement | null;
    divider?.releasePointerCapture?.(event.pointerId);
  }

  onLogsAnalysisDividerKeyDown(event: KeyboardEvent): void {
    const nextHeight = this.getNextSizeFromKeyboard(
      event,
      this.logsTopHeightPx,
      this.getLogsAnalysisSplitHeight(),
      this.minSectionHeightPx,
      this.clampSectionHeight.bind(this),
      true,
    );
    if (nextHeight == null) {
      return;
    }

    this.logsTopHeightPx = nextHeight;
  }

  onAnalysisDividerPointerDown(event: PointerEvent): void {
    const divider = event.target as HTMLElement | null;
    const splitContainer = divider?.closest(
      '.vertical-resizable-stack',
    ) as HTMLElement | null;
    const topPane = splitContainer?.querySelector(
      '.timeline-top-pane',
    ) as HTMLElement | null;
    if (!splitContainer || !topPane) {
      return;
    }

    this.analysisResizing = true;
    this.resizeStartX = event.clientX;
    this.resizeStartY = event.clientY;
    this.resizeStartWidth = topPane.getBoundingClientRect().height;
    this.resizeContainerWidth = this.getAnalysisSplitHeight();
    divider.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  }

  onAnalysisDividerPointerMove(event: PointerEvent): void {
    if (!this.analysisResizing) {
      return;
    }

    const deltaY = event.clientY - this.resizeStartY;
    const requestedHeight = this.resizeStartWidth + deltaY;
    this.timelineTopHeightPx = this.clampSectionHeight(
      requestedHeight,
      this.resizeContainerWidth,
    );
  }

  onAnalysisDividerPointerUp(event: PointerEvent): void {
    if (!this.analysisResizing) {
      return;
    }

    this.analysisResizing = false;
    const divider = event.target as HTMLElement | null;
    divider?.releasePointerCapture?.(event.pointerId);
  }

  onAnalysisDividerKeyDown(event: KeyboardEvent): void {
    const nextHeight = this.getNextSizeFromKeyboard(
      event,
      this.timelineTopHeightPx,
      this.getAnalysisSplitHeight(),
      this.minSectionHeightPx,
      this.clampSectionHeight.bind(this),
      true,
    );
    if (nextHeight == null) {
      return;
    }

    this.timelineTopHeightPx = nextHeight;
  }

  private getSplitContainerWidth(): number {
    return (
      this.battleSplitContainer?.nativeElement.getBoundingClientRect().width ?? 0
    );
  }

  private getAnimationSplitHeight(): number {
    return (
      this.animationSplitContainer?.nativeElement.getBoundingClientRect().height ??
      0
    );
  }

  private getLogsAnalysisSplitHeight(): number {
    return (
      this.logsAnalysisSplitContainer?.nativeElement.getBoundingClientRect().height ??
      0
    );
  }

  private getAnalysisSplitHeight(): number {
    return (
      this.analysisSplitContainer?.nativeElement.getBoundingClientRect().height ?? 0
    );
  }

  private updateTabletTabsLayoutState(): void {
    this.isTabletTabsLayout = this.isTabletViewport();
  }

  private isTabletViewport(): boolean {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia(this.tabletMediaQuery).matches;
  }

  private clampPaneWidth(requestedWidth: number, containerWidth: number): number {
    if (!Number.isFinite(containerWidth) || containerWidth <= 0) {
      return Math.max(this.minPaneWidthPx, requestedWidth);
    }

    const maxPaneWidth = Math.max(
      this.minPaneWidthPx,
      containerWidth - this.minPaneWidthPx,
    );
    return Math.min(
      maxPaneWidth,
      Math.max(this.minPaneWidthPx, requestedWidth),
    );
  }

  private clampSectionHeight(
    requestedHeight: number,
    containerHeight: number,
  ): number {
    if (!Number.isFinite(containerHeight) || containerHeight <= 0) {
      return Math.max(this.minSectionHeightPx, requestedHeight);
    }

    const maxSectionHeight = Math.max(
      this.minSectionHeightPx,
      containerHeight - this.minSectionHeightPx,
    );
    return Math.min(
      maxSectionHeight,
      Math.max(this.minSectionHeightPx, requestedHeight),
    );
  }

  private getNextSizeFromKeyboard(
    event: KeyboardEvent,
    currentValue: number | null,
    containerSize: number,
    minValue: number,
    clamp: (requested: number, container: number) => number,
    vertical = false,
  ): number | null {
    const step = event.shiftKey ? 48 : 24;
    const min = minValue;
    const max = Math.max(minValue, containerSize - minValue);
    const current = currentValue ?? clamp(containerSize / 2, containerSize);

    let requested: number | null = null;
    if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) {
      requested = current - step;
    } else if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight')) {
      requested = current + step;
    } else if (event.key === 'Home') {
      requested = min;
    } else if (event.key === 'End') {
      requested = max;
    }

    if (requested == null) {
      return null;
    }

    event.preventDefault();
    return clamp(requested, containerSize);
  }

}
