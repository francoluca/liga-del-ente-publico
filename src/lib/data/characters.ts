export type CharacterType = 'killer' | 'survivor';
export type Division = 'Iridiscente' | 'Oro' | 'Plata' | 'Bronce' | 'Ceniza';

export interface CharacterData {
  id: number;
  name: string;
  type: CharacterType;
  division: Division;
  image: string;
  expertPerks: string[];
  metaBuild: string[];
}

export const KILLER_GENERIC_PERKS = [
  'acechador_de_ciervos', 'apreton_de_hierro', 'carnicero_chapucero', 'desasosiego',
  'esperanza_rota', 'espias_de_las_sombras', 'santuario_monstruoso', 'implacable',
  'insidia', 'la_emocion_de_la_caza', 'nadie_escapa_de_la_muerte', 'murmullo_amargo', 'murmullos'
];

export const SURVIVOR_GENERIC_PERKS = [
  'carne_resbaladiza', 'caza_menor', 'de_pies_ligeros', 'deja_vu', 'escalofrios', 'esperanza',
  'esto_no_puede_estar_pasando', 'familia', 'instinto_saqueador', 'nadie_se_queda_atras',
  'percepcion_oscura', 'premonicion', 'resiliencia', 'sobreviviremos', 'agilidad', 'alerta',
  'autocuracion', 'baila_conmigo', 'camaraderia', 'conocimientos_de_botanica', 'conexion_empatica',
  'despierta', 'el_temple_del_hombre', 'esprint', 'evasion_urbana', 'fortaleza_en_las_sombras',
  'golpe_decisivo', 'inquebrantable', 'lider', 'me_da_igual', 'nos_vemos', 'objeto_de_obsesion',
  'sabotear', 'solidaridad', 'tenacidad', 'vinculo', 'voluntad_de_hierro'
];

export const DIVISION_ORDER: Division[] = ['Iridiscente', 'Oro', 'Plata', 'Bronce', 'Ceniza'];

export const SEASON_DISTRIBUTIONS: Record<CharacterType, Record<Division, {
  total: number;
  ascend: number;
  descend: number;
  playOff: number;
}>> = {
  killer: {
    Iridiscente: { total: 10, ascend: 0, descend: 3, playOff: 4 },
    Oro: { total: 10, ascend: 3, descend: 3, playOff: 0 },
    Plata: { total: 10, ascend: 3, descend: 3, playOff: 0 },
    Bronce: { total: 7, ascend: 3, descend: 3, playOff: 0 },
    Ceniza: { total: 6, ascend: 3, descend: 0, playOff: 0 },
  },
  survivor: {
    Iridiscente: { total: 10, ascend: 0, descend: 3, playOff: 4 },
    Oro: { total: 10, ascend: 3, descend: 3, playOff: 0 },
    Plata: { total: 11, ascend: 3, descend: 3, playOff: 0 },
    Bronce: { total: 11, ascend: 3, descend: 3, playOff: 0 },
    Ceniza: { total: 11, ascend: 3, descend: 0, playOff: 0 },
  },
};

export const DIVISION_LIMITS: Record<CharacterType, Record<Division, number>> = {
  killer: { Iridiscente: 10, Oro: 10, Plata: 10, Bronce: 7, Ceniza: 6 },
  survivor: { Iridiscente: 10, Oro: 10, Plata: 11, Bronce: 11, Ceniza: 11 }
};

