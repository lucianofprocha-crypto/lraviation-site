// OCEANIC — Checklist NAT-HLA PS-SRN (planilha OCEANIC.numbers + anotações do PDF)
// item: {t: task, n: note, f: [field labels], a: annotation (study note)}
var OCEANIC = [
 {phase:"FLIGHT PLANNING", items:[
  {t:"CNS", n:"Comm/Nav/SSR FPL codes and planning documents (FPL codes item 10)"},
  {t:"PLOTTING CHART", n:"Plot route coast out OEP to coast in OXP (iPad plotting chart)",
   a:"Random route: 1 waypoint every 10 degrees of longitude."},
  {t:"ETP", n:"Plot (iPad plotting chart)"},
  {t:"TRACK MESSAGE (TMI)", n:"Current copy available for all crossings",
   a:"TMI (Track Message Identification) is today's date of the year (Julian date).\nEastbound OTS valid 0100–0800Z at 30°W · Westbound 1130–1900Z at 30°W."},
  {t:"WX ANALYSES", n:"Enroute TEMP and SHR forecast (+ divert airports) / SIGWX charts"},
  {t:"NAV AIDS", n:"Review for accuracy check prior to coast out"},
  {t:"CONTINGENCY PROCEDURES", n:"Review procedures and plans"},
 ]},
 {phase:"PRE-FLIGHT", items:[
  {t:"MASTER CLOCK", n:"Set/verify against GPS"},
  {t:"MAINTENANCE LOG", n:"Check for any NAV/COMM/SSR or RVSM issues"},
  {t:"ALTIMETERS (±75 ft)", n:"Record readings on QNH", f:["QNH","Pilot's","STBY","Copilot's"]},
  {t:"FPL", n:"OFP × ATC FPL (check routing, fuel load, times and GS)"},
  {t:"LRNS — course and distance check (±2° / ±2 NM)", f:["IRS #1 diff","IRS #2 diff","IRS #3 diff"]},
  {t:"LRNS — currency and software version"},
  {t:"LRNS — independently verify waypoint entries (expanded coordinates)"},
  {t:"LRNS — upload WINDS"},
  {t:"LRCS", n:"HF/SATCOM check SELCAL (comply with FANS/CPDLC)"},
  {t:"PRESENT POSITION", n:"Check for gross difference between PP and airport/parking coordinates"},
  {t:"MASTER DOCUMENT", n:"ARINC app loaded"},
  {t:"GROUND SPEED", n:"Before taxiing, GS should read zero (0)"},
 ]},
 {phase:"TAXI AND PRIOR TO TAKE-OFF", items:[
  {t:"GROUND SPEED", n:"During taxi to the active runway"},
  {t:"PRESENT POSITION", n:"After leaving parking position, check for gross difference"},
 ]},
 {phase:"CLIMB OUT", items:[
  {t:"ABOVE FL100", n:"Verify ETAs from DEP to destination — note on the Master Document"},
 ]},
 {phase:"PRIOR TO OCEANIC ENTRY", items:[
  {t:"OCEANIC CLEARANCE", n:"Verify and cross-check independently. Confirm ATC route and FMS route. Voice: at least 40 min prior to entry · Data link: 30–90 min prior.",
   a:"Delayed clearance — Shanwick: if not received before the OCA boundary, advise domestic ATC and REMAIN CLEAR of oceanic airspace until you have it. All other oceanic centers: fly the filed route and maintain the last cleared altitude.\n\nDon't climb when you get the Oceanic Clearance (or send RCL) without talking to domestic ATC.\n\nNew York Oceanic (since 09/2012): the three elements of the clearance need NOT arrive together or from the same agency — once all three are received, that constitutes the clearance. If cleared via the OTS, the TMI is verified prior to the OTS entry fix."},
  {t:"WAYPOINTS", n:"Check expanded coordinates for all oceanic waypoints"},
  {t:"FLT LVL / MACH NUMBER", n:"Confirm flight level / Mach / route for the crossing"},
  {t:"ACFT PERF", n:"Ensure aircraft performance for maintaining assigned altitude/speed"},
  {t:"CLEARANCE REVIEW", n:"If the clearance is not what was filed: update LRNS, OFP and plotting",
   a:"FLY THE CLEARANCE, not the flight plan.\nAircraft registered W of 30°W: air-to-air VHF 123.95."},
  {t:"NAV AIDS — accuracy check", f:["FMS fix","FMS radial","FMS dist","RAW fix","RAW radial","RAW dist"]},
  {t:"HF", n:"Check if not done during pre-flight",
   a:"Use higher frequencies during daylight and lower frequencies at night.\n\nIf HF and SELCAL checks were not done on the ground, do them before oceanic entry. Additional SELCAL checks at each control-area boundary, regardless of CPDLC working normally."},
  {t:"CPDLC", n:"Log on to CPDLC and ADS-C 10–25 minutes prior"},
  {t:"RNP", n:"Verify value"},
  {t:"ALTIMETERS (STD)", n:"Record readings", f:["Pilot's","STBY","Copilot's"]},
  {t:"COMPASS", n:"Record reading", f:["Reading"]},
 ]},
 {phase:"AFTER OCEANIC ENTRY", items:[
  {t:"TRANSPONDER", n:"Squawk 2000, normally 10 minutes after OEP (except Reykjavik OCA)"},
  {t:"SPEED", n:"Maintain assigned Mach, if applicable"},
  {t:"VHF", n:"Set air-to-air VHF #2 123.45 and guard VHF #1 121.5 MHz"},
  {t:"SLOP", n:"0.7 NM, 1 NM or 2 NM to the RIGHT of the ATC cleared track"},
  {t:"ALTIMETERS", n:"Check hourly and record on the Master Document"},
 ]},
 {phase:"APPROACHING WAYPOINTS", items:[
  {t:"LAT/LONG", n:"Confirm expanded coordinates for the next and subsequent points",
   a:"Within a few minutes of crossing an oceanic waypoint, crosscheck the coordinates of the next and next+1 waypoints — expanded coordinates against the Master Document, per the currently effective ATC clearance. Verify FMS course/heading and distance to the next waypoint match the Master Document. Confirm autopilot steering in the proper lateral mode (LNAV/NAV)."},
 ]},
 {phase:"OVERHEAD WAYPOINTS", items:[
  {t:"WAYPOINT", n:"Confirm aircraft transition to the next waypoint"},
  {t:"TIME", n:"Confirm time to next waypoint (≤ 3 minutes)"},
  {t:"POSITION REPORT", n:"Include fuel"},
 ]},
 {phase:"10 MINUTES AFTER WAYPOINT PASSAGE", items:[
  {t:"RECORD", n:"Record time and LAT/LONG on the plotting chart"},
 ]},
 {phase:"MID POINT", items:[
  {t:"WINDS", n:"Midway between waypoints, compare OFP winds with FMS"},
  {t:"ETA", n:"Confirm"},
 ]},
 {phase:"COAST IN", items:[
  {t:"SLOP", n:"Remove prior to the oceanic exit point"},
  {t:"ROUTE", n:"Confirm routing beyond oceanic airspace"},
 ]},
];

