// ------------------------------------------ Setup Scene ------------------------------------------ //
// --- Set up Scene ---
const scene = new THREE.Scene();

// --- Add Axes Helper ---
const axesHelper = new THREE.AxesHelper(5); // The parameter sets the length of the axes
scene.add(axesHelper);

// --- Set up Renderer ---
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xadd8e6);  
renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// ------------------------------------------ Table ------------------------------------------ //

// --- Load the Table Texture ---
const textureLoader = new THREE.TextureLoader();
const tableTexture = textureLoader.load('woodtable.jpg'); // Update the path to your texture file

// --- Table Dimensions ---
const legHeight = 2.25;
const insetMargin = 0.2; // Margin for the inner trapezium

// --- Create Trapezium Shape ---
const createTrapeziumShape = (outer = true) => {
  const shape = new THREE.Shape();
  const margin = outer ? 0 : insetMargin;
  shape.moveTo(0 + margin, 0 + margin);
  shape.lineTo(4 - margin, 0 + margin);
  shape.lineTo(3 - margin, 3 - margin);
  shape.lineTo(1 + margin, 3 - margin);
  shape.lineTo(0 + margin, 0 + margin);
  return shape;
};

// --- Create Table Components ---
const createTable = () => {
  // Create the outer table (raised edge)
  const outerShape = createTrapeziumShape();
  const insetShape = createTrapeziumShape(false);
  outerShape.holes.push(new THREE.Path(insetShape.getPoints()));
  
  const outerGeometry = new THREE.ExtrudeGeometry(outerShape, { depth: 0.33, bevelEnabled: false });
  const outerMaterial = new THREE.MeshLambertMaterial({ map: tableTexture });
  const outerTable = new THREE.Mesh(outerGeometry, outerMaterial);
  outerTable.castShadow = true;

  // Create the inner flat surface
  const innerGeometry = new THREE.ExtrudeGeometry(createTrapeziumShape(false), { depth: 0.15, bevelEnabled: false });
  const innerMaterial = new THREE.MeshLambertMaterial({ map: tableTexture });
  const innerTable = new THREE.Mesh(innerGeometry, innerMaterial);
  innerTable.castShadow = true;

  // Position the table components
  [outerTable, innerTable].forEach((part) => {
    part.position.set(-2, 2.4, -1.5);
    part.rotation.x = Math.PI / 2;
    part.castShadow = true;
  });

  // Create table legs
  const legGeometry = new THREE.BoxGeometry(0.1, legHeight, 0.1);
  const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const legPositions = [
    [-1.75, -1.25],
    [1.75, -1.25],
    [0.75, 1.25],
    [-0.75, 1.25],
  ];
  
  const legs = legPositions.map(([x, z]) => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(x, legHeight / 2, z);
    leg.castShadow = true;
    return leg;
  });

  // Create bars to connect legs
  const createBar = (dimensions, position, rotation = 0) => {
    const barGeometry = new THREE.BoxGeometry(...dimensions);
    const barMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const bar = new THREE.Mesh(barGeometry, barMaterial);
    bar.position.set(...position);
    bar.rotation.y = rotation;
    bar.castShadow = true;
    return bar;
  };

  const bars = [
    createBar([0.1, 0.1, 2.7], [-1.25, 0.05, 0], Math.PI / 8.2),  // Bottom-left to top-left
    createBar([0.1, 0.1, 1.5], [0, 0.05, 1.25], Math.PI / 2),    // Left to right front
    createBar([0.1, 0.1, 2.7], [1.25, 0.05, 0], -Math.PI / 8.2), // Bottom-right to top-right
    createBar([0.1, 0.1, 3.5], [0, legHeight - 0.05, -1.25], Math.PI / 2), // Back bar
  ];

  // Group components into a single table
  const tableGroup = new THREE.Group();
  tableGroup.add(outerTable, innerTable, ...legs, ...bars);
  return tableGroup;
};

// Add the first table to the scene
const tableGroup = createTable();
scene.add(tableGroup);

