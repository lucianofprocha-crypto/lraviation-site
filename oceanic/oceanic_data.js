// OCEANIC — Checklist NAT-HLA PS-SRN (planilha OCEANIC.numbers + anotações do PDF)
// item: {t: task, n: note, f: [field labels], a: annotation (study note)}
var OCEANIC = [
 {phase:"FLIGHT PLANNING", items:[
  {t:"CNS", n:"Comm/Nav/SSR FPL codes and planning documents (FPL codes item 10)",
   a:"PBCS tracks require RNP 4 + CPDLC RCP240 + ADS-C RSP180 — file P2 in item 10a and SUR/RSP180 in item 18. Fields 7, 10a, 10b and 18 must all carry the CPDLC/ADS-C information consistently (common rejects: wrong registration or Mode S hex code)."},
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
  {t:"LRNS — course and distance check (±2° / ±2 NM)", f:["IRS #1 diff","IRS #2 diff","IRS #3 diff"],
   a:"One LRNS failed (of two): request a reclearance above or below the NAT HLA, or via the Blue Spruce routes."},
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
   a:"OCR is UNEVEN across the NAT (Doc 007 Mar/2026) — the procedure depends on the OCA you enter:\n\nGANDER (full OCR): RCL one-and-done — OEP, ETO (new term, replaces ETA), Mach, requested FL and maximum level (new wording 'MAX FL380') — sent 90-60 min before the OEP; the 1-hour cut-off is firm; ACK = nothing further, no oceanic clearance is issued. 'RCL REJECTED' (sent early/late): read your RCL to ATC on the current frequency. NEVER climb to your RCL level on your own — domestic ATC delivers you at the right level at the OEP; nil comms = no change. At the OEP keep the level domestic assigned; don't ask for route confirmation (ATC auto-queries the FMS).\n\nSHANWICK (no OCR yet — until further notice, not expected before summer 2026): still REQUEST and FLY an oceanic clearance — RCL or voice request 90-30 min before the OEP; clearance arrives by ACARS or voice. If not received before the boundary: advise domestic ATC and REMAIN CLEAR of oceanic airspace until you have it.\n\nREYKJAVIK (from Mar/2026): no RCL required — enter on your current ATC clearance (if you send one, they will tell you it wasn't needed). Exiting Reykjavik into Shanwick or Gander: electronic coordination between centers, NO additional RCL.\n\nAZORES departures: no RCL to Santa Maria (Portugal AIP ENR 1.1.15.1).\n\nNEW YORK: the three elements of the clearance need not arrive together or from the same agency — once all three are received, that is the clearance. Via OTS: verify the TMI before the entry fix.\n\nGNSS jamming/spoofing (esp. westbound out of affected areas): report it in the RCL — 'recovered' does not mean 'fine' (residual time errors affect ADS-C, CPDLC and longitudinal separation)."},
  {t:"WAYPOINTS", n:"Check expanded coordinates for all oceanic waypoints"},
  {t:"FLT LVL / MACH NUMBER", n:"Confirm flight level / Mach / route for the crossing"},
  {t:"ACFT PERF", n:"Ensure aircraft performance for maintaining assigned altitude/speed"},
  {t:"CLEARANCE REVIEW", n:"If the clearance is not what was filed: update LRNS, OFP and plotting",
   a:"FLY THE CLEARANCE, not the flight plan.\n\nShanwick VHF by aircraft REGISTRATION: 123.95 if registered W of 030°W · 127.65 if registered E of 030°W. SATCOM 423201 — emergency only. (Air-to-air remains 123.45.)"},
  {t:"NAV AIDS — accuracy check", f:["FMS fix","FMS radial","FMS dist","RAW fix","RAW radial","RAW dist"]},
  {t:"HF", n:"Check if not done during pre-flight",
   a:"Use higher frequencies during daylight and lower frequencies at night.\n\nIf HF and SELCAL checks were not done on the ground, do them before oceanic entry. Additional SELCAL checks at each control-area boundary, regardless of CPDLC working normally.\n\nPosition report / SELCAL check on the HF (example): 'SHANWICK RADIO, GULFSTREAM NOVEMBER ONE THREE ZERO FOXTROT SIERRA, FLIGHT LEVEL 430, CPDLC, GANDER NEXT, REQUEST SELCAL CHECK CHARLIE DELTA ALPHA BRAVO.'"},
  {t:"CPDLC", n:"Log on to CPDLC and ADS-C 10–25 minutes prior (NAT: 15–45 min)",
   a:"Respond to uplinks within 60 s (send STANDBY if you need more time, then answer within the next 60 s). WILCO/UNABLE applies to ALL elements of the message — never comply with only part of a multi-element message. Any doubt about a CPDLC message: respond UNABLE and revert to voice.\n\nShanwick may uplink 'CONFIRM ASSIGNED ROUTE' after logon — respond by sending the current FMS flight plan; the controller checks it and only calls back if something is wrong.\n\nThe CPDLC position report at each FIR boundary establishes that center as your Current Data Authority (CDA).\n\nCPDLC failure phraseology: '[station] radio, [callsign], CPDLC failure, continuing on voice.'"},
  {t:"RNP", n:"Verify value"},
  {t:"ALTIMETERS (STD)", n:"Record readings", f:["Pilot's","STBY","Copilot's"]},
  {t:"COMPASS", n:"Record reading", f:["Reading"]},
 ]},
 {phase:"AFTER OCEANIC ENTRY", items:[
  {t:"TRANSPONDER", n:"Squawk 2000, 10 minutes after the OEP — except in the Reykjavik CTA and when transitioning Bermuda radar (retain the assigned code)"},
  {t:"SPEED", n:"Maintain assigned Mach, if applicable",
   a:"Advise ATC if the Mach changes by plus or minus 0.02 or more from the assigned / RCL Mach (NAT Doc 007). 'Resume Normal Speed' = fly RCL speed (Cost Index), still notifying ±0.02 changes."},
  {t:"VHF", n:"Set air-to-air VHF #2 123.45 and guard VHF #1 121.5 MHz"},
  {t:"SLOP", n:"0.7 NM, 1 NM or 2 NM to the RIGHT of the ATC cleared track",
   a:"Some routes and areas restrict routine offsets by local AIP rule (e.g. T9/T290, parts of the New York WAT structure) — check the State AIP before applying SLOP there."},
  {t:"ALTIMETERS", n:"Check hourly and record on the Master Document"},
 ]},
 {phase:"APPROACHING WAYPOINTS", items:[
  {t:"LAT/LONG", n:"Confirm expanded coordinates for the next and subsequent points",
   a:"Within a few minutes of crossing an oceanic waypoint, crosscheck the coordinates of the next and next+1 waypoints — expanded coordinates against the Master Document, per the currently effective ATC clearance. Verify FMS course/heading and distance to the next waypoint match the Master Document. Confirm autopilot steering in the proper lateral mode (LNAV/NAV).\n\nCPDLC route amendments arrive as full LAT/LONG and will not visually match stored waypoint names — independent PF/PM verification of expanded coordinates, course and distance. Magnetic-variation tables can shift displayed tracks by up to ±3°."},
 ]},
 {phase:"OVERHEAD WAYPOINTS", items:[
  {t:"WAYPOINT", n:"Confirm aircraft transition to the next waypoint"},
  {t:"TIME", n:"Confirm time to next waypoint (≤ 3 minutes)"},
  {t:"POSITION REPORT", n:"Include fuel",
   a:"If not CPDLC connected.\n\nStandard format (NAT Doc 007 §5.3.11):\n1) Contact call: '[Station] Radio, [callsign], POSITION on [frequency]'\n2) Station answers: '[callsign], [Station] Radio'\n3) Report: '[Station] Radio, [callsign], [waypoint] at [time], Flight Level [level], Estimating [next point] at [time], Next [point after that]'\n\nExample: 'Shanwick Radio, Swiss 456, RESNO at 1235, Flight Level 330, Estimating 56 North 020 West at 1310, Next 56 North 030 West.'\n\nTimes: 4 digits UTC. East/west tracks: latitude in degrees and minutes, longitude in degrees only. Stating the message type and the frequency in the contact call helps the radio operator, who monitors several frequencies.\n\nRevised estimate: if the ETA for the next point changes by 3 minutes or more, transmit a revised estimate as soon as possible. 'Operations normal' report = the contact call + 'OPERATIONS NORMAL'."},
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
 ["ICELAND", "No RCL from Mar/2026 — enter on current ATC clearance"],
 ["BODO", "20 min or more"],
 ["GANDER", "RCL 90–60 min · one-and-done (no clearance eastbound)"],
 ["SHANWICK", "RCL 90–30 min · clearance STILL issued (no OCR yet)"],
 ["NEW YORK", "see clearance note (3 elements)"],
 ["SANTA MARIA", "40 min or more · no RCL from Azores departures"],
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
