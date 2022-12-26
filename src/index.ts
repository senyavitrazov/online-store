import { DualSlider } from './ts/dual-slider';
import { ProductCard } from './ts/product-card';
import { Checkbox } from './ts/checkbox-filter';
window.customElements.define('dual-slider', DualSlider);
window.customElements.define('product-card', ProductCard);
const checkbox = new Checkbox();
checkbox.drawcheckboxCategories();
checkbox.drawcheckboxBrand();