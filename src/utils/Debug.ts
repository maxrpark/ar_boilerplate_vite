export default class Debug {
  active: boolean;
  //@ts-ignore
  ui: lil.GUI;
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      //@ts-ignore

      const GUI = lil.GUI;
      //  const gui = new GUI();
      this.ui = new GUI();
      this.ui.close();
      this.active = true;
      return;
    }
  }
}