// --- Create and Position Multiple Tables ---
const createTableGrid = (rows, cols, spacing) => {
  const offsetX = (cols - 1) * spacing / 2;
  const offsetZ = (rows - 1) * spacing / 2;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const tableClone = tableGroup.clone();
      tableClone.position.set(j * spacing - offsetX, 0, i * spacing - offsetZ);
      tableClone.castShadow = true;
      scene.add(tableClone);
    }
  }
};

// Create a 3x3 grid of furniture sets with 6 units spacing
createTableGrid(7, 7, 6);

// ------------------------------------------ Chair ------------------------------------------ //

// Create a group to hold all chair components
const chairGroup = new THREE.Group();

// Define shared settings and texture
const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 20,
    bevelSize: 0.08,
    bevelOffset: 0,
    bevelThickness: 0.1,
    curveSegments: 50
};
const seatTexture = textureLoader.load('seat.jpg');
const seatMaterial = new THREE.MeshLambertMaterial({ map: seatTexture });

// Helper function to create a rectangular shape
const createRectShape = (width, height) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0).lineTo(width, 0).lineTo(width, height).lineTo(0, height).lineTo(0, 0);
    return shape;
};

// Chair seat
const seatShape = createRectShape(1.3, 1.3);
const seatGeometry = new THREE.ExtrudeGeometry(seatShape, extrudeSettings);
const seat = new THREE.Mesh(seatGeometry, seatMaterial);
seat.position.set(-0.665, 1.24, -3.65);
seat.rotation.x = Math.PI / 2;
seat.castShadow = true;
chairGroup.add(seat);  // Add seat to the chair group

// Chair backrest
const backrestShape = createRectShape(1.15, 1);
const backrestGeometry = new THREE.ExtrudeGeometry(backrestShape, { ...extrudeSettings, depth: 0.05 });
const backrest = new THREE.Mesh(backrestGeometry, seatMaterial);
backrest.position.set(-0.575, 1.6, -3.9);
backrest.rotation.x = Math.PI / -15;
backrest.castShadow = true;
chairGroup.add(backrest);  // Add backrest to the chair group

// Define backrest edge shape and extrusion settings
const backrestEdgeShape = new THREE.Shape()
    .moveTo(0, 0)
    .lineTo(0.4, 0)
    .lineTo(0.4, 0.01)
    .lineTo(0, 0.01)
    .lineTo(0, 0);

const backrestEdgeSettings = {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 20,
    bevelSize: 0.045,
    bevelOffset: 0,
    bevelThickness: 0.1,
    curveSegments: 50
};

const backrestEdgeGeometry = new THREE.ExtrudeGeometry(backrestEdgeShape, backrestEdgeSettings);
const backrestEdgeMaterial = new THREE.MeshLambertMaterial({ map: seatTexture });

// Helper function to create backrest edges
const createBackrestEdge = (x, y, z, rotationX) => {
    const edge = new THREE.Mesh(backrestEdgeGeometry, backrestEdgeMaterial);
    edge.position.set(x, y, z);
    edge.rotation.x = rotationX;
    edge.castShadow = true;
    chairGroup.add(edge);  // Add edge to the chair group
};

// Create and position the backrest edges
createBackrestEdge(0.2, 2.7, -4.1, Math.PI / -15);
createBackrestEdge(-0.6, 2.7, -4.1, Math.PI / -15);

// Shared geometry and material for chair legs
const chairLegGeometry = new THREE.BoxGeometry(0.1, 1.3, 0.1);
const chairLegMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

// Helper function to create a chair leg
const createChairLeg = (x, y, z, rotationX) => {
    const leg = new THREE.Mesh(chairLegGeometry, chairLegMaterial);
    leg.position.set(x, y, z);
    leg.rotation.x = rotationX;
    leg.castShadow = true;
    chairGroup.add(leg);  // Add leg to the chair group
};

// Create and position chair legs
createChairLeg(0.8, 0.6, -2.21, Math.PI / -15); // Bottom-left corner
createChairLeg(0.8, 0.6, -3.79, Math.PI / 15);  // Bottom-right corner
createChairLeg(-0.8, 0.6, -2.21, Math.PI / -15); // Top-left corner
createChairLeg(-0.8, 0.6, -3.79, Math.PI / 15);  // Top-right corner


