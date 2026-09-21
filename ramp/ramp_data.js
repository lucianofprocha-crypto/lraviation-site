// Ramp Inspection Checklist (Emergency Equipment) — template exportado do FlightOps Companion
// Item: [nome, localização, condição, remarks padrão, applies_when]
var TEMPLATE = [
 {name:"AIRCRAFT CONDITION", items:[
  ["General External Condition","Aircraft Exterior","General","Preflight Inspection",null],
  ["General Internal Condition","Aircraft Interior","General","Preflight Inspection",null],
  ["General Condition of Cargo Compartment","Cargo Compartment","General","Preflight Inspection",null],
  ["Data plate and nationality / registration marks legible","External",null,"ANAC IS 00-009D 5.5.4.4 / RBAC 45 — fireproof data plate per 45.11 and 45.13; nationality and registration plate per 45.30-I; marks per RBAC 45 Subpart C.",null],
 ]},
 {name:"FLIGHT PLANING DATA RECORDS", items:[
  ["Navigation (Master) Flight Plan","Ipad Paperless","On Board",null,null],
  ["Takeoff and Landing Performance Calculations","Ipad Paperless","On Board",null,null],
  ["Weight and Balance Sheet Calculations","Ipad Paperless","On Board",null,null],
  ["NAV IDENT","FMS","Loaded",null,null],
  ["IFR Charts Revision Info","FMS","Loaded","VNX3-LUSK-SY4E-32PN",null],
  ["Passenger List","Ipad Paperless","On Board","Gendec",null],
  ["Journey Logbook Duty Time","Aircraft Logbook","On Board",null,null],
  ["Flight Crew License","Briefcase FWD Cabinet","On Board",null,null],
  ["Defect notification and rectification (Tech Log/Diário de Bordo)","Aircraft Logbook","On Board","SAFA 2025 ramp findings (EASA data via OPSGROUP, 24 AUG 2026) - good practice, not a regulatory citation: if the inspector can see it, the log must explain it. Staining, damage or a loose panel found on the walkaround has to be assessed, deferred, monitored or fixed in the log.",null],
  ["Normal and Emergency Checklists on board","Flight deck",null,"SAFA A05 · ANAC IS 00-009D 5.5.2.10 / RBAC 91.203(a)(2) — the G550 falls under Subpart F of RBAC 91, so 91.503 applies: normal AND emergency procedures, plus one-engine-inoperative climb data. Must identify which AFM/AOM it belongs to. On EFB only if IS 91-002 is met. · Checklist revision must match the AFM/AOM revision in use.",null],
  ["Navigation charts covering departure, destination and alternate","Flight deck",null,"SAFA A06 · ANAC IS 00-009D 5.5.2.11 / RBAC 91.203(a)(3) — current, covering navaids, approach and departure procedures for the route and every aerodrome to be used. On EFB only if IS 91-002 is met.",null],
 ]},
 {name:"AIRCRAFT DOCUMENTATION", items:[
  ["Certificate of Airworthiness","Briefcase FWD Cabinet","On Board",null,null],
  ["Certificate of Registration","Briefcase FWD Cabinet","On Board",null,null],
  ["Weight and Balance Data","Briefcase FWD Cabinet","On Board",null,null],
  ["Certificado de Verificação de Aeronavegabilidade (CVA)","Briefcase FWD Cabinet","On Board",null,null],
  ["Insurance Certificate","Briefcase FWD Cabinet","On Board","Including Mexico + AVN95",null],
  ["Insurance Certificate RETA","Briefcase FWD Cabinet","On Board",null,null],
  ["Radio License/Licença de Estação","Briefcase FWD Cabinet","On Board",null,null],
  ["FISTEL","Briefcase FWD Cabinet","On Board","Taxa de fiscalização da ANATEL, anual: sem ela a Licença de Estação perde validade, e é a licença que o inspetor pede.",null],
  ["Noise Certificate","Briefcase FWD Cabinet","On Board",null,null],
  ["U.S Overflight Exemption Letter","Briefcase FWD Cabinet","On Board","OEL (General Aviation Processing). Só se aplica em operação nos Estados Unidos; fora deles, N/A.","US operations only"],
  ["Logbook/Diário de Bordo","Briefcase FWD Cabinet","On Board",null,null],
  ["AOM","Ipad Paperless","On Board","IPAD Revision - 47 Jun 02, 2026",null],
  ["AFM","Ipad Paperless","On Board","IPAD Revision - 45 Jun 02, 2026",null],
  ["MEL","Ipad Paperless","On Board","Revisão Original 01/OCT/2024 · Must be the operator's own customised MEL, not the MMEL with a new cover, and customisation complete.",null],
  ["Certificate of Residual Desinsetcion","Briefcase FWD Cabinet","On Board",null,null],
  ["Major Modifications and Repairs Charts (Mapas de Grandes Modificações e Reparos)","Briefcase Cockpit Floor Cabinet",null,"Acompanha a ficha de peso e balanceamento: modificação grande muda peso e centragem.",null],
  ["CBP Decal (US Customs user fee)","Aircraft exterior",null,"Selo anual da alfândega americana, colado na aeronave.","US operations only"],
 ]},
 {name:"FLIGHT DECK SAFETY EQUIPMENT", items:[
  ["General Condition",null,"Check",null,null],
  ["Signs and Placards","Multiple Cockpit locations","Check",null,null],
  ["Flashlight","Aft section side console pilot's seat","Check Red Light","Red Light must be on or blinking",null],
  ["Flashlight","Aft section side console copilot's seat","Check Red Light","Red Light must be on or blinking",null],
  ["Oxygen Supply (Cabin Crew and Passengers)","Copilot's Side Console / Service Panel","Green Range","1.800 psi (±50) @ 21.1°C / 1.500 psi MIN",null],
  ["Portable Oxygen Cylinder and Mask (HUD)","Aft copilot's seat","Condition","1.800 psi (±50) @ 21.1°C / 1.500 psi MIN",null],
  ["EVAS (Location / Blower / Battery)","Pilot's side console (green)","Check","Service every 24 months (+/- 3 month)",null],
  ["EVAS (Location / Blower / Battery)","Copilot's side console (GREEN)","Check","Service every 24 months (+/- 3 month)",null],
  ["Oxygen Mask","On lateral left console","Check",null,null],
  ["Oxygen Mask","On lateral right console","Check",null,null],
  ["Oxygen Mask","Observer seat","Check",null,null],
  ["Smoke Goggle","Pilot's console","On Board",null,null],
  ["Smoke Goggle","Copilot's Console","On Board",null,null],
  ["Smoke Goggle","Observer seat","On Board",null,null],
  ["Fire Extinguisher (3.71 Lb)","Cockpit partition behind pilot's seat","Condition","Green range",null],
  ["Life Vest","Behind pilot's seat","On Board",null,null],
  ["Life Vest (2x)","Behind copilot's seat","On Board",null,null],
  ["Crew Seat and Seat Belts","Pilot's seat","Check",null,null],
  ["Crew Seat and Seat Belts","Copilot's seat","Check",null,null],
  ["Crew Seat and Seat Belts","Observer's seat","Check",null,null],
  ["ASC-008 Maximum Landing Weight (75.000 lbs)","Cockpit Panel right side","Check",null,null],
  ["Crew shoulder harness","Flight deck",null,"SAFA A17 · ANAC IS 00-009D 5.5.3.3.4 / RBAC 91.205(b)(12)(13)(15) — checked separately from the lap belt.",null],
 ]},
 {name:"CREW REST AND ENTRANCE AREA SAFETY EQUIPMENT", items:[
  ["Signs and Placards","Multiple Interior locations","Check",null,null],
  ["Life Vest","Under crew's rest seat","On Board",null,null],
  ["Access to Emergency Exit (Main Door)","Forward door exit","Check",null,null],
 ]},
 {name:"PASSENGER AREA SAFETY EQUIPMENT", items:[
  ["Signs and Placards","Multiple Interior locations","Check",null,null],
  ["Safety Briefing Card","Behind each seat","On Board",null,null],
  ["DGR Briefing Card","Behind each seat","On Board",null,null],
  ["Life Vest (2x)","FWD Club seat / FWD facing","On Board",null,null],
  ["Life Vest (2x)","FWD Club seat / AFT facing","On Board",null,null],
  ["Life Vest (4x)","Confere table","On Board",null,null],
  ["Life Raft (right)","Underneath Divan","On Board","Hidro Feb/2025",null],
  ["Life Raft (left)","Underneath Divan","On Board","Hidro Feb/2025",null],
  ["Life Vest (1x)","01 Seats FWD facing","On Board",null,null],
  ["Life Vest (1x)","01 Seats AFT facing","On Board",null,null],
  ["Life Vest (2x)","Underneath Divan","On Board","Form attached",null],
  ["Life Vest (2x)","Underneath Divan (2)","On Board","Form attached",null],
  ["First Aid Kit","Divan right side lateral pocket","On Board",null,null],
  ["Automated External Defibrillator (AED)","Divan right side lateral pocket","On Board","PADS 14/JAN/2026",null],
  ["Fire Extinguisher (water)","Behind club seat","On Board",null,null],
  ["Fire Extinguisher Halotron (2 1/2 Lb/1.13 oz)","Behind club seat","On Board",null,null],
  ["Access to Emergency Exit (2x)","Over-wing exits (Left side)","Check",null,null],
  ["Access to Emergency Exit (2x)","Over-wing exits (Right side)","Check",null,null],
  ["Emergency Exit Signs","Over-wing exit","Check",null,null],
  ["Seat Belts and Seats Condition","Each seat and Divan","Check",null,null],
  ["Cabin secured for flight - loose items stowed","Cabin",null,"SAFA 2025 ramp findings - good practice: unsecured cabin equipment and blocked emergency-exit access were among the more serious findings. A final sweep before departure catches most of it.",null],
 ]},
 {name:"TOILET CABINET COMPARTMENT", items:[
  ["Fire Extinguisher (5.0 Lb/4.5 oz)","Cabinet compartment right door","Check","Hydrostatic test due 31/Aug/2029",null],
  ["Protective Breathing Equipment (PBE)","Cabinet compartment right door","Check",null,null],
  ["Portable Scale","Cabinet compartment left door","On Board",null,null],
 ]},
 {name:"BAGGAGE COMPARTMENT", items:[
  ["Signs and Placards","Multiple Interior locations","Check",null,null],
  ["ELT","Behind compartment wall","Check","Battery valid until May/2029",null],
  ["Flashlight (1x)","Baggage compartment wall","Check Red Light","Red Light must be on or blinking",null],
  ["Cargo restrained and within compartment limits","Baggage compartment",null,"SAFA 2025 ramp findings - good practice: poorly restrained cargo was among the more serious findings. Nets/straps in place, load within the placarded limit, nothing able to move in turbulence or block access.",null],
 ]},
 {name:"AUTHORIZED OPERATIONS", items:[
  ["LOA NAT-HLA","Briefcase Cockpit Floor Cabinet","Check",null,null],
  ["LOA PBN","Briefcase Cockpit Floor Cabinet","Check","iPad",null],
  ["LOA RVSM","Briefcase Cockpit Floor Cabinet","Check","iPad",null],
  ["LOA CPDLC/ADS-C","Briefcase Cockpit Floor Cabinet","Check",null,null],
  ["LOA EFVS","Briefcase Cockpit Floor Cabinet","Check",null,null],
  ["LOA GRF (Global Reporting Format)","Briefcase Cockpit Floor Cabinet",null,"Formato global de reporte de condição de pista. Authorization to fly under RBAC 117, Appendix E, rules.",null],
  ["ATC flight plan Item 10 matches installed, serviceable and approved capability","ForeFlight Settings ICAO FPL",null,"SAFA 2025 ramp findings - good practice. Equipment and surveillance codes checked against the LOAs above (NAT-HLA, PBN, RVSM, CPDLC/ADS-C, EFVS, GRF) AND against what is working today: a code filed for a capability that is inoperative or whose LOA has expired is a finding. · PBN LOA on file: valid ONLY outside Brazilian territory (IS 91-001 rev I, §5.5.4(c)); for domestic flights the authorisation is the aircraft capability declaration plus crew PBN proficiency evidence renewed within 2 years (§5.5.4(b)). The LOA is void if the operator changes or if the manufacturer's Maintenance Programme is not met.",null],
  ["ATC flight plan Item 18 entries checked (PBN/ NAV/ COM/ DAT/ SUR/ REG/ OPR/)","ForeFlight Settings ICAO FPL",null,"SAFA 2025 ramp findings - good practice. OPR/ must identify the actual operating agency. · PBN/ codes granted by the LOA: A1 (RNAV 10), B2 B3 B4 B5 (RNAV 5 - GNSS, DME/DME, VOR/DME, INS/IRS), C1 (RNAV 2), D1 (RNAV 1), L1 (RNP 4), O2 (RNP 1 GNSS), S2 (RNP APCH with BARO-VNAV). B4 means VOR/DME is an APPROVED position source - PBN does not retire the VOR (IS 91-001 rev I §D5.3). File only codes whose capability is installed, serviceable and covered by a valid LOA.",null],
 ]},
 {name:"MAINTENANCE STATUS", items:[
  ["VOR CHECK",null,"Check","RBAC 91.171(a)(2) (EMD 07) - VOR operationally checked within the last 30 days is required to fly IFR USING VOR. Dual VOR: test one unit against the other, max +/-4 deg (§c). Ground test +/-4 deg; airborne +/-6 deg (§b). Record date, place, bearing error and signature in the maintenance log (§d).",null],
  ["LAST / NEXT MAINTANCE",null,"Check","750 HRS / 12 MO",null],
 ]},
 {name:"EXTERNAL INSPECTION", items:[
  ["Doors and hatches","External",null,"SAFA C02",null],
  ["Flight controls","External",null,"SAFA C03",null],
  ["Wheels, tyres and brakes","External",null,"SAFA C04 · ANAC IS 00-009D 5.5.4.3",null],
  ["Undercarriage, skids / floats","External",null,"SAFA C05",null],
  ["Wheel well","External",null,"SAFA C06 · ANAC IS 00-009D 5.5.4.3",null],
  ["Powerplant and pylon","External",null,"SAFA C07",null],
  ["Fan blades","External",null,"SAFA C08 · ANAC IS 00-009D 5.5.4.3",null],
  ["Obvious repairs","External",null,"SAFA C10 · ANAC IS 00-009D 5.5.4.3",null],
  ["Obvious unrepaired damage","External",null,"SAFA C11",null],
  ["Leakage","External",null,"SAFA C12 · ANAC IS 00-009D 5.5.4.3 — fuel, oil or hydraulic dripping",null],
 ]},
 {name:"CREW", items:[
  ["Official photo ID carried","Crew member 1",null,"ANAC IS 00-009D 5.4.1 / Lei 12.037/2009 — ID card, work card, professional card, passport or functional ID. Digital format accepted where the law allows.",null],
  ["Official photo ID carried","Crew member 2",null,"ANAC IS 00-009D 5.4.1 / Lei 12.037/2009.",null],
  ["Official photo ID carried","Crew member 3",null,"ANAC IS 00-009D 5.4.1 / Lei 12.037/2009.",null],
  ["Official photo ID carried","Crew member 4",null,"ANAC IS 00-009D 5.4.1 / Lei 12.037/2009.",null],
  ["Second pair of glasses (if CMA has corrective-lens restriction)","Crew member 1",null,"ANAC IS 00-009D 5.4.3.1 — required even when the crew member wears contact lenses. RBAC 67.99(g)(4) / 67.139(g)(4) / 67.259(g)(4). N/A if the CMA carries no such restriction.",null],
  ["Second pair of glasses (if CMA has corrective-lens restriction)","Crew member 2",null,"ANAC IS 00-009D 5.4.3.1.",null],
  ["Second pair of glasses (if CMA has corrective-lens restriction)","Crew member 3",null,"ANAC IS 00-009D 5.4.3.1.",null],
  ["Second pair of glasses (if CMA has corrective-lens restriction)","Crew member 4",null,"ANAC IS 00-009D 5.4.3.1.",null],
 ]},
];

