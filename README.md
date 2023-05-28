# 3D Physics Simulation - REALTIME CG PHYS Final Project

Authors

- Nut Pinyo (@bombnp)
- Saenyakorn Siangsanoh (@saenyakorn)

## To start:

1. Install dependencies. We are using `pnpm`.`npm` or `yarn` could work but lockfiles are not provided for those package managers.

```bash
pnpm install
```

2. Run the dev server

```bash
pnpm dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Overview

This is a 3D Physics Simulation project for REALTIME CG PHYS class. We are using [react-three-fiber](https://github.com/pmndrs/react-three-fiber) for rendering and [cannon](https://github.com/pmndrs/use-cannon) for physics simulation.

## Shoutout

This project is inspired by, and contains model objects from, @Domenicobrz's car physics repository [Domenicobrz/R3F-in-practice](https://github.com/Domenicobrz/R3F-in-practice/tree/main/car-physics).

## Details

We have a scene composed of 4 objects:

- An ambient light.
- Plane is a flat plane mesh with a plane collider that is used as the ground. It has `MeshReflectorMaterial` for reflecting lights from objects and the environment.
- Track is a GLTF model downloaded from [Domenicobrz/R3F-in-practice](https://github.com/Domenicobrz/R3F-in-practice/tree/main/car-physics) and scaled up to match our actor size. Colliders
- Actor is a box mesh with a box collider that is used as the player. You can control it with WASD keys to move in 4 directions, QE keys to rotate the camera, and Space key to jump.

The Actor object also contains a CameraControl and an update loop. The update loop constantly handles the camera's rotation (QE), the actor's movement (WASD), and camera follow logic.
The camera's position is calculated from actor's current position plus an offset. THe offset is calculated from camera's current rotation angle (polar coordinates) and a constant height.

In the lower left corner of the UI, we can switch between 2 camera modes:

- Decoration: This mode allows customizing the Actor's material colors. The Actor cannot move in this mode.
- Play: This mode allows the Actor to move as normal.
