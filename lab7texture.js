import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
const loader = new THREE.TextureLoader();
//
// SCENE
//

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

//
// CAMERA
//

const camera = new THREE.PerspectiveCamera(
	60,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

camera.position.set(0, 7.5, 23);
camera.lookAt(0, 2.5, 0);

//
// RENDERER
//

const renderer = new THREE.WebGLRenderer({
	antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

//
// TEXTURES
//

const floorColor = loader.load("textures/floor/woodColor.jpg");
const floorNormal = loader.load("textures/floor/woodNormal.jpg");
const floorRoughness = loader.load("textures/floor/woodRoughness.jpg");

const doorColor = loader.load("textures/door/doorColor.jpg");
const doorNormal = loader.load("textures/door/doorNormal.jpg");
const doorRoughness = loader.load("textures/door/doorRoughness.jpg");

const tvColor = loader.load("textures/tvStand/tvColor.jpg");
const tvNormal = loader.load("textures/tvStand/tvNormal.jpg");
const tvRoughness = loader.load("textures/tvStand/tvRoughness.jpg");

const fireColor = loader.load("textures/fireplace/fireColor.jpg");
const fireNormal = loader.load("textures/fireplace/fireNormal.jpg");
const fireRoughness = loader.load("textures/fireplace/fireRoughness.jpg");

const windowColor = loader.load("textures/window/windowColor.jpg");
const windowNormal = loader.load("textures/window/windowNormal.jpg");
const windowRoughness = loader.load("textures/window/windowRoughness.jpg");

const outside = loader.load("textures/outside/outside.jpg");
//
// LIGHTING
//

const ambientLight = new THREE.AmbientLight(
	0xffffff,
	0.8
);

scene.add(ambientLight);

const roomLight = new THREE.PointLight(
	0xfff4cc,
	80
);

roomLight.position.set(0, 7, 0);
roomLight.castShadow = true;
scene.add(roomLight);

const fireplaceLight = new THREE.PointLight(
	0xff6600,
	35
);

fireplaceLight.position.set(-7, 1.5, -9.5);
scene.add(fireplaceLight);

//
// OUTISIDE VIEW
//

const outsideView = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 6),
	new THREE.MeshBasicMaterial({
		map: outside,
		side: THREE.DoubleSide
	})
);

outsideView.position.set(7, 4, -15);
scene.add(outsideView);

//
// FLOOR
//

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(24, 24),
	new THREE.MeshStandardMaterial({
    	map: floorColor,
    	normalMap: floorNormal,
    	roughnessMap: floorRoughness
	})
);

floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

scene.add(floor);

//
// CEILING
//

const ceiling = new THREE.Mesh(
	new THREE.PlaneGeometry(24, 24),
	new THREE.MeshStandardMaterial({
		color: 0xf5f5f5
	})
);

ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 8;

scene.add(ceiling);

//
// WALLS
//

const wallMaterial = new THREE.MeshStandardMaterial({
	color: 0xe7dfd4
});

function createWall(x, y, z, w, h, d) {

	const wall = new THREE.Mesh(
		new THREE.BoxGeometry(w, h, d),
		wallMaterial
	);

	wall.position.set(x, y, z);
	wall.receiveShadow = true;

	scene.add(wall);
}

createWall(-10.85, 4, -12, 2.3, 8, 0.5);
createWall(-4, 4, -12, 4.6, 8, 0.5);
createWall(4, 4, -12, 4.6, 8, 0.5);
createWall(10.85, 4, -12, 2.3, 8, 0.5);
createWall(0, 2.25, -12, 24, 4.5, 0.5);
createWall(0, 7.45, -12, 24, 1.1, 0.5);
createWall(-12, 4, 0, 0.5, 8, 24);
createWall(12, 4, 0, 0.5, 8, 24);

//
// WINDOW
//

const windowFrameMaterial = new THREE.MeshStandardMaterial({
	map: windowColor,
	normalMap: windowNormal,
	roughnessMap: windowRoughness
});

const windowGlassMaterial = new THREE.MeshPhysicalMaterial({
	color: 0xd9f2ff,
	transparent: true,
	opacity: 0.2,
	side: THREE.DoubleSide
});

