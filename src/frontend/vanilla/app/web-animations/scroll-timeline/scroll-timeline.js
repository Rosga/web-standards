const progress = document.querySelector('.progress');

progress.animate([
    {
        background: 'red',
        opacity: 0.5,
        transform: 'scaleX(0)'
    },
    {
        background: 'green',
        opacity: 1,
        transform: 'scaleX(1)' 
    }
], {
    timeline: new ScrollTimeline({
        source: document.documentElement
    })
});