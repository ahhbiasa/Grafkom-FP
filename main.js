// ------------------------------------------ Setup Scene ------------------------------------------ //
// --- Set up Scene ---
const scene = new THREE.Scene();

// --- Add Axes Helper ---
const axesHelper = new THREE.AxesHelper(5); // The parameter sets the length of the axes
scene.add(axesHelper);

// --- Set up Renderer ---
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xadd8e6);  // Set background color to light blue
document.body.appendChild(renderer.domElement);

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
const outerMaterial = new THREE.MeshLambertMaterial({ map: TableTexture }); // Replace with your texture if needed
const outerTable = new THREE.Mesh(outerGeometry, outerMaterial);

// Position and rotate the outer perimeter (raised edge)
outerTable.position.set(-2, 2.4, -1.5); // Adjust position to align with the scene
outerTable.rotation.x = Math.PI / 2;    // Lay flat on the X-axis
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
scene.add(coverTable);

// --- Create the Table Legs ---
const legGeometry = new THREE.BoxGeometry(0.1, legHeight, 0.1);
const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

// Position each leg at the corners of the trapezium tabletop
const leg1 = new THREE.Mesh(legGeometry, legMaterial);
leg1.position.set(-1.75, legHeight / 2, -1.25); // Bottom-left corner
scene.add(leg1);

const leg2 = leg1.clone();
leg2.position.set(1.75, legHeight / 2, -1.25); // Bottom-right corner
scene.add(leg2);

const leg3 = leg1.clone();
leg3.position.set(0.75, legHeight / 2, 1.25); // Top-right corner
scene.add(leg3);

const leg4 = leg1.clone();
leg4.position.set(-0.75, legHeight / 2, 1.25); // Top-left corner
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
scene.add(bar1);

// Connect leg4 with leg3
const bar2 = new THREE.Mesh(frontbarGeometry, frontbarMaterial);
bar2.position.set(0, 0.05, 1.25); // Adjust position to connect leg1 and leg4
bar2.rotation.y = Math.PI / 2; // Rotate to align with the legs
scene.add(bar2);

// Connect leg3 with leg2
const bar3 = new THREE.Mesh(barGeometry, barMaterial);
bar3.position.set(1.25, 0.05, 0); // Adjust position to connect leg1 and leg4
bar3.rotation.y = Math.PI / -8.2; // Rotate to align with the legs
scene.add(bar3);

// bar upperside
const bar1up = new THREE.Mesh(barGeometry, barMaterial);
bar1up.position.set(-1.25, legHeight-0.05, 0); // Adjust position to connect leg1 and leg4
bar1up.rotation.y = Math.PI / 8.2; // Rotate to align with the legs
scene.add(bar1up);

// Connect leg4 with leg3
const bar2up = new THREE.Mesh(frontbarGeometry, frontbarMaterial);
bar2up.position.set(0, legHeight-0.05, 1.25); // Adjust position to connect leg1 and leg4
bar2up.rotation.y = Math.PI / 2; // Rotate to align with the legs
scene.add(bar2up);

// Connect leg3 with leg2
const bar3up = new THREE.Mesh(barGeometry, barMaterial);
bar3up.position.set(1.25, legHeight-0.05, 0); // Adjust position to connect leg1 and leg4
bar3up.rotation.y = Math.PI / -8.2; // Rotate to align with the legs
scene.add(bar3up);

const bar4up = new THREE.Mesh(backbarGeometry, backbarMaterial);
bar4up.position.set(0, legHeight-0.05, -1.25); // Adjust position to connect leg1 and leg4
bar4up.rotation.y = Math.PI / 2; // Rotate to align with the legs
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
chairGroup.add(seat);  // Add seat to the chair group

// Chair backrest
const backrestShape = createRectShape(1.15, 1);
const backrestGeometry = new THREE.ExtrudeGeometry(backrestShape, { ...extrudeSettings, depth: 0.05 });
const backrest = new THREE.Mesh(backrestGeometry, seatMaterial);
backrest.position.set(-0.575, 1.6, -3.9);
backrest.rotation.x = Math.PI / -15;
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
    chairGroup.add(connection);  // Add connection to the chair group
};

// Create and position chair leg connections
createChairLegConnection(0.8, 1.2, -3);  // Connection between legs 1 and 2
createChairLegConnection(-0.8, 1.2, -3); // Connection between legs 3 and 4

const chairsidesupportGeometry = new THREE.BoxGeometry(0.1, 1.4, 0.1);
const chairsidesupportMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

const chairsupport1 = new THREE.Mesh(chairsidesupportGeometry, chairsidesupportMaterial);
chairsupport1.position.set(0.8, 1, -3); 
chairsupport1.rotation.x = Math.PI / 2;
chairGroup.add(chairsupport1);

const chairsupport2 = new THREE.Mesh(chairsidesupportGeometry, chairsidesupportMaterial);
chairsupport2.position.set(-0.8, 1, -3); 
chairsupport2.rotation.x = Math.PI / 2;
chairGroup.add(chairsupport2);

const chairunderfrontlegGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.1);
const chairunderfrontlegMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

const chairlegconnunder3 = new THREE.Mesh(chairunderfrontlegGeometry, chairunderfrontlegMaterial);
chairlegconnunder3.position.set(0, 1.2, -2.3); 
chairlegconnunder3.rotation.x = Math.PI / 2;
chairGroup.add(chairlegconnunder3);

const chairbacksupportGeometry = new THREE.BoxGeometry(0.1, 1.6, 0.1);
const chairbacksupportMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });

const chairlegconnback1 = new THREE.Mesh(chairbacksupportGeometry, chairbacksupportMaterial);
chairlegconnback1.position.set(0.7, 2, -3.96); 
chairlegconnback1.rotation.x = Math.PI / -15;
chairGroup.add(chairlegconnback1);

const chairlegconnback2 = new THREE.Mesh(chairbacksupportGeometry, chairbacksupportMaterial);
chairlegconnback2.position.set(-0.7, 2, -3.96); 
chairlegconnback2.rotation.x = Math.PI / -15;
chairGroup.add(chairlegconnback2);

const chairtopGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.1);
const chairtopMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
const chairtop = new THREE.Mesh(chairtopGeometry, chairtopMaterial);
chairtop.position.set(0, 2.8, -4.13); 
chairtop.rotation.x = Math.PI / -15;
chairGroup.add(chairtop);

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

// ------------------------------------------ Features ------------------------------------------ //

// --- Add Lights ---
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
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

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);
    controls.update();  // Update the controls in each frame
    renderer.render(scene, camera);
}
animate();

// --- Handle Window Resize ---
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});