/* eslint-disable no-console */
import { useRef } from 'react';

export default function useRenderDebug(name: string) {
  const render = useRef(0);
  console.log(`${name} has rendered ${++render.current} times.`);
}
