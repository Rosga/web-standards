const structure = await (await fetch('./.structure.json')).json();
console.log('structure: ', structure);

const grid = document.querySelector('#features-grid');

structure.forEach(featureName => {
    grid.appendChild(createFeatureContainer(featureName));
})

function createFeatureContainer(name) {
    const container = document.createElement('div');
    container.classList.add('ws-feature-container');

    const nameEl = document.createElement('div');
    nameEl.textContent = name;

    container.appendChild(nameEl);
}
