const ramos = document.querySelectorAll('.ramo');

// Cargar progreso guardado
const aprobados = JSON.parse(localStorage.getItem('aprobados')) || [];

aprobados.forEach(id => {
  const ramo = document.querySelector(`[data-id="${id}"]`);
  if (ramo) ramo.classList.add('aprobado');
});

actualizarBloqueos();

ramos.forEach(ramo => {
  ramo.addEventListener('click', () => {
    if (ramo.classList.contains('bloqueado')) return;

    const id = ramo.dataset.id;

    ramo.classList.toggle('aprobado');

    if (ramo.classList.contains('aprobado')) {
      aprobados.push(id);
    } else {
      const index = aprobados.indexOf(id);
      if (index > -1) aprobados.splice(index, 1);
    }

    localStorage.setItem('aprobados', JSON.stringify(aprobados));
    actualizarBloqueos();
  });
});

function actualizarBloqueos() {

  // 1️⃣ Lógica normal de prerrequisitos
  ramos.forEach(ramo => {
    const prereq = ramo.dataset.prereq;
    if (!prereq) return;

    const prereqs = prereq.split(',');
    const habilitado = prereqs.every(p => aprobados.includes(p));

    if (!habilitado) {
      ramo.classList.add('bloqueado');
      ramo.classList.remove('aprobado');
    } else {
      ramo.classList.remove('bloqueado');
    }
  });

  // 2️⃣ Ver si el semestre 1 está COMPLETO
  const ramosSem1 = [...ramos].filter(
    r => r.dataset.semestre === "1"
  );

  const semestre1Completo = ramosSem1.every(
    r => aprobados.includes(r.dataset.id)
  );

  // 3️⃣ Desbloquear ramos del semestre 2 sin prereq
  if (semestre1Completo) {
    ramos.forEach(ramo => {
      if (
        ramo.dataset.semestre === "2" &&
        !ramo.dataset.prereq
      ) {
        ramo.classList.remove('bloqueado');
      }
    });
  }
}