// Janelas de Oceanic Clearance / RCL a partir do OEP, por centro oceânico
var ACC_TABLE = [
 ["ICELAND", "20 min or less"],
 ["BODO", "20 min or more"],
 ["GANDER", "90–60 min"],
 ["SHANWICK", "90–30 min"],
 ["NEW YORK", "see clearance note (3 elements)"],
 ["SANTA MARIA", "40 min or more"],
];
var ACC_NOTE = "Include Track / Mach number / flight level and clearance sequence number in the read-back. You do NOT need an Oceanic Clearance when entering an \u201CRCL\u201D oceanic area from a \u201CNo Clearance\u201D oceanic airspace.";

var WX_AVOID = [
 ["Deviation \u2264 10 NM", "Maintain cleared altitude"],
 ["Deviation > 10 NM \u00B7 NORTH of track", "Descend 300 ft"],
 ["Deviation > 10 NM \u00B7 SOUTH of track", "Climb 300 ft"],
];

var CONTINGENCY = [
 "TURN \u2265 30\u00B0 LEFT or RIGHT (right is usually better) OFF THE TRACK and PARALLEL the TRACK BY 5 NM",
 "TURN ON ALL LIGHTS and BROADCAST INTENTIONS on 123.45 and monitor/guard 121.5 MHz",
 "CLIMB or DESCEND 500 ft (1,000 ft if ABOVE FL410) \u2014 consider descent below FL290",
 "DIVERT TO ALTERNATE",
];
var EDM_NOTE = "EDM (Emergency Descent Mode), when activated, will: turn LEFT 90\u00B0; descend to 15,000 ft at 340 KCAS (MAN); once at 15,000 ft, speed target changes to 250 KCAS (MAN). Autopilot must be engaged \u2014 autothrottles will engage if disengaged.";