export const killers: Omit<CharacterData, 'type' | 'division'>[] = [
  { id: 1, name: 'El Payaso', image: 'img/clown.webp', expertPerks: ['coulrofobia', 'desconcierto', 'pim_pam_pum'], metaBuild: ['amigos_hasta_el_fin', 'brutalidad_veloz', 'persecucion_furtiva', 'aprendizaje_automatizado'] },
  { id: 2, name: 'El Deterioro', image: 'img/blight.webp', expertPerks: ['garra_de_dragon', 'favor_de_sangre', 'inmortal'], metaBuild: ['enfurecimiento', 'ruina', 'obertura_de_la_perdicion', 'dolor_resonante'] },
  { id: 3, name: 'La Enfermera', image: 'img/nurse.webp', expertPerks: ['aliento', 'tanatofobia', 'vocacion_de_enfermera'], metaBuild: ['obsequio_de_dolor', 'agitacion', 'tanatofobia', 'dolor_resonante'] },
  { id: 4, name: 'Hillbilly', image: 'img/billy.webp', expertPerks: ['hijo_de_la_luz', 'reparador', 'resistente'], metaBuild: ['terror_contagioso', 'duda_forzada', 'dolor_resonante', 'ruina'] },
  { id: 5, name: 'Los Mellizos', image: 'img/twins.webp', expertPerks: ['acumulador', 'golpe_de_gracia', 'opresion'], metaBuild: ['acechador_de_ciervos', 'ruina', 'inmortal', 'mente_colmena'] },
  { id: 6, name: 'Drácula', image: 'img/dracula.webp', expertPerks: ['codicia_humana', 'dominacion', 'destino_miserable'], metaBuild: ['unidos_por_siempre', 'erupcion', 'opresion', 'agitacion'] },
  { id: 7, name: 'Kaneki', image: 'img/kaneki.webp', expertPerks: ['pura_miseria', 'nadie_es_libre', 'unidos_por_siempre'], metaBuild: ['amigos_hasta_el_fin', 'persecucion_furtiva', 'abrazo_de_la_muerte', 'dolor_resonante'] },
  { id: 8, name: 'La Espíritu', image: 'img/spirit.webp', expertPerks: ['furia_espiritual', 'tierra_embrujada', 'rencor'], metaBuild: ['amigos_hasta_el_fin', 'carnicero_chapucero', 'dolor_resonante', 'ruina'] },
  { id: 9, name: 'La Singularidad', image: 'img/singularity.webp', expertPerks: ['aprendizaje_automatizado', 'duda_forzada', 'limites_geneticos'], metaBuild: ['opresion', 'pim_pam_pum', 'erupcion', 'anuncio_de_salmuera'] },
  { id: 10, name: 'Vecna', image: 'img/vecna.webp', expertPerks: ['mente_colmena', 'proyecto_secreto', 'retrocede_el_tiempo'], metaBuild: ['agitacion', 'apreton_de_hierro', 'conciencia_de_estar_despiertos', 'ruina'] },
  { id: 11, name: 'Krasue', image: 'img/krasue.webp', expertPerks: ['obertura_de_la_perdicion', 'ojo_errante', 'voracidad'], metaBuild: ['mente_colmena', 'dolor_resonante', 'ruina', 'la_emocion_de_la_caza'] },
  { id: 12, name: 'Chucky', image: 'img/chucky.webp', expertPerks: ['amigos_hasta_el_fin', 'baterias_incluidas', 'yo_tambien_puedo_jugar'], metaBuild: ['enfurecimiento', 'dolor_resonante', 'erupcion', 'abrazo_de_la_muerte'] },
  { id: 13, name: 'El Oni', image: 'img/oni.webp', expertPerks: ['eco_de_sangre', 'némesis', 'tacticas_zanshin'], metaBuild: ['perseguidor_letal', 'terror_contagioso', 'miedo_fantasmal', 'duda_forzada'] },
  { id: 14, name: 'Freddy Krueger', image: 'img/freddy.webp', expertPerks: ['enfurecimiento', 'guardian_de_sangre', 'recuerdame'], metaBuild: ['unidos_por_siempre', 'fuerza_brutal', 'pim_pam_pum', 'erupcion'] },
  { id: 15, name: 'La Artista', image: 'img/artist.webp', expertPerks: ['abrazo_de_la_muerte', 'dolor_resonante', 'arrepentimiento'], metaBuild: ['interruptor_de_hombre_muerto', 'parrillada_y_chile', 'aprendizaje_automatizado', 'pim_pam_pum'] },
  { id: 16, name: 'Wesker', image: 'img/wesker.webp', expertPerks: ['anatomia_superior', 'conciencia_de_estar_despiertos', 'terminal'], metaBuild: ['agitacion', 'coulrofobia', 'dolor_resonante', 'erupcion'] },
  { id: 17, name: 'La Plaga', image: 'img/plague.webp', expertPerks: ['devocion_oscura', 'intervencion_corrupta', 'terror_contagioso'], metaBuild: ['duda_forzada', 'perseguidor_letal', 'miedo_fantasmal', 'terror_contagioso'] },
  { id: 18, name: 'Pirámide', image: 'img/pyramid.webp', expertPerks: ['atadura_mortal', 'penitencia_forzada', 'senda_del_tormento'], metaBuild: ['intervencion_corrupta', 'mente_colmena', 'ruina', 'la_emocion_de_la_caza'] },
  { id: 19, name: 'Michael Myers', image: 'img/myers.webp', expertPerks: ['jugar_con_la_comida', 'lo_mejor_para_el_final', 'luz_que_agoniza'], metaBuild: ['intervencion_corrupta', 'desconcierto', 'dolor_resonante', 'anuncio_de_salmuera'] },
  { id: 20, name: 'La Cazadora', image: 'img/huntress.webp', expertPerks: ['arullo_de_cazadora', 'bestia_de_presa', 'instinto_territorial'], metaBuild: ['parrillada_y_chile', 'dolor_resonante', 'murmullo_amargo', 'retrocede_el_tiempo'] },
  { id: 21, name: 'Cenobita', image: 'img/pinhead.webp', expertPerks: ['callejon_sin_salida', 'obsequio_de_dolor', 'tiempo_de_jugar'], metaBuild: ['perseguidor_letal', 'parrillada_y_chile', 'interruptor_de_hombre_muerto', 'erupcion'] },
  { id: 22, name: 'El Arponero', image: 'img/deathslinger.webp', expertPerks: ['cabeza_dentada', 'interruptor_de_hombre_muerto', 'retribucion'], metaBuild: ['perseguidor_letal', 'retrocede_el_tiempo', 'acechador_de_ciervos', 'garra_de_dragon'] },
  { id: 23, name: 'La Adiestradora', image: 'img/houndmaster.webp', expertPerks: ['brujula_irregular', 'sin_piedad', 'trueno_sismico'], metaBuild: ['dolor_resonante', 'brutalidad_veloz', 'noqueo', 'ruina'] },
  { id: 24, name: 'Némesis', image: 'img/nemesis.webp', expertPerks: ['erupcion', 'histeria', 'perseguidor_letal'], metaBuild: ['discordancia', 'unidos_por_siempre', 'ruina', 'inmortal'] },
  { id: 25, name: 'Springtrap', image: 'img/springtrap.webp', expertPerks: ['caos', 'miedo_fantasmal', 'pedido_de_ayuda'], metaBuild: ['parrillada_y_chile', 'quebrantamentes', 'dolor_resonante', 'ruina'] },
  { id: 26, name: 'El Demogorgon', image: 'img/demogorgon.webp', expertPerks: ['quebrantamentes', 'restriccion_cruel', 'sobrecarga_demogorgon'], metaBuild: ['duda_forzada', 'arrogancia_oscura', 'dolor_resonante', 'erupcion'] },
  { id: 27, name: 'El Liche', image: 'img/liche.webp', expertPerks: ['armonizacion_de_tejido', 'arrogancia_oscura', 'toque_langido'], metaBuild: ['perseguidor_letal', 'acechador_de_ciervos', 'dolor_resonante', 'erupcion'] },
  { id: 28, name: 'El Espectro', image: 'img/wraith.webp', expertPerks: ['depredacion', 'hijo_de_las_sombras', 'sabueso_de_sangre'], metaBuild: ['retrocede_el_tiempo', 'dolor_resonante', 'desconcierto', 'erupcion'] },
  { id: 29, name: 'Alien', image: 'img/alien.webp', expertPerks: ['arma_definitiva', 'brutalidad_veloz', 'instinto_alienigena'], metaBuild: ['unidos_por_siempre', 'baterias_incluidas', 'pim_pam_pum', 'erupcion'] },
  { id: 30, name: 'Lo Desconocido', image: 'img/unknown.webp', expertPerks: ['desatado', 'imprevisto', 'inacabado'], metaBuild: ['instinto_alienigena', 'amigos_hasta_el_fin', 'imprevisto', 'persecucion_furtiva'] },
  { id: 31, name: 'Trickster', image: 'img/trickster.webp', expertPerks: ['deslumbrante', 'control_del_publico', 'sin_salida'], metaBuild: ['tiempo_de_jugar', 'proyecto_secreto', 'pim_pam_pum', 'interruptor_de_hombre_muerto'] },
  { id: 32, name: 'El Caballero', image: 'img/knight.webp', expertPerks: ['enfrentar_a_la_oscuridad', 'no_hay_donde_esconderse', 'soberbia'], metaBuild: ['mente_colmena', 'dolor_resonante', 'ruina', 'la_emocion_de_la_caza'] },
  { id: 33, name: 'La Cerda', image: 'img/pig.webp', expertPerks: ['truco_del_verdugo', 'supervision', 'toma_una_decision'], metaBuild: ['desconcierto', 'callejon_sin_salida', 'pim_pam_pum', 'abrazo_de_la_muerte'] },
  { id: 34, name: 'El Doctor', image: 'img/doctor.webp', expertPerks: ['monitorizacion_y_abuso', 'sobrecarga', 'presencia_abrumadora'], metaBuild: ['tacticas_zanshin', 'pim_pam_pum', 'dolor_resonante', 'retrocede_el_tiempo'] },
  { id: 35, name: 'Sadako', image: 'img/sadako.webp', expertPerks: ['anuncio_de_salmuera', 'torrente_de_ira', 'tormenta_despiadada'], metaBuild: ['devoradora_de_esperanza', 'la_emocion_de_la_caza', 'mente_colmena', 'ruina'] },
  { id: 36, name: 'Bubba', image: 'img/bubba.webp', expertPerks: ['muerte_de_franklin', 'noqueo', 'parrillada_y_chile'], metaBuild: ['discordancia', 'duda_forzada', 'terror_contagioso', 'desconcierto'] },
  { id: 37, name: 'La Draga', image: 'img/dredge.webp', expertPerks: ['contacto_septico', 'disolucion', 'oscuridad_revelada'], metaBuild: ['tierra_embrujada', 'devoradora_de_esperanza', 'amigos_hasta_el_fin', 'toma_una_decision'] },
  { id: 38, name: 'La Legión', image: 'img/legion.webp', expertPerks: ['discordancia', 'doncella_de_hierro', 'furia_ciega'], metaBuild: ['devoradora_de_esperanza', 'la_emocion_de_la_caza', 'ruina', 'perseguidor_letal'] },
  { id: 39, name: 'La Bruja', image: 'img/hag.webp', expertPerks: ['devoradora_de_esperanza', 'el_tercer_sello', 'ruina'], metaBuild: ['intervencion_corrupta', 'retrocede_el_tiempo', 'dolor_resonante', 'anuncio_de_salmuera'] },
  { id: 40, name: 'La Comerciante', image: 'img/skullmerchant.webp', expertPerks: ['hora_de_la_caceria', 'influencia', 'plaf'], metaBuild: ['terminal', 'recuerdame', 'nadie_es_libre', 'sin_salida'] },
  { id: 41, name: 'Ghost Face', image: 'img/ghostface.webp', expertPerks: ['persecucion_furtiva', 'soy_todo_oidos', 'temblores_trepidantes'], metaBuild: ['control_del_publico', 'devoradora_de_esperanza', 'tierra_embrujada', 'inmortal'] },
  { id: 42, name: 'El Trampero', image: 'img/trapper.webp', expertPerks: ['agitacion', 'fuerza_brutal', 'presencia_perturbadora'], metaBuild: ['intervencion_corrupta', 'dolor_resonante', 'retrocede_el_tiempo', 'enfurecimiento'] },
  { id: 43, name: 'Jason', image: 'img/jason.webp', expertPerks: ['sombra_silenciosa', 'matanza', 'terror_hasta_la_muerte'], metaBuild: ['intervencion_corrupta', 'dolor_resonante', 'retrocede_el_tiempo', 'enfurecimiento'] },
];

