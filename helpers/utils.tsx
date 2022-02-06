import { svgSource } from '~/components/BarycLoader.tsx';

// Eventually not used, should be removed ?
function generateRandomTypeOfLoader() {
  const loaderTypes = Object.keys(svgSource);
  return loaderTypes[Math.floor(Math.random() * loaderTypes.length)];
}

export { generateRandomTypeOfLoader };
