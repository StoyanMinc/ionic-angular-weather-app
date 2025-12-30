import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { GestureController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-seven-days-forecast',
  templateUrl: './seven-days-forecast.component.html',
  styleUrls: ['./seven-days-forecast.component.scss'],
  standalone: true,
  imports: [IonicModule], // ✅ REQUIRED
})
export class SevenDaysForecastComponent implements AfterViewInit {

  @ViewChild('forecastContainer', { read: ElementRef })
  forecastContainer!: ElementRef;

  showForecast = false;
  private openBottomPx = -40; // fully open target (matches .show-forecast)
  private closedBottomPx = -390; // will be read from computed style on init if available
  private currentBottomPx = -390;
  private startBottomPx = -390;
  // Tuning thresholds
  private openDragThresholdPx = 140;   // require longer upward drag to open
  private closeDragThresholdPx = 80;   // shorter downward drag to close
  private openProgressThreshold = 0.7; // require >70% open to snap open
  private closeProgressThreshold = 0.4; // <40% open snaps closed

  constructor(private gestureCtrl: GestureController, private ngZone: NgZone) { }


  ngAfterViewInit() {
    this.initSwipeGesture();
    // Initialize measured positions
    const el = this.forecastContainer.nativeElement as HTMLElement;
    const computed = window.getComputedStyle(el);
    const bottom = parseFloat(computed.bottom);
    if (!Number.isNaN(bottom)) {
      this.closedBottomPx = bottom;
      this.currentBottomPx = bottom;
      this.startBottomPx = bottom;
    }
    // Ensure inline bottom is set so we can animate/drag reliably
    this.setBottom(this.closedBottomPx, false);
  }

  private initSwipeGesture() {
    const gesture = this.gestureCtrl.create({
      el: this.forecastContainer.nativeElement,
      direction: 'y',
      gestureName: 'forecast-swipe',
      threshold: 0,
      onStart: () => {
        // Prepare for dragging: freeze current bottom and remove transition
        this.startBottomPx = this.currentBottomPx;
        this.setBottom(this.currentBottomPx, false);
      },
      onMove: ev => {
        // Drag by adjusting absolute bottom based on deltaY
        // deltaY < 0 means user moved up -> increase bottom (move sheet up)
        const proposed = this.startBottomPx - ev.deltaY;
        const clamped = this.clamp(proposed, this.openBottomPx, this.closedBottomPx);
        this.setBottom(clamped, false);
      },
      onEnd: ev => {
        const movedUpBy = this.currentBottomPx - this.startBottomPx; // positive if dragged up, negative if dragged down
        const range = this.openBottomPx - this.closedBottomPx; // positive (e.g., 310)
        const progress = (this.currentBottomPx - this.closedBottomPx) / range; // 0 (closed) -> 1 (open)
        let shouldOpen: boolean;
        if (ev.velocityY <= -0.25) {
          // quick fling up -> open
          shouldOpen = true;
        } else if (ev.velocityY >= 0.25) {
          // quick fling down -> close
          shouldOpen = false;
        } else if (movedUpBy >= this.openDragThresholdPx) {
          // dragged up past threshold -> open
          shouldOpen = true;
        } else if (movedUpBy <= -this.closeDragThresholdPx) {
          // dragged down past threshold -> close
          shouldOpen = false;
        } else {
          // fallback: use asymmetric progress thresholds
          if (progress >= this.openProgressThreshold) {
            shouldOpen = true;
          } else if (progress <= this.closeProgressThreshold) {
            shouldOpen = false;
          } else {
            // middle zone: choose based on last state
            shouldOpen = this.showForecast;
          }
        }
        const target = shouldOpen ? this.openBottomPx : this.closedBottomPx;
        this.setBottom(target, true);
        this.ngZone.run(() => {
          this.showForecast = shouldOpen;
        });
      },
    });

    gesture.enable();
  }

  private setBottom(valuePx: number, animate: boolean) {
    const el = this.forecastContainer.nativeElement as HTMLElement;
    el.style.transition = animate ? 'bottom 300ms ease' : 'none';
    el.style.bottom = `${valuePx}px`;
    this.currentBottomPx = valuePx;
  }

  private clamp(value: number, minInclusive: number, maxInclusive: number): number {
    // Note: min could be greater than max if using negatives, so normalize bounds
    const min = Math.min(minInclusive, maxInclusive);
    const max = Math.max(minInclusive, maxInclusive);
    return Math.max(min, Math.min(max, value));
  }

}
