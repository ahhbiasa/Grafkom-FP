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

// ------------------------------------------ Table ------------------------------------------ //

// --- Load the Table Texture ---
const textureLoader = new THREE.TextureLoader();
const TableTexture = textureLoader.load('woodtable.jpg'); // Update the path to your texture file

// --- Table Dimensions ---
const legHeight = 2.25;

// --- Create the Trapezium Table Top ---
var tableshape = new THREE.Shape();
tableshape.moveTo(0, 0);        // Start at one corner of the trapezium
tableshape.lineTo(4, 0);        // Draw the bottom edge
tableshape.lineTo(3, 3);        // Draw the right slanted edge
tableshape.lineTo(1, 3);        // Draw the top edge
tableshape.lineTo(0, 0);        // Draw the left slanted edge to close the shape

// Define the inset trapezium (scaled down by a margin) for the inner part of the table
const insetMargin = 0.2; // The margin between the main shape and the inset
const inset = new THREE.Path();
inset.moveTo(insetMargin, insetMargin);                           // Bottom-left (inner)
inset.lineTo(4 - insetMargin, insetMargin);                       // Bottom-right (inner)
inset.lineTo(3 - insetMargin, 3 - insetMargin);                   // Top-right (inner)
inset.lineTo(1 + insetMargin, 3 - insetMargin);                   // Top-left (inner)
inset.lineTo(insetMargin, insetMargin);                           // Close the inset

// Add the inset as a hole to the main shape
tableshape.holes.push(inset);

// --- Extrude the Outer Edge Higher (Perimeter) ---
var tableextrudeSettingsOuter = { 
    depth: 0.33,         // Slightly raise the perimeter only (outer part)
    bevelEnabled: false // No bevels for sharp edges
};

// Create the extruded geometry for the outer part
const outerGeometry = new THREE.ExtrudeGeometry(tableshape, tableextrudeSettingsOuter);
const outerMaterial = new THREE.MeshLambertMaterial({ map: TableTexture }); 
const outerTable = new THREE.Mesh(outerGeometry, outerMaterial);

// Position and rotate the outer perimeter (raised edge)
outerTable.position.set(-2, 2.4, -1.5); // Adjust position to align with the scene
outerTable.rotation.x = Math.PI / 2;    // Lay flat on the X-axis
outerTable.castShadow = true;
scene.add(outerTable);

// --- Create the Flat Inner Part of the Table ---
var coverShape = new THREE.Shape();
coverShape.moveTo(insetMargin, insetMargin);        // Start at the inner corner
coverShape.lineTo(4 - insetMargin, insetMargin);    // Draw the bottom edge
coverShape.lineTo(3 - insetMargin, 3 - insetMargin); // Draw the right slanted edge
coverShape.lineTo(1 + insetMargin, 3 - insetMargin); // Draw the top edge
coverShape.lineTo(insetMargin, insetMargin);        // Draw the left slanted edge to close the shape

// Define a thin extrusion for the cover (just to close the top)
var coverExtrudeSettings = { 
    depth: 0.15,         // A thin cover just to close the top without affecting the depth
    bevelEnabled: false // No bevels for sharp edges
};

// Create the extruded geometry for the cover (the thin top layer to close the hole)
const coverGeometry = new THREE.ExtrudeGeometry(coverShape, coverExtrudeSettings);
const coverMaterial = new THREE.MeshLambertMaterial({ map: TableTexture }); // Replace with your texture if needed
const coverTable = new THREE.Mesh(coverGeometry, coverMaterial);

// Position and rotate the cover (thin layer on top)
coverTable.position.set(-2, 2.4, -1.5); // Same position to align with the scene
coverTable.rotation.x = Math.PI / 2;    // Lay flat on the X-axis
coverTable.castShadow = true;
scene.add(coverTable);

// --- Create the Table Legs ---
const legGeometry = new THREE.BoxGeometry(0.1, legHeight, 0.1);
const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

// Position each leg at the corners of the trapezium tabletop
const leg1 = new THREE.Mesh(legGeometry, legMaterial);
leg1.position.set(-1.75, legHeight / 2, -1.25); // Bottom-left corner
leg1.castShadow = true;
scene.add(leg1);

const leg2 = leg1.clone();
leg2.position.set(1.75, legHeight / 2, -1.25); // Bottom-right corner
leg2.castShadow = true;
scene.add(leg2);

const leg3 = leg1.clone();
leg3.position.set(0.75, legHeight / 2, 1.25); // Top-right corner
leg3.castShadow = true;
scene.add(leg3);

