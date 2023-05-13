export class Pixel {
    x!: number;
    y!: number;
    width!: number;
    height!: number;
    constructor( x: number,  y: number, width: number, height: number) {
      this.x = Math.floor(x);
      this.y = Math.floor(y);
      this.width = width;
      this.height = height;
    }
  }