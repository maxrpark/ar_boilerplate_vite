import { Clock } from "three";
import EventEmitter from "./EventEmitter";

export class Time extends EventEmitter {
  start: number;
  current: number;
  delta: number;
  elapsed: number;
  clock: Clock;
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.delta = 16;
    this.elapsed = 0;
    this.clock = new Clock();

    window.requestAnimationFrame(() => this.tick());
  }
  tick() {
    const currentTime = this.clock.getElapsedTime();
    this.delta = currentTime - this.current;
    this.elapsed = this.current - this.start;
    this.current = currentTime;

    this.trigger("tick");
    window.requestAnimationFrame(() => this.tick());
  }
}
