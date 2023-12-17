const structure = await (await fetch('./dist/.structure.json')).json();
console.log('structure: ', structure);

const grid = document.querySelector('#features-grid');

structure.forEach(featureName => {
    const feature = createFeatureContainer(featureName);
    grid.appendChild(feature);
})

function createFeatureContainer(name) {
    const container = document.createElement('a');
    container.href = name + '/index.html';
    container.classList.add('ws-feature-container');

    const nameEl = document.createElement('div');
    nameEl.classList.add('ws-feature-name');
    nameEl.textContent = name;

    container.appendChild(nameEl);
    return container;
}