const leg4 = leg1.clone();
leg4.position.set(-0.75, legHeight / 2, 1.25); // Top-left corner
leg4.castShadow = true;
scene.add(leg4);

// --- Create Bars to Connect the Legs ---
const barGeometry = new THREE.BoxGeometry(0.1, 0.1, 2.7); // Adjust the length as needed
const barMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

const frontbarGeometry = new THREE.BoxGeometry(0.1, 0.1, 1.5); // Adjust the length as needed
const frontbarMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

const backbarGeometry = new THREE.BoxGeometry(0.1, 0.1, 3.5); // Adjust the length as needed
const backbarMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

// Connect leg1 with leg4
const bar1 = new THREE.Mesh(barGeometry, barMaterial);
bar1.position.set(-1.25, 0.05, 0); // Adjust position to connect leg1 and leg4
bar1.rotation.y = Math.PI / 8.2; // Rotate to align with the legs
bar1.castShadow = true;
scene.add(bar1);

// Connect leg4 with leg3
const bar2 = new THREE.Mesh(frontbarGeometry, frontbarMaterial);
bar2.position.set(0, 0.05, 1.25); // Adjust position to connect leg1 and leg4
bar2.rotation.y = Math.PI / 2; // Rotate to align with the legs
bar2.castShadow = true;
scene.add(bar2);

// Connect leg3 with leg2
const bar3 = new THREE.Mesh(barGeometry, barMaterial);
bar3.position.set(1.25, 0.05, 0); // Adjust position to connect leg1 and leg4
bar3.rotation.y = Math.PI / -8.2; // Rotate to align with the legs
bar3.castShadow = true;
scene.add(bar3);

// bar upperside
const bar1up = new THREE.Mesh(barGeometry, barMaterial);
bar1up.position.set(-1.25, legHeight-0.05, 0); // Adjust position to connect leg1 and leg4
bar1up.rotation.y = Math.PI / 8.2; // Rotate to align with the legs
bar1up.castShadow = true;
scene.add(bar1up);

// Connect leg4 with leg3
const bar2up = new THREE.Mesh(frontbarGeometry, frontbarMaterial);
bar2up.position.set(0, legHeight-0.05, 1.25); // Adjust position to connect leg1 and leg4
bar2up.rotation.y = Math.PI / 2; // Rotate to align with the legs
bar2up.castShadow = true;
scene.add(bar2up);

// Connect leg3 with leg2
const bar3up = new THREE.Mesh(barGeometry, barMaterial);
bar3up.position.set(1.25, legHeight-0.05, 0); // Adjust position to connect leg1 and leg4
bar3up.rotation.y = Math.PI / -8.2; // Rotate to align with the legs
bar3up.castShadow = true;
scene.add(bar3up);

const bar4up = new THREE.Mesh(backbarGeometry, backbarMaterial);
bar4up.position.set(0, legHeight-0.05, -1.25); // Adjust position to connect leg1 and leg4
bar4up.rotation.y = Math.PI / 2; // Rotate to align with the legs
bar4up.castShadow = true;
scene.add(bar4up);

// Group the table components
const tableGroup = new THREE.Group();
tableGroup.add(outerTable, coverTable, leg1, leg2, leg3, leg4, bar1, bar2, bar3, bar1up, bar2up, bar3up, bar4up);

// Add the first set to the scene
scene.add(tableGroup);