// Chair legs
// Shared geometry and material for under chair connections
const chairUnderLegGeometry = new THREE.BoxGeometry(0.1, 1.6, 0.1);
const chairUnderLegMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

// Helper function to create under chair connections
const createUnderChairConnection = (x, y, z) => {
    const connection = new THREE.Mesh(chairUnderLegGeometry, chairUnderLegMaterial);
    connection.position.set(x, y, z);
    connection.rotation.x = Math.PI / 2;
    connection.castShadow = true;
    chairGroup.add(connection);  // Add connection to the chair group
};

// Create and position under chair connections
createUnderChairConnection(0.7, 1.2, -3.05);  // Connection 1
createUnderChairConnection(-0.7, 1.2, -3.05); // Connection 2

const chairLegConnGeometry = new THREE.BoxGeometry(0.1, 1.4, 0.1);
const chairLegConnMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
// Helper function to create a chair leg connection
const createChairLegConnection = (x, y, z) => {
    const connection = new THREE.Mesh(chairLegConnGeometry, chairLegConnMaterial);
    connection.position.set(x, y, z);
    connection.rotation.x = Math.PI / 2;
    connection.castShadow = true;
    chairGroup.add(connection);  // Add connection to the chair group
};

// Create and position chair leg connections
createChairLegConnection(0.8, 1.2, -3);  // Connection between legs 1 and 2
createChairLegConnection(-0.8, 1.2, -3); // Connection between legs 3 and 4

// Define shared material
const sharedMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

// Helper function to create and position a mesh
const createMesh = (geometry, material, position, rotation, group) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;
    group.add(mesh);
};

// Chair side supports
const sideSupportGeometry = new THREE.BoxGeometry(0.1, 1.4, 0.1);
createMesh(sideSupportGeometry, sharedMaterial, [0.8, 1, -3], [Math.PI / 2, 0, 0], chairGroup);
createMesh(sideSupportGeometry, sharedMaterial, [-0.8, 1, -3], [Math.PI / 2, 0, 0], chairGroup);

// Under-front leg connection
const underFrontLegGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.1);
createMesh(underFrontLegGeometry, sharedMaterial, [0, 1.2, -2.3], [Math.PI / 2, 0, 0], chairGroup);

// Back leg supports
const backSupportGeometry = new THREE.BoxGeometry(0.1, 1.6, 0.1);
createMesh(backSupportGeometry, sharedMaterial, [0.7, 2, -3.96], [Math.PI / -15, 0, 0], chairGroup);
createMesh(backSupportGeometry, sharedMaterial, [-0.7, 2, -3.96], [Math.PI / -15, 0, 0], chairGroup);

// Chair top connection
const topGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.1);
createMesh(topGeometry, sharedMaterial, [0, 2.8, -4.13], [Math.PI / -15, 0, 0], chairGroup);

// Add the chair group to the scene
scene.add(chairGroup);

// Function to create and position multiple sets
const createChairGrid = (rows, cols, spacing) => {
    const offsetX = (cols - 1) * spacing / 2; // To center the grid horizontally
    const offsetZ = (rows - 1) * spacing / 2; // To center the grid vertically

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const chairClone = chairGroup.clone(); // Clone the entire set
            // Adjust position to center the grid around (0, 0, 0)
            chairClone.position.set(j * spacing - offsetX, 0, i * spacing - offsetZ); 
            chairClone.castShadow = true;
            scene.add(chairClone); // Add to the scene
        }
    }
};

// Create a 3x3 grid of furniture sets with 6 units spacing
createChairGrid(7, 7, 6);

// ------------------------------------------ Floor & Walls ------------------------------------------ //

// --- Load the Plane Texture ---
const floorTexture = textureLoader.load('laminate_floor_02_diff_4k.jpg'); // Update the path to your texture file

// --- Add a Plane (Floor) ---
const floorGeometry = new THREE.PlaneGeometry(50, 55);
const floorMaterial = new THREE.MeshLambertMaterial({ map: floorTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;  // Rotate plane to be horizontal
floor.position.y = 0;  // Position plane at y = 0
floor.receiveShadow = true;
scene.add(floor);

// --- Add Cream-Colored Walls ---
const FBwallGeometry = new THREE.PlaneGeometry(50, 10); // Adjust dimensions as needed
const FBwallMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFDD0 }); // Cream color (hex code)

