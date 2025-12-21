import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials.');
  console.error('');
  console.error('Please set the following in your .env.local file:');
  console.error('  - VITE_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('The .env.local file should be located at:', envPath);
  console.error('');
  console.error('To get your credentials:');
  console.error('1. Go to https://supabase.com and create a project');
  console.error('2. Navigate to Settings > API');
  console.error('3. Copy your Project URL and service_role key');
  console.error('4. Update .env.local with your actual values');
  console.error('');
  console.error('See SUPABASE_SETUP.md for detailed instructions.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read Excel file
const filePath = path.join(__dirname, '..', 'bus routes.xlsx');
console.log('Reading Excel file:', filePath);

const wb = XLSX.readFile(filePath);
console.log(`Found ${wb.SheetNames.length} worksheets\n`);

// Function to insert or get bus stop
async function getOrCreateStop(stopName, nameGu = null, latitude = null, longitude = null) {
  if (!stopName || stopName.trim() === '') return null;
  
  const cleanName = stopName.trim();
  
  // Try to find existing stop
  const { data: existingStop } = await supabase
    .from('bus_stops')
    .select('id')
    .eq('name', cleanName)
    .single();

  if (existingStop) {
    return existingStop.id;
  }

  // Create new stop
  const { data: newStop, error } = await supabase
    .from('bus_stops')
    .insert({
      name: cleanName,
      name_gu: nameGu,
      latitude: latitude !== null ? parseFloat(latitude) : 0,
      longitude: longitude !== null ? parseFloat(longitude) : 0,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error creating stop ${cleanName}:`, error.message);
    return null;
  }
  return newStop.id;
}

// Function to parse Excel time (decimal) to HH:MM format
function parseExcelTime(timeValue) {
  if (timeValue === null || timeValue === undefined || timeValue === '') return null;
  
  // If already a string in HH:MM format
  if (typeof timeValue === 'string' && /^\d{1,2}:\d{2}$/.test(timeValue.trim())) {
    return timeValue.trim();
  }
  
  // If it's a number (Excel time decimal)
  if (typeof timeValue === 'number') {
    const totalSeconds = Math.floor(timeValue * 86400); // 86400 seconds in a day
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  return null;
}

// Function to extract route number from sheet name
function extractRouteNumbers(sheetName) {
  // Handle patterns like "Route No.3", "Route No.3A", "Route No.3B and C", "Route No.4, 4D", etc.
  const match = sheetName.match(/Route\s+No\.?\s*([\d\w\s,&\-]+)/i);
  if (!match) return [];
  
  const routeStr = match[1].trim();
  const routes = [];
  
  // Split by comma first
  const commaParts = routeStr.split(',').map(p => p.trim());
  
  for (const part of commaParts) {
    // Handle patterns like "3B and C" -> ["3B", "3C"]
    if (/\s+and\s+/i.test(part)) {
      const andParts = part.split(/\s+and\s+/i).map(p => p.trim());
      
      // Find the base number from the first part
      const firstPart = andParts[0];
      const baseMatch = firstPart.match(/^(\d+)([A-Z]*)$/);
      
      if (baseMatch) {
        const [, num, suffix] = baseMatch;
        // Add the first route (e.g., "3B")
        routes.push(`${num}${suffix}`);
        
        // Process remaining "and" parts
        for (let i = 1; i < andParts.length; i++) {
          const restPart = andParts[i].trim();
          // If it's just a letter, append to base number (e.g., "C" -> "3C")
          if (/^[A-Z]$/.test(restPart)) {
            routes.push(`${num}${restPart}`);
          } else {
            // If it's a full route number, add as is (e.g., "5A")
            const restMatch = restPart.match(/^(\d+)([A-Z]*)$/);
            if (restMatch) {
              routes.push(restPart);
            }
          }
        }
      } else {
        // If no match, just add the part as is
        routes.push(part);
      }
    } else {
      // Simple route number, add as is
      routes.push(part);
    }
  }
  
  // Clean up and filter
  return routes
    .map(r => r.trim())
    .filter(r => r && r.length > 0)
    .filter((r, idx, arr) => arr.indexOf(r) === idx); // Remove duplicates
}

// Function to find "Via:" row and extract stops
function extractViaStops(rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    
    // Look for "Via" or "Via :" in the row
    const viaIndex = row.findIndex(cell => 
      cell && typeof cell === 'string' && /via\s*:?/i.test(cell.trim())
    );
    
    if (viaIndex !== -1) {
      // Extract stops after "Via:"
      const stops = [];
      for (let j = viaIndex + 1; j < row.length; j++) {
        const cell = row[j];
        if (cell && typeof cell === 'string' && cell.trim() !== '') {
          stops.push(cell.trim());
        } else if (cell === null || cell === undefined || cell === '') {
          break; // Stop at first empty cell
        }
      }
      return stops.filter(s => s && s.toLowerCase() !== 'via');
    }
  }
  return [];
}

// Function to find schedule blocks and extract times
function extractScheduleBlocks(rows) {
  const schedules = [];
  const processedBlocks = new Set(); // Track processed column pairs to avoid duplicates
  
  // Find header rows that contain "Station" and destination
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    
    // Look for rows with "Station" header
    const stationIndices = [];
    row.forEach((cell, idx) => {
      if (cell && typeof cell === 'string' && /station/i.test(cell.trim())) {
        stationIndices.push(idx);
      }
    });
    
    if (stationIndices.length > 0) {
      // Found a schedule block header
      for (const stationIdx of stationIndices) {
        // Find the destination (next non-empty cell after Station)
        let destIdx = stationIdx + 1;
        while (destIdx < row.length && (!row[destIdx] || row[destIdx] === '' || String(row[destIdx]).trim() === 'To')) {
          destIdx++;
        }
        
        if (destIdx < row.length && row[destIdx]) {
          const destination = String(row[destIdx]).trim();
          
          // Skip if we've already processed this block
          const blockKey = `${stationIdx}-${destIdx}`;
          if (processedBlocks.has(blockKey)) continue;
          processedBlocks.add(blockKey);
          
          // Extract times from rows below (skip empty rows between header and data)
          const times = [];
          let foundFirstTime = false;
          
          for (let j = i + 1; j < rows.length; j++) {
            const timeRow = rows[j];
            if (!Array.isArray(timeRow)) break;
            
            const departure = parseExcelTime(timeRow[stationIdx]);
            const arrival = parseExcelTime(timeRow[destIdx]);
            
            if (departure && arrival) {
              times.push({ departure, arrival });
              foundFirstTime = true;
            } else if (foundFirstTime && !departure && !arrival) {
              // We've started collecting times and hit an empty row - might be end of block
              // But continue in case there are more blocks below
              break;
            }
          }
          
          if (times.length > 0) {
            schedules.push({
              from: 'Station',
              to: destination,
              times: times
            });
          }
        }
      }
    }
  }
  
  return schedules;
}

// Function to determine start and end points from schedules
function determineStartEndPoints(schedules, viaStops) {
  let startPoint = 'Station';
  let endPoint = 'Station';
  
  if (schedules.length > 0) {
    // Collect all unique destinations
    const destinations = [...new Set(schedules.map(s => s.to).filter(d => d && d.trim() !== ''))];
    const origins = [...new Set(schedules.map(s => s.from).filter(d => d && d.trim() !== ''))];
    
    // Use the most common origin as start point
    if (origins.length > 0) {
      startPoint = origins[0];
    }
    
    // Use the most common destination as end point
    if (destinations.length > 0) {
      endPoint = destinations[0];
    }
    
    // If we have via stops, refine the end point
    if (viaStops.length > 0) {
      const lastViaStop = viaStops[viaStops.length - 1];
      if (lastViaStop && lastViaStop.trim() !== '' && lastViaStop !== startPoint) {
        // Check if last via stop matches any destination
        if (destinations.includes(lastViaStop)) {
          endPoint = lastViaStop;
        } else if (!destinations.includes(endPoint)) {
          // If current endPoint is not in destinations, use last via stop
          endPoint = lastViaStop;
        }
      }
    }
  } else if (viaStops.length > 0) {
    // No schedules but we have via stops
    startPoint = 'Station';
    endPoint = viaStops[viaStops.length - 1];
  }
  
  return { startPoint, endPoint };
}

// Function to process a single worksheet
async function processWorksheet(sheetName, ws) {
  console.log(`\nProcessing: ${sheetName}`);
  
  // Convert to array of arrays
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
  
  // Extract route numbers from sheet name
  const routeNumbers = extractRouteNumbers(sheetName);
  if (routeNumbers.length === 0) {
    console.warn(`  ⚠ Could not extract route number from sheet name`);
    return { success: 0, errors: 1 };
  }
  
  // Extract via stops
  const viaStops = extractViaStops(rows);
  console.log(`  Found ${viaStops.length} via stops: ${viaStops.join(', ')}`);
  
  // Extract schedule blocks
  const schedules = extractScheduleBlocks(rows);
  console.log(`  Found ${schedules.length} schedule block(s)`);
  
  if (schedules.length === 0) {
    console.warn(`  ⚠ No schedule data found`);
    return { success: 0, errors: 1 };
  }
  
  // Determine start and end points
  const { startPoint, endPoint } = determineStartEndPoints(schedules, viaStops);
  
  // Get first and last bus times from all schedules
  const allTimes = schedules.flatMap(s => s.times.map(t => t.departure));
  const sortedTimes = allTimes.filter(t => t).sort();
  const firstBus = sortedTimes[0] || null;
  const lastBus = sortedTimes[sortedTimes.length - 1] || null;
  
  let successCount = 0;
  let errorCount = 0;
  
  // Process each route number (some sheets have multiple routes)
  for (const routeNumber of routeNumbers) {
    try {
      // Create route name
      const routeName = `${startPoint} - ${endPoint}`;
      
      // Insert or update route
      const { data: route, error: routeError } = await supabase
        .from('bus_routes')
        .upsert({
          route_number: routeNumber,
          name: routeName,
          name_gu: null,
          start_point: startPoint,
          end_point: endPoint,
          distance: null,
          estimated_time: null,
          first_bus: firstBus,
          last_bus: lastBus,
          frequency: null,
          fare: null,
        }, {
          onConflict: 'route_number',
        })
        .select('id')
        .single();

      if (routeError) {
        console.error(`  ✗ Error inserting route ${routeNumber}:`, routeError.message);
        errorCount++;
        continue;
      }

      // Build complete stop list: start -> via stops -> end
      const allStops = [startPoint, ...viaStops, endPoint].filter((stop, idx, arr) => 
        stop && arr.indexOf(stop) === idx // Remove duplicates
      );

      // Delete existing route stops
      await supabase
        .from('route_stops')
        .delete()
        .eq('route_id', route.id);

      // Insert stops in order
      for (let i = 0; i < allStops.length; i++) {
        const stopName = allStops[i];
        const stopId = await getOrCreateStop(stopName);
        
        if (stopId) {
          await supabase
            .from('route_stops')
            .insert({
              route_id: route.id,
              stop_id: stopId,
              stop_order: i + 1,
            });
        }
      }

      successCount++;
      console.log(`  ✓ Imported route ${routeNumber}: ${routeName} (${allStops.length} stops)`);

    } catch (error) {
      console.error(`  ✗ Error processing route ${routeNumber}:`, error.message);
      errorCount++;
    }
  }
  
  return { success: successCount, errors: errorCount };
}

// Main import function
async function importBusRoutes() {
  console.log('Starting import from Excel file...\n');
  
  let totalSuccess = 0;
  let totalErrors = 0;
  
  // Process each worksheet
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const result = await processWorksheet(sheetName, ws);
    totalSuccess += result.success;
    totalErrors += result.errors;
  }

  console.log(`\n\n${'='.repeat(50)}`);
  console.log('Import completed!');
  console.log(`Successfully imported: ${totalSuccess} routes`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`${'='.repeat(50)}\n`);
}

// Run import
importBusRoutes().catch(console.error);