// Function to create and position multiple sets
const createTableGrid = (rows, cols, spacing) => {
    const offsetX = (cols - 1) * spacing / 2; // To center the grid horizontally
    const offsetZ = (rows - 1) * spacing / 2; // To center the grid vertically

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tableClone = tableGroup.clone(); // Clone the entire set
            // Adjust position to center the grid around (0, 0, 0)
            tableClone.position.set(j * spacing - offsetX, 0, i * spacing - offsetZ); 
            scene.add(tableClone); // Add to the scene
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

// Right Wall
const rightWall = new THREE.Mesh(LRwallGeometry, LRwallMaterial);
rightWall.position.set(25, 5, 0); // Position on the positive X-axis
rightWall.rotation.y = -Math.PI / 2; // Rotate to face inward
scene.add(rightWall);

// --- Add Left Wall with a Centered Door ---
const wallWidth = 55; // Total width of the wall
const wallHeight = 10; // Height of the wall
const doorWidth = 13; // Width of the door
const doorHeight = 7; // Height of the door

// Define the wall shape
const wallShape = new THREE.Shape();
wallShape.moveTo(-wallWidth / 2, 0); // Start bottom-left
wallShape.lineTo(wallWidth / 2, 0); // Bottom-right
wallShape.lineTo(wallWidth / 2, wallHeight); // Top-right
wallShape.lineTo(-wallWidth / 2, wallHeight); // Top-left
wallShape.lineTo(-wallWidth / 2, 0); // Close the shape

// Define the door shape (hole)
const doorShape = new THREE.Path();
const doorX = 0; // Center the door on the X-axis
doorShape.moveTo(doorX - doorWidth / 2, 0); // Bottom-left of the door
doorShape.lineTo(doorX + doorWidth / 2, 0); // Bottom-right of the door
doorShape.lineTo(doorX + doorWidth / 2, doorHeight); // Top-right of the door
doorShape.lineTo(doorX - doorWidth / 2, doorHeight); // Top-left of the door
doorShape.lineTo(doorX - doorWidth / 2, 0); // Close the shape

// Combine the wall shape with the door hole
wallShape.holes.push(doorShape);

// Create the wall geometry with the door hole
const wallGeometry = new THREE.ExtrudeGeometry(wallShape, {
  depth: 0.1, // Thickness of the wall
  bevelEnabled: false,
});

// Create the wall material
const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFDD0 });

// Create the left wall mesh
const leftWallWithDoor = new THREE.Mesh(wallGeometry, wallMaterial);
leftWallWithDoor.position.set(-25, 0, 0); // Position on the negative X-axis
leftWallWithDoor.rotation.y = Math.PI / 2; // Rotate to face inward
scene.add(leftWallWithDoor);

// ------------------------------------------ Doors ------------------------------------------ //

// Glass Door Geometry and Material
const glassDoorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight); // Dimensions match the hole
const glassDoorMaterial = new THREE.MeshLambertMaterial({
    color: 0x87CEEB, // Light blue for glass
    transparent: true, // Enable transparency
    opacity: 0.4, // Set transparency level (0: fully transparent, 1: opaque)
});
const centerHoleRadius = 0.5; // Radius of the hole in the center of the glass

// Glass Door
const glassDoor = new THREE.Mesh(glassDoorGeometry, glassDoorMaterial);
glassDoor.position.set(-25, doorHeight / 2, 0); // Centered in the hole
glassDoor.rotation.y = Math.PI / 2; // Rotate to align with the left wall
scene.add(glassDoor);

// --- Add a Door Frame ---
const doorFrameMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF }); // Brown for the door frame
const frameThickness = 0.2;

// external frame
// Top Frame
const topFrame = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + frameThickness, frameThickness, frameThickness), 
    doorFrameMaterial
);
topFrame.position.set(-25, doorHeight + frameThickness / 2, 0); // Top of the door
topFrame.rotation.y = Math.PI / 2;
scene.add(topFrame);

// Left Frame
const leftFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness, frameThickness), 
    doorFrameMaterial
);
leftFrame.position.set(-25, doorHeight / 2, -doorWidth / 2 - frameThickness / 2); // Left side of the door
leftFrame.rotation.y = Math.PI / 2;
scene.add(leftFrame);

// Right Frame
const rightFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness, frameThickness), 
    doorFrameMaterial
);
rightFrame.position.set(-25, doorHeight / 2, doorWidth / 2 + frameThickness / 2); // Right side of the door
rightFrame.rotation.y = Math.PI / 2;
scene.add(rightFrame);

// intenal frame
// Top Frame
const topinFrame = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + frameThickness, frameThickness, frameThickness), 
    doorFrameMaterial
);
topinFrame.position.set(-25, doorHeight + frameThickness / 2.5 - 0.6, 0); // Top of the door
topinFrame.rotation.y = Math.PI / 2;
scene.add(topinFrame);

// Left Frame
const leftinFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness, frameThickness), 
    doorFrameMaterial
);
leftinFrame.position.set(-25, doorHeight / 2, -doorWidth / 2 - frameThickness / 2 + 1); // Left side of the door
leftinFrame.rotation.y = Math.PI / 2;
scene.add(leftinFrame);

// Right Frame
const rightinFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness, frameThickness), 
    doorFrameMaterial
);
rightinFrame.position.set(-25, doorHeight / 2, doorWidth / 2 + frameThickness / 2 - 1); // Right side of the door
rightinFrame.rotation.y = Math.PI / 2;
scene.add(rightinFrame);