const LRwallGeometry = new THREE.PlaneGeometry(55, 10); // Adjust dimensions as needed
const LRwallMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFDD0 }); // Cream color (hex code)

// Back Wall
const frontWall = new THREE.Mesh(FBwallGeometry, FBwallMaterial);
frontWall.position.set(0, 5, -27); // Center it on the Z-axis
scene.add(frontWall);

// Front Wall
const backWall = new THREE.Mesh(FBwallGeometry, FBwallMaterial);
backWall.position.set(0, 5, 27); // Center it on the Z-axis
backWall.rotation.y = Math.PI; // Rotate to face the opposite direction
scene.add(backWall);

// Glass Wall
const leftWall = new THREE.Mesh(LRwallGeometry, LRwallMaterial);
leftWall.position.set(-25, 5, 0); // Position on the negative X-axis
leftWall.rotation.y = Math.PI / 2; // Rotate to face inward
scene.add(leftWall);

// Right Wall
const rightWall = new THREE.Mesh(LRwallGeometry, LRwallMaterial);
rightWall.position.set(25, 5, 0); // Position on the positive X-axis
rightWall.rotation.y = -Math.PI / 2; // Rotate to face inward
scene.add(rightWall);

// ------------------------------------------ Doors ------------------------------------------ //

// --- Add Glass Doors on Left Wall ---
const glassDoorGeometry = new THREE.PlaneGeometry(4, 8); // Dimensions of the glass door (width x height)
const glassDoorMaterial = new THREE.MeshLambertMaterial({
    color: 0x87CEEB, // Light blue for glass
    transparent: true, // Enable transparency
    opacity: 0.4, // Set transparency level (0: fully transparent, 1: opaque)
});

// Glass Door
const glassDoor = new THREE.Mesh(glassDoorGeometry, glassDoorMaterial);
glassDoor.position.set(-24, 4, 0); // Position on the left wall (aligned with its center)
glassDoor.rotation.y = Math.PI / 2; // Rotate to align with the left wall
scene.add(glassDoor);

// --- Optional: Add a Door Frame ---
const doorFrameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown for the door frame
const frameThickness = 0.2;

// Top Frame
const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, frameThickness, frameThickness), 
    doorFrameMaterial
);
topFrame.position.set(-27.5, 8.1, 0); // Above the glass door
topFrame.rotation.y = Math.PI / 2;
scene.add(topFrame);

// Bottom Frame
const bottomFrame = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, frameThickness, frameThickness), 
    doorFrameMaterial
);
bottomFrame.position.set(-27.5, -0.1, 0); // Below the glass door
bottomFrame.rotation.y = Math.PI / 2;
scene.add(bottomFrame);

// Left Frame
const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, 8.2, frameThickness), 
    doorFrameMaterial
);
leftFrame.position.set(-27.5, 4, -2.1); // Left side of the glass door
leftFrame.rotation.y = Math.PI / 2;
scene.add(leftFrame);

// Right Frame
const rightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, 8.2, frameThickness), 
    doorFrameMaterial
);
rightFrame.position.set(-27.5, 4, 2.1); // Right side of the glass door
rightFrame.rotation.y = Math.PI / 2;
scene.add(rightFrame);

// ------------------------------------------ Realistic TV ------------------------------------------ //

// --- TV Border ---
// Create a black border for the TV
const tvBorderGeometry = new THREE.BoxGeometry(12, 5, 0.2); // Border dimensions
const tvBorderMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black border
const tvBorder = new THREE.Mesh(tvBorderGeometry, tvBorderMaterial);
tvBorder.castShadow = true;
tvBorder.receiveShadow = true;

// --- TV Screen ---
// Create a slightly smaller dark gray screen
const tvScreenGeometry = new THREE.BoxGeometry(11.3, 4.5, 0.1); // Screen dimensions
const tvScreenMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 }); // Dark gray screen
const tvScreen = new THREE.Mesh(tvScreenGeometry, tvScreenMaterial);

tvBorder.position.y = 1.0;
tvBorder.position.z = -0.38;
tvScreen.castShadow = true; 
tvScreen.receiveShadow = true; 