function createWindow(x) {
	const frameParts = [
		{ width: 0.12, height: 2.5, x: -1.65, y: 0 },
		{ width: 0.12, height: 2.5, x: 1.65, y: 0 },
		{ width: 3.4, height: 0.12, x: 0, y: -1.2 },
		{ width: 3.4, height: 0.12, x: 0, y: 1.2 },
		{ width: 0.1, height: 2.3, x: 0, y: 0 },
		{ width: 3.2, height: 0.1, x: 0, y: 0 }
	];

	frameParts.forEach(({ width, height, x: offsetX, y }) => {
		const part = new THREE.Mesh(
			new THREE.BoxGeometry(width, height, 0.18),
			windowFrameMaterial
		);
		part.position.set(x + offsetX, 5.7 + y, -11.62);
		scene.add(part);
	});

	const glass = new THREE.Mesh(
		new THREE.PlaneGeometry(3.1, 2.3),
		windowGlassMaterial
	);
	glass.position.set(x, 5.7, -11.72);
	scene.add(glass);
}

[-8, 0, 8].forEach(createWindow);

// Exterior scenery sits behind the back wall and is visible through the panes.
const outdoorGround = new THREE.Mesh(
	new THREE.PlaneGeometry(200, 200),
	new THREE.MeshBasicMaterial({ color: 0x5d9b45 })
);
outdoorGround.rotation.x = -Math.PI / 2;
outdoorGround.position.set(0, -0.1, -70);
scene.add(outdoorGround);

const outdoorTreeTrunk = new THREE.Mesh(
	new THREE.CylinderGeometry(0.35, 0.5, 5, 12),
	new THREE.MeshBasicMaterial({ color: 0x70452a })
);
outdoorTreeTrunk.position.set(8, 2.5, -32);
scene.add(outdoorTreeTrunk);

const outdoorTreeLeaves = new THREE.Mesh(
	new THREE.SphereGeometry(2.8, 16, 12),
	new THREE.MeshBasicMaterial({ color: 0x347b38 })
);
outdoorTreeLeaves.position.set(8, 6, -32);
scene.add(outdoorTreeLeaves);

//
// TV STAND
//

const tvStand = new THREE.Mesh(
	new THREE.BoxGeometry(5, 1, 1.5),
	new THREE.MeshStandardMaterial({
		map: tvColor,
		normalMap: tvNormal,
		roughnessMap: tvRoughness
	})
);

tvStand.position.set(0, 0.8, -10.5);
tvStand.castShadow = true;
scene.add(tvStand);

//
// TV
//

const tv = new THREE.Mesh(
	new THREE.BoxGeometry(4, 2.2, 0.2),
	new THREE.MeshStandardMaterial({
		color: 0x111111,
		emissive: 0x2244ff,
		emissiveIntensity: 0.5
	})
);

tv.position.set(0, 3, -10);
scene.add(tv);

//
// SOFA
//

const sofaMaterial = new THREE.MeshStandardMaterial({
	color: 0x505050
});

const sofaSeat = new THREE.Mesh(
	new THREE.BoxGeometry(6, 1, 3),
	sofaMaterial
);

sofaSeat.position.set(0, 1, 3);
scene.add(sofaSeat);

const sofaBack = new THREE.Mesh(
	new THREE.BoxGeometry(6, 2, 0.5),
	sofaMaterial
);

sofaBack.position.set(0, 2, 1.8);
scene.add(sofaBack);

//
// COFFEE TABLE
//

const coffeeTable = new THREE.Mesh(
	new THREE.BoxGeometry(4, 0.3, 2),
	new THREE.MeshStandardMaterial({
		color: 0x654321
	})
);

coffeeTable.position.set(0, 1.25, -1);
scene.add(coffeeTable);

//
// MAGAZINE
//

const magazine = new THREE.Mesh(
	new THREE.BoxGeometry(1, 0.05, 0.7),
	new THREE.MeshStandardMaterial({
		color: 0xff0000
	})
);

magazine.position.set(1, 1.45, -1);
magazine.rotation.y = Math.PI / 8;

scene.add(magazine);

//
// FIREPLACE
//

const fireplace = new THREE.Mesh(
	new THREE.BoxGeometry(4, 3, 1),
	new THREE.MeshStandardMaterial({
		map: fireColor,
		normalMap: fireNormal,
		roughnessMap: fireRoughness
	})
);

fireplace.position.set(-7, 1.5, -10.5);

scene.add(fireplace);

