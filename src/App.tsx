import { useBundleStore } from "./store/bundleStore";

function App() {
  const items = useBundleStore((state) => state.items);
  const increment = useBundleStore((state) => state.increment);
  const decrement = useBundleStore((state) => state.decrement);

  const camera = items.find(
    (item) =>
      item.productId === "wyze-cam-v4" &&
      item.variantId === "white"
  );

  return (
    <main>
      <h1>Bundle Builder</h1>

      <p>
        Wyze Cam v4: {camera?.quantity ?? 0}
      </p>

      <button
        onClick={() =>
          decrement("wyze-cam-v4", "white")
        }
      >
        -
      </button>

      <button
        onClick={() =>
          increment("wyze-cam-v4", "white")
        }
      >
        +
      </button>
    </main>
  );
}

export default App;