// Nest the screen inside the border
tvScreen.position.z = 0.06; // Slightly in front of the border
tvBorder.add(tvScreen);


// --- TV Stand ---
// Create a vertical stand connecting the TV to the base
const verticalSupportGeometry = new THREE.BoxGeometry(0.5, 5, 0.3); // Width, Height, Depth
const verticalSupportMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 }); // Dark gray stand
const verticalSupport = new THREE.Mesh(verticalSupportGeometry, verticalSupportMaterial);
verticalSupport.position.set(0, -2.8, 0.5); // Centered below the TV
verticalSupport.castShadow = true; 
verticalSupport.receiveShadow = true;

// Create the horizontal base for the stand
const baseGeometry = new THREE.BoxGeometry(5, 0.2, 1); // Width, Height, Depth
const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black base
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.set(0, -5.35, -0.5); // At the bottom
base.castShadow = true; 
base.receiveShadow = true;

// --- Feet ---
// Create two vertical supports and attach wheels at the bottom
const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
const verticalSupport1 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 7.5, 0.1),
    supportMaterial
);
verticalSupport1.position.set(-0.8, -1.5, -0.5);
verticalSupport1.castShadow = true;
verticalSupport1.receiveShadow = true;

const verticalSupport2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 7.5, 0.1),
    supportMaterial
);
verticalSupport2.position.set(0.8, -1.5, -0.5);
verticalSupport2.castShadow = true;
verticalSupport2.receiveShadow = true;

// --- Horizontal Black Bar (Bracket) ---
// Create a Horizontal bar to cover the vertical stand behind the TV
const bracketGeometry = new THREE.BoxGeometry(2.5, 1.0 ,0.1); 
const bracketMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 }); 
const tvBracket = new THREE.Mesh(bracketGeometry, bracketMaterial);

// Position the bracket to align with the stand and TV
tvBracket.position.set(0, 0.35, -0.15); // Adjust based on the TV's position
tvBorder.add(tvBracket); // Attach the bracket to the TV group

// --- Group the TV Components ---
// Group the border, stand, base, and vertical supports
const tvGroup = new THREE.Group();
tvGroup.add(tvBorder);
tvGroup.add(verticalSupport1);
tvGroup.add(verticalSupport2);
//tvGroup.add(tvBracket);
tvGroup.add(base);

// --- Rotate TV to Face the Table ---
// Rotate the TV group to face the table (180 degrees along the Y-axis)
tvGroup.rotation.y = Math.PI; // Equivalent to 180 degrees

// --- Position the TV ---
// Adjust the TV's position in the scene
tvGroup.position.set(0, 5.5, 25); // Elevated slightly and placed back

// Add the TV to the scene
scene.add(tvGroup);

// ------------------------------------------ Features ------------------------------------------ //

// --- Add Lights ---
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// --- Create the Camera ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
camera.position.y = 5;
camera.lookAt(0, 0, 0);

// --- Set up OrbitControls ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Enable damping for smoother rotation
controls.dampingFactor = 0.1;
controls.minDistance = 0;  // Minimum zoom distance
controls.maxDistance = 50; // Maximum zoom distance
controls.enablePan = true; // Enable panning
controls.enableRotate = true; // Enable rotation
controls.enableZoom = true; // Enable zooming

// --- Add GUI for Light Controls ---
const gui = new dat.GUI();
const lightFolder = gui.addFolder('Directional Light');

// Add sliders for controlling directional light position
lightFolder.add(directionalLight.position, 'x', -20, 20).name('Position X');
lightFolder.add(directionalLight.position, 'y', -20, 20).name('Position Y');
lightFolder.add(directionalLight.position, 'z', -20, 20).name('Position Z');

// Add slider for controlling directional light intensity
lightFolder.add(directionalLight, 'intensity', 0, 5).name('Intensity');

// Add slider for controlling ambient light intensity
const ambientFolder = gui.addFolder('Ambient Light');
ambientFolder.add(ambientLight, 'intensity', 0, 5).name('Intensity');

lightFolder.open();
ambientFolder.open();

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Ensure controls are updated
    renderer.render(scene, camera);
}
animate();

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});