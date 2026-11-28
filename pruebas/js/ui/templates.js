export const link=(path,text,cls='')=>`<a class="${cls}" href="#/${path}">${text}</a>`;
export const notice='<p class="notice">Demostración: perfiles ilustrativos, publicaciones y actividades de demostración. No representan servicios ni convocatorias reales.</p>';
export const heading=(k,title,desc='')=>`<div class="intro"><p class="eyebrow">${k}</p><h1>${title}</h1>${desc?`<p class="lead">${desc}</p>`:''}</div>`;
export const shell=html=>`<section class="wrap">${html}</section>`;
export const crumb=(path,label)=>`<div class="breadcrumb">${link('inicio','Inicio')} / ${link(path,label)}</div>`;
export function missing(){return shell(heading('Contenido no encontrado','Volvamos a encontrarnos.')+link('inicio','Volver al inicio','button'));}