// Seed: valores herdados da última inspeção exportada (datas e vencimentos).
// Chave "si:ii" (índice da seção : índice do item) → [inspected_on, due_date, remarks_override, status_override]
var SEED = {
 "1:3": ["2026-09-02", "2026-09-30", null, null],                      // NAV IDENT
 "1:4": ["2026-09-02", "2026-09-16", null, null],                      // IFR Charts
 "1:9": ["2026-09-12", null, null, null],                              // Normal/Emerg checklists
 "2:3": ["2026-08-21", "2027-08-21", null, null],                      // CVA
 "2:4": ["2026-07-16", "2027-07-16", null, null],                      // Insurance
 "2:5": ["2026-07-16", "2027-07-16", null, null],                      // Insurance RETA
 "2:6": [null, "2044-10-04", null, null],                              // Radio License
 "2:9": ["2026-08-18", "2029-08-18", null, null],                      // US OEL
 "2:14": ["2026-08-10", "2026-09-25", null, null],                     // Desinsection
 "2:15": [null, null, null, "NC"],                                     // Major Mod charts (última: NC)
 "3:5": ["2023-05-01", "2028-05-01", null, null],                      // Portable O2 (HUD)
 "3:6": ["2025-06-23", "2028-07-01", null, null],                      // EVAS pilot
 "3:7": ["2025-06-23", "2028-07-01", null, null],                      // EVAS copilot
 "3:14": ["2026-06-25", "2027-06-25", null, null],                     // Fire Ext 3.71
 "3:15": ["2018-06-26", "2028-06-28", null, null],                     // Life Vest pilot
 "3:16": ["2018-06-26", "2028-06-28", null, null],                     // Life Vest copilot 2x
 "4:1": ["2018-06-26", "2028-06-28", null, null],                      // Life Vest crew rest
 "5:3": ["2018-06-26", "2028-06-28", null, null],                      // LV FWD club FWD
 "5:4": ["2018-06-26", "2028-06-28", null, null],                      // LV FWD club AFT
 "5:5": ["2018-06-26", "2028-06-28", null, null],                      // LV 4x table
 "5:6": ["2026-09-14", "2027-05-30", null, null],                      // Life Raft right
 "5:7": ["2026-09-14", "2028-05-01", null, null],                      // Life Raft left
 "5:12": ["2025-04-30", "2027-06-01", null, null],                     // First Aid Kit
 "5:13": ["2026-09-14", "2029-05-31", null, null],                     // AED
 "5:14": ["2023-05-01", "2028-05-01", null, null],                     // Fire Ext water
 "5:15": ["2024-06-16", "2028-05-01", null, null],                     // Fire Ext Halotron
 "6:0": ["2024-06-16", "2031-08-31", null, null],                      // Fire Ext 5.0
 "6:1": ["2026-09-14", "2033-03-31", null, null],                      // PBE
 "7:1": ["2024-09-30", "2027-05-01", null, null],                      // ELT
 "9:0": ["2026-09-03", "2026-10-03", "VOR 1-2 BSB 0 ERROR", null],     // VOR CHECK
 "9:1": ["2026-08-21", "2027-04-01", null, null],                      // Last/Next maint
};

// Matrícula e serial não ficam no arquivo público: preencha no app na primeira inspeção —
// os valores são salvos no dispositivo e herdados pelas inspeções seguintes.
var SEED_HEADER = { aircraft: "", serial_number: "", inspector: "", location: "" };
