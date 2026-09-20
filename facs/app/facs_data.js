// Tabela 3 do TCC — fatores contribuintes e Valores de Risco (Vr)
// type: "check" = marca se aplicável (cada característica soma seu Vr)
//       "radio" = características graduadas/mutuamente exclusivas (uma só, com opção "não se aplica")
var FACS = [
 {group:"Pré-voo", items:[
  {n:1, name:"Preparação e planejamento do voo", type:"check",
   opts:[["Tempo disponível ≤ 3 horas", 3]]},
 ]},
 {group:"Tripulação PIC+SIC (Qualificação, Experiência e Desempenho)", items:[
  {n:2, name:"Experiência no tipo de equipamento", type:"radio",
   opts:[["> 30 ≤ 100 horas", 1], ["≤ 30 horas", 2]]},
  {n:3, name:"Experiência recente, últimos 30 dias", type:"radio",
   opts:[["> 10 ≤ 25 horas", 1], ["≤ 10 horas", 2]]},
  {n:4, name:"Conhecimento quanto à Operação, Aeroportos e Procedimentos", type:"radio",
   opts:[["Marginal", 2], ["Crítico", 3]], note:"Suficiente (Vr 1) é a condição normal — marque apenas quando abaixo disso; a linha 'Suficiente' da tabela original vale 1 e pode ser incluída pelo operador se desejar pontuar toda operação."},
  {n:5, name:"Condições da tripulação para desempenhar suas funções com segurança (medicação, doença, estresse ou fadiga)", type:"check",
   opts:[["Redução crítica", 3]]},
  {n:6, name:"Problemas emocionais, financeiros, no trabalho, no casamento ou com familiares próximos", type:"check",
   opts:[["Sim", 3]]},
 ]},
 {group:"Jornada de trabalho e Escala de voos", items:[
  {n:7, name:"Jornada de trabalho", type:"check", opts:[["≥ 8 horas", 3]]},
  {n:8, name:"Número de ciclos (pousos e decolagens)", type:"check", opts:[["> 4", 1]]},
  {n:9, name:"Jornada interrompida", type:"check", opts:[["Sim", 1]]},
  {n:10, name:"Apresentação entre 00:00 e 06:00", type:"check", opts:[["Sim", 2]]},
 ]},
 {group:"Aeronave", items:[
  {n:11, name:"Aeronave despachada com uso de MEL / voo de experiência", type:"check", opts:[["Sim", 3]]},
  {n:12, name:"Performance restrita por algum limitante", type:"check",
   opts:[["Limite estrutural ou limite de pista", 1]]},
  {n:13, name:"Combustível remanescente no destino (A+B+C)+", type:"radio",
   opts:[["≥ 45 min ≤ 1 hora", 1], ["= 45 minutos", 2]]},
 ]},
 {group:"Ambiente Operacional (DEP / ROTA / ARR)", items:[
  {n:14, name:"Terreno", type:"check",
   opts:[["Em rota, elevação > 20.000 ft", 1], ["Elevação > 5.000 ft no raio de 25 NM do aeroporto", 1]]},
  {n:15, name:"Condições atmosféricas adversas", type:"check",
   opts:[["Rajadas ≥ 20 kt, CB na vizinhança, wind-shear ou formação de gelo", 2]]},
  {n:16, name:"Aeroporto", type:"check",
   opts:[["Requer slot", 1], ["Não controlado", 1], ["Alta densidade de aeronaves e movimentações", 2],
         ["Elevação > 3.000 ft", 2], ["Risco de colisão conhecido (aviário / balões)", 3]]},
  {n:17, name:"Meteorologia (teto, visibilidade)", type:"check", opts:[["Mínimos IFR", 1]]},
  {n:18, name:"Espaço aéreo e comunicação", type:"check",
   opts:[["Voo ou parte do voo sem prestação de serviço ATS", 2]]},
  {n:19, name:"Rota", type:"check",
   opts:[["Grandes extensões de água ou áreas desabitadas", 2]]},
  {n:20, name:"SID / STAR / Aproximação", type:"radio",
   opts:[["Não precisão", 1], ["Visual", 2]]},
  {n:21, name:"Pista", type:"check",
   opts:[["Comprimento ≤ 1.500 m", 2], ["Sem auxílios visuais (ALS, VASI ou PAPI)", 1],
         ["Única pista no aeródromo de destino", 1], ["Contaminada", 2]]},
  {n:22, name:"Período", type:"check", opts:[["Noturno", 2]]},
  {n:23, name:"Regras de voo", type:"check", opts:[["Z (VFR/IFR) / Y (IFR/VFR) / VFR", 1]]},
 ]},
];

// Tabelas 5 e 6 — matriz de tolerabilidade e ações mitigadoras
var BANDS = [
 {max:3,  level:"Aceitável",   action:"Monitoramento", cls:"ok",
  desc:"Nível de risco leve — requer apenas monitoramento."},
 {max:8,  level:"Tolerável",   action:"Atenção", cls:"tol",
  desc:"Aceitável com medidas de controle em longo prazo."},
 {max:14, level:"Gerenciável", action:"Correção", cls:"ger",
  desc:"Aceitável com medidas de controle em curto prazo."},
 {max:Infinity, level:"Intolerável", action:"Paralisação", cls:"int",
  desc:"Inaceitável sob as circunstâncias existentes — requer resposta imediata."},
];
