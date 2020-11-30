declare module '*.vue' {
  import { ComponentOptions } from 'vue';
  import Vue from 'vue';

  const VueSingleFileComponent: ComponentOptions<Vue>;

  export default VueSingleFileComponent;
}
