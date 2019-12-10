import {Component, h, Listen, Prop, State, Element} from "@stencil/core";
import CustomTheme from "../../decorators/CustomTheme";

@Component({
  tag: 'psk-slideshow',
  shadow: true
})
export class PskPageLoader {
  @CustomTheme()
  @Prop() images: string;
  @Prop() top: string;
  @Prop() title: string;
  @Prop() caption: string;
  @State() imagesSrcs: Array<string>;
  @State() slideshowHeight;
  @State() marginTop;
  @Prop() fadeSeconds:number = 1;
  @Prop() visibleSeconds:number = 10;

  @Element() element;

  componentWillLoad() {
    this.marginTop = this.element.getBoundingClientRect().y;
    this.checkLayout();
    this.imagesSrcs = this.images.split(",");
    this.getAnimationCSS();
  }

  @Listen("resize", {capture: true, target: 'window'})
  checkLayout() {
    this.slideshowHeight = document.documentElement.clientHeight - this.marginTop;
  }

  renderSlide(imageSrc, id) {
    let slide =
      <li id={"slide-" + id} class={"animation-" + id}
          style={{backgroundImage: "url(" + imageSrc + ")"}}>
      </li>;
    return slide;
  }

  getAnimationCSS() {
    let frameDuration = this.fadeSeconds + this.visibleSeconds;
    let animationTime = 100 / ((frameDuration) * this.imagesSrcs.length);
    let fadeStyle = `@keyframes fade {
    0% { opacity: 0; }
    ${animationTime * this.fadeSeconds}% { opacity: 1; }
    ${animationTime * (frameDuration)}% { opacity: 1; }
    ${animationTime * (frameDuration + this.fadeSeconds)}% { opacity: 0; }
    100% { opacity: 0; }
  }`;

    for (let idx = 0; idx < this.imagesSrcs.length; idx++) {
      fadeStyle += `#psk-slider li:nth-child(${idx}) {
        animation-delay: ${frameDuration * idx}s;
        }`
    }

    fadeStyle += `#psk-slider li{animation-duration: ${frameDuration * this.imagesSrcs.length}s;}`;

    let styleElement = document.createElement("style");
    styleElement.innerHTML = fadeStyle;
    this.element.shadowRoot.prepend(styleElement);
  }

  render() {
    let slides = [];
    this.imagesSrcs.forEach((imageSrc, idx) => {
      slides.push(this.renderSlide(imageSrc, idx));
    });

    let title = this.title ? <div class="title">
      {this.title}
    </div> : null;

    let caption = this.caption ? <div class="caption">
      {this.caption}
    </div> : null;

    let actions = this.element.children.length > 0 ?
      <div class="actions">
        <slot/>
      </div> : null;

    let content = null;
    if (title || caption || actions) {
      content = <div class="container">
        <div class="content">
          {[title, caption, actions]}
        </div>
      </div>
    }

    return <div class="psk-slideshow">
      <div class="psk-slideshow-container">
        {content}
        <div id="psk-content-slider">
          <div id="psk-slider">
            <div id="psk-slider-mask" style={{height: this.slideshowHeight + "px"}}>
              <ul>
                {slides}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}