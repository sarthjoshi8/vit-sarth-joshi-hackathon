import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const HUBS = [
  { name: 'New York (NYSE/NASDAQ)', lat: 40.7128, lon: -74.006, risk: 0.72, severity: 'high', market: 'US Equities', varImpact: '-$14.2M' },
  { name: 'London (LSE)', lat: 51.5074, lon: -0.1278, risk: 0.58, severity: 'medium', market: 'FTSE 100', varImpact: '-$8.6M' },
  { name: 'Frankfurt (DAX)', lat: 50.1109, lon: 8.6821, risk: 0.65, severity: 'high', market: 'Euro Stoxx', varImpact: '-$9.1M' },
  { name: 'Tokyo (TSE)', lat: 35.6762, lon: 139.6503, risk: 0.44, severity: 'low', market: 'Nikkei 225', varImpact: '-$4.2M' },
  { name: 'Singapore (SGX)', lat: 1.3521, lon: 103.8198, risk: 0.38, severity: 'low', market: 'Straits Times', varImpact: '-$3.1M' },
  { name: 'Mumbai (NSE/BSE)', lat: 19.076, lon: 72.8777, risk: 0.52, severity: 'medium', market: 'Nifty 50', varImpact: '-$6.4M' },
  { name: 'Hong Kong (HKEX)', lat: 22.3193, lon: 114.1694, risk: 0.81, severity: 'critical', market: 'Hang Seng', varImpact: '-$18.9M' },
  { name: 'Sydney (ASX)', lat: -33.8688, lon: 151.2093, risk: 0.35, severity: 'low', market: 'S&P/ASX 200', varImpact: '-$2.8M' },
  { name: 'Dubai (DFM)', lat: 25.2048, lon: 55.2708, risk: 0.48, severity: 'medium', market: 'DFMGI', varImpact: '-$4.5M' },
  { name: 'São Paulo (B3)', lat: -23.5505, lon: -46.6333, risk: 0.77, severity: 'high', market: 'Ibovespa', varImpact: '-$11.3M' }
];

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export default function Globe3D({ onSelectHub, selectedScenario = 'recession' }) {
  const mountRef = useRef(null);
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);
  const [viewMode, setViewMode] = useState('globe'); // 'globe' | 'towers'
  const [rotationSpeed, setRotationSpeed] = useState(0.003);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 240;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Group for all rotating objects
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Globe Core Sphere
    const globeRadius = 75;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0c1322,
      emissive: 0x050b14,
      wireframe: false,
      shininess: 40,
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    worldGroup.add(globeMesh);

    // 2. Wireframe / Latitude lines
    const wireGeo = new THREE.SphereGeometry(globeRadius + 0.5, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x224477,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    worldGroup.add(wireMesh);

    // 3. Glowing Atmosphere Halo
    const haloGeo = new THREE.SphereGeometry(globeRadius + 6, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    worldGroup.add(haloMesh);

    // 4. Background Starfield Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 800;
      starPositions[i + 1] = (Math.random() - 0.5) * 800;
      starPositions[i + 2] = (Math.random() - 0.5) * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x88aaff,
      size: 1.5,
      transparent: true,
      opacity: 0.6,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 5. Hub Nodes and Risk Towers
    const nodeMeshes = [];
    HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, globeRadius);

      // Node Marker
      const nodeColor = hub.severity === 'critical' ? 0xf43f5e :
                        hub.severity === 'high' ? 0xf97316 :
                        hub.severity === 'medium' ? 0xf59e0b : 0x10b981;

      const markerGeo = new THREE.SphereGeometry(2.4, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: nodeColor });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      marker.userData = hub;
      worldGroup.add(marker);
      nodeMeshes.push(marker);

      // Risk Tower (3D Spike projecting outward)
      const towerHeight = 10 + hub.risk * 35;
      const towerGeo = new THREE.CylinderGeometry(0.8, 1.8, towerHeight, 12);
      const towerMat = new THREE.MeshPhongMaterial({
        color: nodeColor,
        emissive: nodeColor,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.85,
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);

      // Orient cylinder outward from globe center
      tower.position.copy(pos.clone().multiplyScalar(1 + (towerHeight / 2) / globeRadius));
      tower.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      worldGroup.add(tower);

      // Pulsing Ring at base
      const ringGeo = new THREE.RingGeometry(2.5, 4.5, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos.clone().multiplyScalar(1.01));
      ring.lookAt(pos.clone().multiplyScalar(2));
      worldGroup.add(ring);
    });

    // 6. Arc Lines connecting major financial centers
    const curvePoints = [
      [HUBS[0], HUBS[1]], // NY -> London
      [HUBS[1], HUBS[2]], // London -> Frankfurt
      [HUBS[1], HUBS[8]], // London -> Dubai
      [HUBS[8], HUBS[5]], // Dubai -> Mumbai
      [HUBS[5], HUBS[4]], // Mumbai -> Singapore
      [HUBS[4], HUBS[6]], // Singapore -> HK
      [HUBS[6], HUBS[3]], // HK -> Tokyo
      [HUBS[3], HUBS[7]], // Tokyo -> Sydney
      [HUBS[0], HUBS[9]], // NY -> São Paulo
    ];

    curvePoints.forEach(([h1, h2]) => {
      const v1 = latLonToVector3(h1.lat, h1.lon, globeRadius);
      const v2 = latLonToVector3(h2.lat, h2.lon, globeRadius);
      const mid = v1.clone().add(v2).multiplyScalar(0.5);
      const midLen = mid.length();
      mid.normalize().multiplyScalar(midLen + 22); // Arc elevation

      const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(36));
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      worldGroup.add(arcLine);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x6366f1, 1.5);
    dirLight1.position.set(100, 80, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x22d3ee, 0.8);
    dirLight2.position.set(-100, -50, -80);
    scene.add(dirLight2);

    // Mouse Interaction / Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        worldGroup.rotation.y += deltaX * 0.005;
        worldGroup.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes);
      if (intersects.length > 0) {
        const hub = intersects[0].object.userData;
        setSelectedHub(hub);
        if (onSelectHub) onSelectHub(hub);
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onClick);

    // Responsive resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isDragging) {
        worldGroup.rotation.y += rotationSpeed;
      }

      // Subtle pulse to atmosphere
      const elapsedTime = clock.getElapsedTime();
      haloMesh.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.015);

      starField.rotation.y = elapsedTime * 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('click', onClick);
      if (container && renderer.domElement) {
        container.innerHTML = '';
      }
      renderer.dispose();
    };
  }, [rotationSpeed]);

  return (
    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌐</span> 3D Global Risk Intelligence Network & Towers
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Real-time geospatial risk exposure across sovereign debt & financial exchanges. Drag to rotate, click nodes to inspect.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`btn ${rotationSpeed === 0 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 12px', fontSize: '12px' }}
            onClick={() => setRotationSpeed(rotationSpeed === 0 ? 0.003 : 0)}
          >
            {rotationSpeed === 0 ? '▶ Resume Rotation' : '⏸ Pause'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '420px',
          borderRadius: 'var(--radius-md)',
          cursor: 'grab',
          background: 'radial-gradient(circle at center, #0f172a 0%, #060a12 100%)',
          position: 'relative'
        }}
      />

      {/* Interactive Hub Overlay Details */}
      {selectedHub && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            maxWidth: '300px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              {selectedHub.market}
            </span>
            <span className={`badge ${selectedHub.severity}`}>
              {selectedHub.severity}
            </span>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
            {selectedHub.name}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Composite Risk Score: <strong style={{ color: 'var(--text-primary)' }}>{(selectedHub.risk * 100).toFixed(0)}/100</strong>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--accent-rose)' }}>
            Projected VaR Impact: <strong>{selectedHub.varImpact}</strong>
          </div>
        </div>
      )}

      {/* Quick Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '12px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }}></span>
          Critical Risk (&gt;0.80)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f97316', display: 'inline-block' }}></span>
          High Risk (0.65 - 0.80)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }}></span>
          Medium Risk (0.45 - 0.65)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          Low Risk (&lt;0.45)
        </div>
      </div>
    </div>
  );
}
