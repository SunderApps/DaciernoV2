// Constants
let num_bars = 32;
let num_freq = 1028;

// The only video player
var player;

window.addEventListener('load', function (e) {

    // Load the beginning audio
    var audio = new Audio('../mp3/cato_singes/Sore is the Storm.mp3');

    // Add the visualizer bars
    var vis_div = $('#visualizer');
    vis_div.html('');
    for (var i = 0; i < num_bars; i++) {
        vis_div.append('<div></div>');
    }

    // Initialize Visualizer
    var context = new AudioContext();
    var source = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    source.connect(analyser);
    source.connect(context.destination);
    var frequency = new Uint8Array(analyser.frequencyBinCount);

    // Visualizer Logic
    function render_frame(timestamp) {
        requestAnimationFrame(render_frame);
        analyser.getByteFrequencyData(frequency);
        $('div.bar').each(function (index) {
            $(this).css({
                'height': frequency[index * num_freq / num_bars],
            });
        });
    }

    // Activate Visualizer
    render_frame();
});