export const survivors: Omit<CharacterData, 'type' | 'division'>[] = [
  { id: 101, name: 'Dwight Fairfield', image: 'img/dwight.png', expertPerks: ['vinculo', 'demuestra_lo_que_vales', 'lider'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 102, name: 'Meg Thomas', image: 'img/meg.png', expertPerks: ['velocidad_silenciosa', 'esprint', 'adrenalina'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 103, name: 'Claudette Morel', image: 'img/claudette.png', expertPerks: ['empatia', 'conocimientos_de_botanica', 'autocuracion'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 104, name: 'Jake Park', image: 'img/jake.png', expertPerks: ['voluntad_de_hierro', 'espiritu_calmado', 'sabotear'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 105, name: 'Nea Karlsson', image: 'img/nea.png', expertPerks: ['caida_equilibrada', 'evasion_urbana', 'de_la_calle'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 106, name: 'Bill Overbeck', image: 'img/bill.png', expertPerks: ['abandonado_a_tu_suerte', 'tiempo_prestado', 'inquebrantable'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 107, name: 'Laurie Strode', image: 'img/laurie.png', expertPerks: ['objeto_de_obsesion', 'solo_quedo_yo', 'golpe_decisivo'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 108, name: 'Ace Visconti', image: 'img/ace.png', expertPerks: ['as_en_la_manga', 'subir_las_apuestas', 'a_mano_descubierta'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 109, name: 'Feng Min', image: 'img/feng.png', expertPerks: ['pericia_tecnica', 'agilidad', 'alerta'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 110, name: 'David King', image: 'img/david.png', expertPerks: ['vamos_a_vivir_para_siempre', 'fajador', 'me_da_igual'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 111, name: 'Quentin Smith', image: 'img/quentin.png', expertPerks: ['despierta', 'farmacia', 'vigilia'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 112, name: 'Detective Tapp', image: 'img/tapp.png', expertPerks: ['tenacidad', 'corazonada', 'bajo_vigilancia'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 113, name: 'Kate Denson', image: 'img/kate.png', expertPerks: ['baila_conmigo', 'oportunidades', 'arrebato'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 114, name: 'Adam Francis', image: 'img/adam.png', expertPerks: ['distraccion', 'liberacion', 'autodidacta'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 115, name: 'Jeff Johansen', image: 'img/jeff.png', expertPerks: ['ruptura', 'postratamiento', 'distorsion'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 116, name: 'Jane Romero', image: 'img/jane.png', expertPerks: ['solidaridad', 'serenidad', 'de_frente'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 117, name: 'Ashley J. Williams', image: 'img/ash.png', expertPerks: ['nos_vemos', 'el_temple_del_hombre', 'sujetate'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 118, name: 'Nancy Wheeler', image: 'img/nancy.png', expertPerks: ['mejor_juntos', 'fijacion', 'fuerza_interior'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 119, name: 'Steve Harrington', image: 'img/steve.png', expertPerks: ['camaraderia', 'segundo_aliento', 'ninero'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 120, name: 'Yui Kimura', image: 'img/yui.png', expertPerks: ['por_cualquier_medio', 'fuga', 'golpe_de_suerte'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 121, name: 'Zarina Kassir', image: 'img/zarina.png', expertPerks: ['extraoficialmente', 'arenque_rojo', 'por_la_gente'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 122, name: 'Cheryl Mason', image: 'img/cheryl.png', expertPerks: ['defensa_del_alma', 'pacto_de_sangre', 'alianza_reprimida'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 123, name: 'Felix Richter', image: 'img/felix.png', expertPerks: ['visionario', 'medidas_desesperadas', 'disenado_para_durar'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 124, name: 'Élodie Rakoto', image: 'img/elodie.png', expertPerks: ['detallista', 'engano', 'lucha_de_poderes'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 125, name: 'Yun-Jin Lee', image: 'img/yun.png', expertPerks: ['via_rapida', 'exito_arrollador', 'autopreservacion'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 126, name: 'Jill Valentine', image: 'img/jill.png', expertPerks: ['contramedida', 'resurgimiento', 'mina_cegadora'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 127, name: 'Leon S. Kennedy', image: 'img/leon.png', expertPerks: ['aguante_el_dolor', 'granada_aturdidora', 'espiritu_de_novato'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 128, name: 'Mikaela Reid', image: 'img/mikaela.png', expertPerks: ['clarividencia', 'circulo_de_curacion', 'paso_de_las_sombras'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 129, name: 'Jonah Vasquez', image: 'img/jonah.png', expertPerks: ['superar', 'correccion', 'exponencial'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 130, name: 'Yoichi Asakawa', image: 'img/yoichi.png', expertPerks: ['consejos_de_papa', 'teoria_oscura', 'conexion_empatica'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 131, name: 'Haddie Kaur', image: 'img/haddie.png', expertPerks: ['enfoque_interno', 'manifiesto_residual', 'demasiado_entusiasta'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 132, name: 'Ada Wong', image: 'img/ada.png', expertPerks: ['sistema_de_espionaje', 'curacion_reactiva', 'perfil_bajo'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 133, name: 'Rebecca Chambers', image: 'img/rebecca.png', expertPerks: ['mejor_que_nuevo', 'consuelo', 'hiperconcentracion'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 134, name: 'Vittorio Toscano', image: 'img/vittorio.png', expertPerks: ['energia_potencial', 'conocimiento_de_la_niebla', 'tactica_rapida'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 135, name: 'Thalita Lyra', image: 'img/thalita.png', expertPerks: ['competencia_amistosa', 'el_poder_de_dos', 'sueltate'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 136, name: 'Renato Lyra', image: 'img/renato.png', expertPerks: ['impulso_sangriento', 'sigilo_colectivo', 'personaje_secundario'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 137, name: 'Gabriel Soma', image: 'img/gabriel.png', expertPerks: ['solucionador_de_problemas', 'nacido_para_esto', 'chatarrero'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 138, name: 'Nicolas Cage', image: 'img/nicolas.png', expertPerks: ['giro_argumental', 'dramaturgia', 'companero_de_escena'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 139, name: 'Ellen Ripley', image: 'img/ellen.png', expertPerks: ['trampa_quimica', 'agil', 'estrella_de_la_suerte'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 140, name: 'Alan Wake', image: 'img/alan.png', expertPerks: ['campeon_de_la_luz', 'iluminacion', 'fecha_limite'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 141, name: 'Sable Ward', image: 'img/sable.png', expertPerks: ['fortaleza_en_las_sombras', 'aranas_tejedoras', 'malicia'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 142, name: 'Aestri Yazar', image: 'img/aestri.png', expertPerks: ['inspiracion_bardica', 'ilusion_reflejada', 'mirada_fija'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 143, name: 'Lara Croft', image: 'img/lara.png', expertPerks: ['elegancia', 'endurecida', 'especialista'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 144, name: 'Trevor Belmont', image: 'img/trevor.png', expertPerks: ['ojos_de_belmont', 'exultacion', 'momento_de_gloria'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 145, name: 'Taurie Cain', image: 'img/taurie.png', expertPerks: ['cuervos_traicioneros', 'punto_y_aparte', 'cargar_a_cuestas'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 146, name: 'Orela Rose', image: 'img/orela.png', expertPerks: ['no_hagas_dano', 'el_deber_de_cuidar', 'respuesta_rapida'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 147, name: 'Rick Grimes', image: 'img/rick.png', expertPerks: ['ingenio_apocaliptico', 'ven_por_mi', 'entereza'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 148, name: 'Michonne Grimes', image: 'img/michonne.png', expertPerks: ['conviccion', 'ultimo_enfrentamiento', 'lanzamiento'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 149, name: 'Vee Boonyasak', image: 'img/vee.png', expertPerks: ['vida_itinerante', 'uno_dos_tres_cuatro', 'notas_fantasma'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 150, name: 'Dustin Henderson', image: 'img/dustin.png', expertPerks: ['bada_bada_bum', 'cambio_de_planes', 'circuito_completo'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 151, name: 'Eleven', image: 'img/eleven.png', expertPerks: ['percepcion_extrasensorial', 'te_vemos', 'tono_gentil'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 152, name: 'Kwon Tae-Young', image: 'img/kwon.png', expertPerks: ['estado_de_flujo', 'un_lugar_para_nosotros', 'cinco_movimientos_adelante'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
  { id: 153, name: 'Shane Wiigwaas', image: 'img/shane.webp', expertPerks: ['maxima_velocidad', 'interrogatorio', 'echar_una_mano'], metaBuild: ['agilidad', 'elegancia', 'fuerza_interior', 'adrenalina'] },
];

// Vote/draw target representing "leave this slot empty" - not a real perk
// slug, so it's kept separate from getAllPerks() but votable the same way.
export const EMPTY_PERK_KEY = 'vacio';
export const EMPTY_PERK_LABEL = 'Slot vacío';

export function getAllPerks(type: CharacterType): string[] {
  const expertPerks = type === 'killer' 
    ? killers.flatMap(k => k.expertPerks)
    : survivors.flatMap(s => s.expertPerks);
  
  const genericPerks = type === 'killer' ? KILLER_GENERIC_PERKS : SURVIVOR_GENERIC_PERKS;
  
  const allPerks = [...new Set([...expertPerks, ...genericPerks])];
  return allPerks;
}

export function getRandomPerks(type: CharacterType, count: number = 4): (string | null)[] {
  const pool = [...getAllPerks(type)];
  const result: (string | null)[] = [];

  for (let i = 0; i < count; i++) {
    const options = [...pool, null];
    const pick = options[Math.floor(Math.random() * options.length)];
    result.push(pick);
    if (pick !== null) {
      const idx = pool.indexOf(pick);
      if (idx > -1) pool.splice(idx, 1);
    }
  }
  return result;
}

/**
 * Draws a single perk, excluding ones already revealed in earlier slots.
 * Perks the chat voted for get a higher chance of being picked (see
 * src/lib/data/chatVotes.ts for the weight formula). Called once per slot
 * reveal (not once per character) so the draw reflects live vote counts at
 * the moment each slot is actually opened. The empty-slot option keeps the
 * base weight always.
 */
export function getWeightedRandomPerk(
  type: CharacterType,
  excludeSlugs: string[],
  votesByPerk: Map<string, number>,
  weightFn: (votes: number) => number
): string | null {
  const excludeSet = new Set(excludeSlugs);
  const pool = getAllPerks(type).filter((p) => !excludeSet.has(p));
  const options: (string | null)[] = [...pool, null];
  const weights = options.map((o) =>
    weightFn(votesByPerk.get(o === null ? EMPTY_PERK_KEY : o) ?? 0)
  );
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let j = 0; j < weights.length; j++) {
    roll -= weights[j];
    if (roll <= 0) return options[j];
  }
  return options[options.length - 1];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getInitialDivisions(type: CharacterType): { character: Omit<CharacterData, 'type' | 'division'>; division: Division }[] {
  const characters = type === 'killer' ? killers : survivors;
  const limits = DIVISION_LIMITS[type];
  
  const result: { character: Omit<CharacterData, 'type' | 'division'>; division: Division }[] = [];
  const shuffled = shuffleArray(characters);
  
  let index = 0;
  for (const division of DIVISION_ORDER) {
    const count = limits[division];
    for (let i = 0; i < count && index < shuffled.length; i++) {
      result.push({ character: shuffled[index], division });
      index++;
    }
  }
  
  return result;
}