const fire = new THREE.Mesh(
	new THREE.BoxGeometry(2, 1, 0.4),
	new THREE.MeshStandardMaterial({
		color: 0xff8800,
		emissive: 0xff5500,
		emissiveIntensity: 2
	})
);

fire.position.set(-7, 1.5, -9.9);

scene.add(fire);

//
// DOOR
//

const door = new THREE.Mesh(
	new THREE.BoxGeometry(2, 4, 0.15),
	new THREE.MeshStandardMaterial({
		map: doorColor,
		normalMap: doorNormal,
		roughnessMap: doorRoughness
	})
);

door.position.set(-11.7, 2, 6);
door.rotation.y = Math.PI / 2;

scene.add(door);

const knob = new THREE.Mesh(
	new THREE.SphereGeometry(0.08, 16, 16),
	new THREE.MeshStandardMaterial({
		color: 0xffd700
	})
);

knob.position.set(-11.55, 2, 6.6);

scene.add(knob);

//
// CEILING FAN
//

const fanGroup = new THREE.Group();

const fanRod = new THREE.Mesh(
	new THREE.CylinderGeometry(0.05, 0.05, 1),
	new THREE.MeshStandardMaterial({
		color: 0x555555
	})
);

fanRod.position.y = -0.5;
fanGroup.add(fanRod);

const fanHub = new THREE.Mesh(
	new THREE.CylinderGeometry(0.3, 0.3, 0.5, 20),
	new THREE.MeshStandardMaterial({
		color: 0x444444
	})
);

fanHub.rotation.x = Math.PI / 2;
fanGroup.add(fanHub);

for(let i = 0; i < 4; i++)
{
	const blade = new THREE.Mesh(
		new THREE.BoxGeometry(3, 0.08, 0.4),
		new THREE.MeshStandardMaterial({
			color: 0x8b5a2b
		})
	);

	blade.rotation.y = i * Math.PI / 2;

	fanGroup.add(blade);
}

fanGroup.position.set(0, 7.5, 0);

scene.add(fanGroup);

//
// LAMP
//

const lampPole = new THREE.Mesh(
	new THREE.CylinderGeometry(0.08, 0.08, 4),
	new THREE.MeshStandardMaterial({
		color: 0xaaaaaa
	})
);

lampPole.position.set(7, 2, 2);

scene.add(lampPole);

const lampShade = new THREE.Mesh(
	new THREE.ConeGeometry(0.7, 1.2, 20),
	new THREE.MeshStandardMaterial({
		color: 0xffffdd
	})
);

lampShade.position.set(7, 4.2, 2);

scene.add(lampShade);

const lampLight = new THREE.PointLight(0xffd894, 24, 12);
lampLight.position.set(7, 3.8, 2);
scene.add(lampLight);

//
// LIGHT TOGGLE
//

let lightsOn = true;

document
	.getElementById("toggleLight")
	.addEventListener("click", () => {

		lightsOn = !lightsOn;

		ambientLight.intensity =
			lightsOn ? 0.8 : 0.1;

		roomLight.intensity =
			lightsOn ? 80 : 0;
	});

let fanRunning = true;

document
	.getElementById("toggleFan")
	.addEventListener("click", (event) => {
		fanRunning = !fanRunning;
		event.currentTarget.textContent =
			`Fan: ${fanRunning ? "On" : "Off"}`;
		event.currentTarget.setAttribute("aria-pressed", fanRunning);
	});

let lampOn = true;

document
	.getElementById("toggleLamp")
	.addEventListener("click", (event) => {
		lampOn = !lampOn;
		lampLight.visible = lampOn;
		event.currentTarget.textContent =
			`Lamp: ${lampOn ? "On" : "Off"}`;
		event.currentTarget.setAttribute("aria-pressed", lampOn);
	});

//
// ANIMATION
//

function animate()
{
	requestAnimationFrame(animate);

	if (fanRunning) {
		fanGroup.rotation.y += 0.15;
	}

	fire.material.emissiveIntensity =
		1.7 + Math.sin(Date.now() * 0.01) * 0.5;

	fireplaceLight.intensity =
		30 + Math.sin(Date.now() * 0.02) * 8;

	renderer.render(scene, camera);
}

animate();

//
// RESIZE
//

window.addEventListener("resize", () => {

	camera.aspect =
		window.innerWidth / window.innerHeight;

	camera.updateProjectionMatrix();

	renderer.setSize(
		window.innerWidth,
		window.innerHeight
	);
});