// ---- frame brown -------
const FrameMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); 
// Top Frame
const topthFrame = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + frameThickness - 2.2, frameThickness*7, frameThickness), 
    FrameMaterial
);
topthFrame.position.set(-25, doorHeight - 0.8 + frameThickness / 2.5 - 0.5, 0); // Top of the door
topthFrame.rotation.y = Math.PI / 2;
scene.add(topthFrame);

// Left Frame
const leftthFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness + 2, doorHeight + frameThickness - 0.75, frameThickness), 
    FrameMaterial
);
leftthFrame.position.set(-25, doorHeight / 2 - 0.3, -doorWidth / 2 - frameThickness / 2 + 2.2); // Left side of the door
leftthFrame.rotation.y = Math.PI / 2;
scene.add(leftthFrame);

// Right Frame
const rightthFrame = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness + 2, doorHeight + frameThickness - 0.75, frameThickness), 
    FrameMaterial
);
rightthFrame.position.set(-25, doorHeight / 2 - 0.3, doorWidth / 2 + frameThickness / 2 - 2.2); // Right side of the door
rightthFrame.rotation.y = Math.PI / 2;
scene.add(rightthFrame);

// --- Add Glass Door with a Rectangular Center Hole ---
const holeWidth = 11;
const fixedBottom = -3.5;
const dynamicTop = 3;

const glassShape = new THREE.Shape();
glassShape.moveTo(-doorWidth / 2, -doorHeight / 2);
glassShape.lineTo(doorWidth / 2, -doorHeight / 2);
glassShape.lineTo(doorWidth / 2, doorHeight / 2);
glassShape.lineTo(-doorWidth / 2, doorHeight / 2);
glassShape.lineTo(-doorWidth / 2, -doorHeight / 2);

const centerHole = new THREE.Path();
centerHole.moveTo(-holeWidth / 2, fixedBottom);
centerHole.lineTo(holeWidth / 2, fixedBottom);
centerHole.lineTo(holeWidth / 2, dynamicTop);
centerHole.lineTo(-holeWidth / 2, dynamicTop);
centerHole.lineTo(-holeWidth / 2, fixedBottom);
glassShape.holes.push(centerHole);

// Create the glass door geometry with the rectangular hole
const glassGeometry = new THREE.ExtrudeGeometry(glassShape, {
    depth: 0.1, // Thickness of the glass
    bevelEnabled: false,
});

// Create the glass material
const glassMaterial = new THREE.MeshLambertMaterial({
    color: 0x87CEEB, // Light blue for glass
    transparent: true, // Enable transparency
    opacity: 0.4, // Set transparency level (0: fully transparent, 1: opaque)
});

// Create the glass door mesh
const glassDoorWithHole = new THREE.Mesh(glassGeometry, glassMaterial);
glassDoorWithHole.position.set(-25, doorHeight / 2, 0); // Centered in the door hole
glassDoorWithHole.rotation.y = Math.PI / 2; // Rotate to align with the left wall
scene.add(glassDoorWithHole);


// --- Add Two Glass Doors Inside the Rectangular Hole ---
const glassThickness = 0.1
// left door
const leftglass = new THREE.Mesh(
    new THREE.BoxGeometry(glassThickness + 3.2, doorHeight + glassThickness - 2, glassThickness), 
    glassMaterial
);
leftglass.position.set(-25, doorHeight / 2 - 1, -doorWidth / 2 - glassThickness / 2 + 4.9); // Left side of the door
leftglass.rotation.y = Math.PI / 2;
scene.add(leftglass);

// Right door
const rightglass = new THREE.Mesh(
    new THREE.BoxGeometry(glassThickness + 3.2, doorHeight + glassThickness - 2, glassThickness), 
    glassMaterial
);
rightglass.position.set(-25, doorHeight / 2 - 1, doorWidth / 2 + glassThickness / 2 - 4.9); // Right side of the door
rightglass.rotation.y = Math.PI / 2;
scene.add(rightglass);

// --- handles ----
const handleMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); 
// Left Frame
const handleleft = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness - 6, frameThickness), 
    handleMaterial
);
handleleft.position.set(-25, doorHeight - 4, -doorWidth / 2 - frameThickness / 2 + 6.2); // Left side of the door
handleleft.rotation.y = Math.PI / 2;
scene.add(handleleft);

// Right Frame
const handleright = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness - 6 , frameThickness), 
    handleMaterial
);
handleright.position.set(-25, doorHeight - 4, doorWidth / 2 + frameThickness / 2 - 6.2); // Right side of the door
handleright.rotation.y = Math.PI / 2;
scene.add(handleright);



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