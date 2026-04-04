import React, { useEffect, useRef, useState } from 'react';

interface PriceReport {
  id: string;
  storeName: string;
  itemName: string;
  variant?: string;
  price: number;
  unit: string;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  distance?: number;
  address: string;
  reportedBy: string;
  reportedAt: string;
  confirmedBy: string[];
}

interface MapViewProps {
  reports: PriceReport[];
  userLocation: { lat: number; lon: number };
  onMarkerClick?: (report: PriceReport) => void;
  onShareClick?: (report: PriceReport) => void;
  selectedReportId?: string | null;
}

export default function MapView({ reports, userLocation, onMarkerClick, onShareClick, selectedReportId }: MapViewProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<any[]>([]);
  const markersMapRef = useRef<Map<string, any>>(new Map());
  const [mapReady, setMapReady] = useState(false);

  console.log('==========================================');
  console.log('MapView RENDERED with:', {
    reportsCount: reports.length,
    selectedReportId,
    userLocation,
    reports: reports.map(r => ({
      id: r.id,
      name: r.storeName,
      price: r.price,
      lat: r.location.latitude,
      lon: r.location.longitude
    }))
  });
  console.log('==========================================');

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Dynamically import Leaflet and CSS only on client-side
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Initialize map
      const map = L.map(mapContainerRef.current!).setView(
        [userLocation.lat, userLocation.lon],
        13
      );

      // Add Satellite tiles (Esri World Imagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19,
      }).addTo(map);

      // Add labels layer on top of satellite
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        pane: 'shadowPane'
      }).addTo(map);

      // Custom icon for user location
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background-color: #3B82F6;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      // Add user location marker
      L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .addTo(map)
        .bindPopup('<strong>Your Location</strong>');

      mapRef.current = map;
      console.log('Map initialized successfully');
      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, [userLocation]);

  useEffect(() => {
    console.log('useEffect triggered - mapReady:', mapReady, 'mapRef.current:', !!mapRef.current, 'reports:', reports.length);

    if (!mapReady || !mapRef.current) {
      console.warn('Map not ready yet, skipping marker update. mapReady:', mapReady, 'mapRef:', !!mapRef.current);
      return;
    }

    const updateMarkers = async () => {
      console.log('Starting updateMarkers function...');
      const L = (await import('leaflet')).default;
      console.log('Leaflet loaded');

      // Clear existing store markers
      console.log('Clearing', markersRef.current.length, 'existing markers');
      markersRef.current.forEach((marker) => {
        mapRef.current.removeLayer(marker);
      });
      markersRef.current = [];
      markersMapRef.current.clear();

      console.log('MapView: Updating markers with', reports.length, 'reports');
      console.log('Reports data:', reports);

      // Find cheapest price
      const cheapestPrice = reports.length > 0 ? Math.min(...reports.map((r) => r.price)) : null;

      // Group reports by location (same store/address)
      // This groups items at the same location into ONE marker
      const locationGroups = new Map<string, PriceReport[]>();
      reports.forEach((report) => {
        // Use store name + approximate coordinates (within ~11 meters) as key
        // Also normalize address to handle slight variations
        const normalizedAddress = report.address.toLowerCase().replace(/[,\s]+/g, '-');
        const locationKey = `${report.storeName.toLowerCase()}-${report.location.latitude.toFixed(3)}-${report.location.longitude.toFixed(3)}`;

        if (!locationGroups.has(locationKey)) {
          locationGroups.set(locationKey, []);
        }
        locationGroups.get(locationKey)!.push(report);
      });

      // Sort reports at each location by confirmation count
      locationGroups.forEach((groupReports, locationKey) => {
        const sortedReports = groupReports.sort((a, b) => {
          const confirmDiff = b.confirmedBy.length - a.confirmedBy.length;
          if (confirmDiff !== 0) return confirmDiff;
          return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        });
        locationGroups.set(locationKey, sortedReports);
      });

      console.log('✓ Grouped', reports.length, 'reports into', locationGroups.size, 'unique locations');
      locationGroups.forEach((group) => {
        if (group.length > 1) {
          console.log(`  → ${group[0].storeName}: ${group.length} items available`);
        }
      });

      // Add markers for each report
      const bounds: any[] = [[userLocation.lat, userLocation.lon]];

      locationGroups.forEach((groupReports, locationKey) => {
        // Use the first report for marker position
        const report = groupReports[0];
        const index = Array.from(locationGroups.keys()).indexOf(locationKey);
        console.log(`Adding marker ${index + 1}:`, report.storeName, `with ${groupReports.length} items`, 'at', report.location.latitude, report.location.longitude);

        // Check if ANY item at this location has the cheapest price
        const hasAnyCheapest = groupReports.some(r => r.price === cheapestPrice);
        const isSelected = groupReports.some(r => r.id === selectedReportId);
        const markerColor = hasAnyCheapest ? '#10B981' : '#EF4444';

        // Show the cheapest item from this location in the label
        const cheapestAtLocation = groupReports.reduce((min, r) => r.price < min.price ? r : min, groupReports[0]);

        // Validate coordinates
        if (!report.location.latitude || !report.location.longitude) {
          console.warn('Invalid coordinates for report:', report.id);
          return;
        }

        // Use CircleMarker for guaranteed visibility
        const marker = L.circleMarker(
          [report.location.latitude, report.location.longitude],
          {
            radius: isSelected ? 25 : 18,
            fillColor: markerColor,
            color: isSelected ? '#FFD700' : '#ffffff',
            weight: isSelected ? 6 : 4,
            opacity: 1,
            fillOpacity: 1
          }
        ).addTo(mapRef.current);

        console.log('CircleMarker added successfully for:', report.storeName);

        // Add a text label using divIcon on top of the circle
        const multiItemIndicator = groupReports.length > 1 ? ` (${groupReports.length})` : '';
        const labelIcon = L.divIcon({
          className: 'price-label',
          html: `
            <div style="
              background: ${markerColor};
              color: white;
              padding: ${isSelected ? '10px 14px' : '8px 10px'};
              border-radius: 12px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 ${isSelected ? '6px 16px' : '4px 12px'} rgba(0,0,0,0.4);
              text-align: center;
              border: ${isSelected ? '4px solid #FFD700' : '3px solid white'};
              transform: scale(${isSelected ? '1.15' : '1'});
              animation: ${isSelected ? 'pulse 2s infinite' : 'none'};
              display: flex;
              flex-direction: column;
              gap: 2px;
            ">
              <div style="font-size: ${isSelected ? '11px' : '10px'}; opacity: 0.95; font-weight: 600;">
                ${cheapestAtLocation.itemName}${multiItemIndicator}
              </div>
              <div style="font-size: ${isSelected ? '16px' : '14px'};">
                ₱${cheapestAtLocation.price.toFixed(2)}
              </div>
            </div>
            <style>
              @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.08); }
              }
            </style>
          `,
          iconSize: isSelected ? [120, 60] : [100, 50],
          iconAnchor: isSelected ? [60, 70] : [50, 60],
        });

        const labelMarker = L.marker(
          [report.location.latitude, report.location.longitude],
          { icon: labelIcon }
        ).addTo(mapRef.current);

        console.log('Label marker added for:', report.storeName);

        // Popup content - show all items at this location
        const itemsHtml = groupReports.map((r) => {
          const isItemCheapest = r.price === cheapestPrice;
          const itemColor = isItemCheapest ? '#10B981' : '#EF4444';
          return `
            <div style="
              padding: 8px;
              margin-bottom: 6px;
              background: ${isItemCheapest ? '#F0FDF4' : '#FEF2F2'};
              border-radius: 8px;
              border-left: 4px solid ${itemColor};
            ">
              <div style="font-weight: bold; font-size: 14px; color: #111; margin-bottom: 4px;">
                ${r.itemName}${r.variant ? ` (${r.variant})` : ''}
              </div>
              <div style="font-size: 20px; font-weight: bold; color: ${itemColor};">
                ₱${r.price.toFixed(2)} <span style="font-size: 12px; color: #666;">/ ${r.unit}</span>
              </div>
              ${isItemCheapest ? '<div style="color: #10B981; font-size: 11px; font-weight: 600; margin-top: 4px;">✓ CHEAPEST!</div>' : ''}
              <div style="color: #666; font-size: 11px; margin-top: 4px;">
                ✓ ${r.confirmedBy.length} confirmed
              </div>
            </div>
          `;
        }).join('');

        // Navigation URLs
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${report.location.latitude},${report.location.longitude}&travelmode=driving`;
        const wazeUrl = `https://waze.com/ul?ll=${report.location.latitude},${report.location.longitude}&navigate=yes`;

        const popupContent = `
          <div style="min-width: 240px; max-width: 300px;">
            <div style="font-weight: 700; font-size: 16px; margin-bottom: 8px; color: #111; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
              ${report.storeName}
            </div>
            <div style="color: #666; font-size: 12px; margin-bottom: 12px;">
              ${report.address}
            </div>
            ${report.distance !== undefined ? `
              <div style="color: #3B82F6; font-size: 12px; margin-bottom: 12px; font-weight: 600;">
                📍 ${report.distance.toFixed(1)} km away
              </div>
            ` : ''}
            <div style="margin-top: 8px; margin-bottom: 12px;">
              <div style="font-size: 12px; font-weight: 600; color: #666; margin-bottom: 8px;">
                Available Items (${groupReports.length}):
              </div>
              ${itemsHtml}
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #666; margin-bottom: 6px; margin-top: 12px;">
              Navigate with:
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 12px;">
              <a
                href="${googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 6px;
                  flex: 1;
                  padding: 10px 12px;
                  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 13px;
                  box-shadow: 0 3px 5px rgba(59, 130, 246, 0.3);
                  transition: all 0.2s;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 10px rgba(59, 130, 246, 0.4)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 5px rgba(59, 130, 246, 0.3)';"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 11l19-9-9 19-2-8-8-2z"></path>
                </svg>
                Maps
              </a>
              <a
                href="${wazeUrl}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 6px;
                  flex: 1;
                  padding: 10px 12px;
                  background: linear-gradient(135deg, #33CCFF 0%, #0099CC 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 13px;
                  box-shadow: 0 3px 5px rgba(51, 204, 255, 0.3);
                  transition: all 0.2s;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 10px rgba(51, 204, 255, 0.4)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 5px rgba(51, 204, 255, 0.3)';"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.68 5.31c-.78-.78-1.88-1.14-2.98-1.14-.82 0-1.64.23-2.34.7L9.57 8.26c-.24.17-.47.36-.68.57L4.32 13.4c-.78.78-1.14 1.88-1.14 2.98 0 1.1.36 2.2 1.14 2.98.78.78 1.88 1.14 2.98 1.14.82 0 1.64-.23 2.34-.7l4.79-3.39c.24-.17.47-.36.68-.57l4.57-4.57c.78-.78 1.14-1.88 1.14-2.98 0-1.1-.36-2.2-1.14-2.98z"/>
                </svg>
                Waze
              </a>
            </div>
            <button
              id="share-btn-${report.id}"
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                width: 100%;
                padding: 12px 16px;
                background: linear-gradient(135deg, #10B981 0%, #059669 100%);
                color: white;
                text-decoration: none;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 13px;
                box-shadow: 0 3px 5px rgba(16, 185, 129, 0.3);
                transition: all 0.2s;
                cursor: pointer;
              "
              onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 10px rgba(16, 185, 129, 0.4)';"
              onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 3px 5px rgba(16, 185, 129, 0.3)';"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Share This Deal
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        labelMarker.bindPopup(popupContent);

        // Add share button event listener when popup opens
        const attachShareListener = () => {
          setTimeout(() => {
            const shareBtn = document.getElementById(`share-btn-${report.id}`);
            if (shareBtn && onShareClick) {
              shareBtn.onclick = () => {
                onShareClick(report);
              };
            }
          }, 100);
        };

        marker.on('popupopen', attachShareListener);
        labelMarker.on('popupopen', attachShareListener);

        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(report));
          labelMarker.on('click', () => onMarkerClick(report));
        }

        markersRef.current.push(marker);
        markersRef.current.push(labelMarker);

        // Map all report IDs in this group to the same marker
        groupReports.forEach(r => {
          markersMapRef.current.set(r.id, marker);
        });

        bounds.push([report.location.latitude, report.location.longitude]);

        console.log(`Marker ${index + 1} COMPLETE - Total markers now:`, markersRef.current.length);
      });

      console.log('ALL MARKERS ADDED - Total:', markersRef.current.length);

      // Fit map to show all markers
      console.log('Total markers added:', markersRef.current.length);
      console.log('Bounds:', bounds);

      if (bounds.length > 1) {
        const boundsObj = L.latLngBounds(bounds);
        console.log('Fitting map to bounds:', boundsObj);

        // Don't auto-zoom if we have a selected report (flyby will handle it)
        if (!selectedReportId) {
          mapRef.current.fitBounds(boundsObj, {
            padding: [80, 80],
            maxZoom: 14,
            animate: true,
            duration: 0.8
          });
          console.log('Map fitted to bounds');
        } else {
          console.log('Skipping fitBounds - selected report will trigger flyby');
        }
      } else if (reports.length === 1) {
        // If only one report, zoom to that location
        const report = reports[0];
        console.log('Single report, zooming to:', report.location.latitude, report.location.longitude);
        mapRef.current.setView(
          [report.location.latitude, report.location.longitude],
          15,
          { animate: true, duration: 0.8 }
        );
      }
    };

    updateMarkers();
  }, [reports, userLocation, onMarkerClick, selectedReportId, mapReady]);

  // Fly to selected marker when selectedReportId changes
  useEffect(() => {
    if (!mapRef.current || !selectedReportId || markersMapRef.current.size === 0) return;

    console.log('Flying to selected report:', selectedReportId);

    // Wait for markers to be fully rendered
    const timeout = setTimeout(() => {
      const marker = markersMapRef.current.get(selectedReportId);

      if (marker) {
        const latLng = marker.getLatLng();
        console.log('Marker found at:', latLng, '- Flying to it now');

        // Fly to the marker with smooth animation
        mapRef.current.flyTo(latLng, 16, {
          duration: 1.2,
          easeLinearity: 0.25
        });

        // Open the popup after animation
        setTimeout(() => {
          marker.openPopup();
          console.log('Popup opened for:', selectedReportId);
        }, 1300);
      } else {
        console.warn('Marker not found for report:', selectedReportId);
        console.log('Available markers:', Array.from(markersMapRef.current.keys()));
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [selectedReportId, reports]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          backgroundColor: 'white',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '11px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '12px' }}>Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#3B82F6',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
          <span>Your Location</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#10B981',
              borderRadius: '3px',
            }}
          />
          <span>Cheapest Price</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: '#EF4444',
              borderRadius: '3px',
            }}
          />
          <span>Other Prices</span>
        </div>
      </div>
    </div>
  );
}
