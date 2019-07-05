/* 
Copyright 2019 Fabian Hiller

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. 
*/

import * as React from "react";

import { useRef, useState, useEffect } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";

const GCodeViewer3D = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  let containerDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scene) {
      console.log("already initiaions");
    } else {
      const newScene = new Scene();

      var camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );

      var renderer = new WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerDiv!.current!.appendChild(renderer.domElement);
      var geometry = new BoxGeometry(1, 1, 1);
      var material = new MeshBasicMaterial({ color: 0x00ff00 });
      var cube = new Mesh(geometry, material);
      newScene.add(cube);

      camera.position.z = 5;

      renderer.render(newScene, camera);
      setScene(newScene);
    }
  });
  return <div ref={containerDiv} />;
};

export default GCodeViewer3D;
