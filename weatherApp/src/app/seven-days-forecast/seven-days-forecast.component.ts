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
    imports: [IonicModule],
})
export class SevenDaysForecastComponent implements AfterViewInit {

    @ViewChild('forecastContainer', { read: ElementRef })
    forecastContainer!: ElementRef;

    showForecast = false;
    private openTopPx = 0;   
    private closedTopPx = 0; 
    private currentTopPx = 0;
    private startTopPx = 0;
    private openDragThresholdPx = 140;   
    private closeDragThresholdPx = 80;   

    constructor(private gestureCtrl: GestureController, private ngZone: NgZone) { }


    ngAfterViewInit() {
        this.initSwipeGesture();
        this.computePositions();
        requestAnimationFrame(() => {
            this.computePositions();
            requestAnimationFrame(() => this.computePositions());
        });
        this.currentTopPx = this.closedTopPx;
        this.startTopPx = this.closedTopPx;
        this.setTop(this.closedTopPx, false);
    }

    private initSwipeGesture() {
        const gesture = this.gestureCtrl.create({
            el: this.forecastContainer.nativeElement,
            direction: 'y',
            gestureName: 'forecast-swipe',
            threshold: 0,
      disableScroll: true,
      passive: false,
      gesturePriority: 100,
            onStart: () => {
                this.computePositions();
                this.startTopPx = this.currentTopPx;
                this.setTop(this.currentTopPx, false);
            },
            onMove: ev => {
                const openDownwards = this.openTopPx > this.closedTopPx;
                const proposed = openDownwards
                    ? this.startTopPx - ev.deltaY   
                    : this.startTopPx + ev.deltaY;  
                const clamped = this.clamp(proposed, this.openTopPx, this.closedTopPx);
                this.setTop(clamped, false);
            },
            onEnd: ev => {
        this.computePositions();
        let shouldOpen: boolean;
        if (ev.velocityY <= -0.3) {
          shouldOpen = true;
        } else if (ev.velocityY >= 0.3) {
          shouldOpen = false;
        } else {
          const distToOpen = Math.abs(this.currentTopPx - this.openTopPx);
          const distToClosed = Math.abs(this.currentTopPx - this.closedTopPx);
          if (distToOpen + this.openDragThresholdPx <= distToClosed) {
            shouldOpen = true;
          } else if (distToClosed + this.closeDragThresholdPx <= distToOpen) {
            shouldOpen = false;
          } else {
            shouldOpen = distToOpen <= distToClosed;
          }
        }
                const target = shouldOpen ? this.openTopPx : this.closedTopPx;
                this.setTop(target, true);
                this.ngZone.run(() => {
                    this.showForecast = shouldOpen;
                });
            },
        });

        gesture.enable();
    }

    private setTop(valuePx: number, animate: boolean) {
        const el = this.forecastContainer.nativeElement as HTMLElement;
        el.style.transition = animate ? 'top 300ms ease' : 'none';
        el.style.top = `${valuePx}px`;
        this.currentTopPx = valuePx;
    }

    private computePositions() {
        const el = this.forecastContainer.nativeElement as HTMLElement;
        const parent = (el.offsetParent as HTMLElement | null) ?? el.parentElement ?? document.body;
        const parentHeight = (parent as HTMLElement).clientHeight || window.innerHeight;
        const elBox = el.getBoundingClientRect();
        const elHeight = Math.max(el.offsetHeight || 0, el.scrollHeight || 0, elBox.height || 0);
        this.closedTopPx = 0;
        this.openTopPx = parentHeight - elHeight;
    }

    private clamp(value: number, minInclusive: number, maxInclusive: number): number {
        const min = Math.min(minInclusive, maxInclusive);
        const max = Math.max(minInclusive, maxInclusive);
        return Math.max(min, Math.min(max, value));
    }

}
