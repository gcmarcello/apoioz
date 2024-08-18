// ./components/ReactControl.tsx
import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  Ref,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  Control,
  ControlOptions,
  DomUtil,
  DomEvent,
  Map as LeafletMap,
  Icon,
} from "leaflet";
import {
  ElementHook,
  LeafletProvider,
  LeafletElement,
  createElementHook,
  LeafletContextInterface,
  createControlHook,
  createDivOverlayComponent,
} from "@react-leaflet/core";

// Interfaces. IGNORE if you don't use Typescript
interface IDumbControl extends Control {}
interface PropsWithChildren {
  children?: ReactNode;
}
interface ControlOptionsWithChildren extends ControlOptions {
  children?: ReactNode;
}

/**
 * STEP 1: Create a Dumb Leaflet.Control component by extending
 * Dumb control just to stop click propagation
 * And let the children do its thing.
 */
const DumbControl = Control.extend({
  options: {
    className: "rounded-lg lg:min-w-[200px] w-[100px] bg-white p-2 shadow-md",
    onOff: "",
    handleOff: function noop() {},
  },

  onAdd() {
    const _controlDiv = DomUtil.create("div", this.options.className);

    DomEvent.on(_controlDiv, "click", (event) => {
      DomEvent.stopPropagation(event);
    });
    DomEvent.disableScrollPropagation(_controlDiv);
    DomEvent.disableClickPropagation(_controlDiv);

    return _controlDiv;
  },

  onRemove(map: any) {
    if (this.options.onOff) {
      map.off(this.options.onOff, this.options.handleOff, this);
    }

    return this;
  },
});

/*
 * STEP 2: This is how we force react to re-render.
 * IS A HACK but works
 *
 * Origin: https://github.com/LiveBy/react-leaflet-control/blob/master/lib/control.jsx
 * This is needed because the control is only attached to the map in
 * MapControl's componentDidMount, so the container is not available
 * until this is called. We need to now force a render so that the
 * portal and children are actually rendered.
 */
const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
};

// STEP 3: use "useForceUpdate" hook and
// attach your React component inside the Leaflet.Control
// with a ReactDOM.createPortal
export function createContainerComponent<E, P extends PropsWithChildren>(
  useElement: ElementHook<E, P>
) {
  function ContainerComponent(props: P, ref: Ref<E>) {
    const forceUpdate = useForceUpdate();
    const { instance, context } = useElement(props, null as any).current;
    const children = props.children;
    const contentNode = (instance as any).getContainer();

    useImperativeHandle(ref, () => instance);
    useEffect(() => {
      forceUpdate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentNode]);

    if (!children || !contentNode) return null;

    return createPortal(
      <LeafletProvider value={context}>{children}</LeafletProvider>,
      contentNode
    );
  }

  return forwardRef(ContainerComponent);
}

export function createControlComponent<
  E extends Control,
  P extends ControlOptionsWithChildren,
>(createInstance: (props: P) => E) {
  function createElement(
    props: P,
    context: LeafletContextInterface
  ): LeafletElement<E> {
    return { instance: createInstance(props), context };
  }
  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);
  return createContainerComponent(useControl);
}

const MapControl = createControlComponent<
  IDumbControl,
  ControlOptionsWithChildren
>(function createControlWithChildren(props) {
  return new DumbControl({ ...props });
});

export default MapControl;
