/**
 *  TRIGONOMETRY NOTES:
 *
 *  Given:
 *                  frequency - value given through Audio API
 *                  angle     - angle of the line being drawn relative to the x-axis
 *                  radius    - radius of the inner circle
 *
 *  Triangles:
 *                  inner_adj - adjacent side of the angle of the inner circle
 *                  inner_opp - opposite side of the angle of the inner circle
 *                  outer_adj - adjacent side of the angle of the outer circle
 *                  outer_opp - opposite side of the angle of the outer circle
 *
 *  Line Points:
 *                  inner_x   - x-value of the starting point of the line
 *                  inner_y   - y-value of the starting point of the line
 *                  outer_x   - x-value of the ending point of the line
 *                  outer_y   - y-value of the ending point of the line
 *
 *  Calculations:
 *                  inner_adj = radius * cos(angle)
 *                  inner_opp = radius * sin(angle)
 *                  outer_adj = frequency * cos(angle)
 *                  outer_opp = frequency * sin(angle)
 *
 *                  inner_x   = inner_adj
 *                  inner_y   = inner_opp
 *                  outer_x   = inner_adj + outer_adj
 *                  outer_y   = inner_opp + outer_opp
 */

// Visualizers
var visualizers = {
    // Circle of black lines behind Travis' head
    halo: {
        width: 500,                     // Width of canvas
        height: 500,                    // Height of canvas
        num_bars: 1028,                 // Number of visualizer bars
        radius: 30,                     // Radius of the inner circle
        base: 0,                        // Constant added to line length
        strength: 1,                    // Multiplier for line length,
        canvas: {},                     // The canvas to draw on
        context: {},                    // The context to do the drawing
        init: halo_init,                // Initializes the visualizer
        draw_frame: halo_draw_frame     // Draws a frame of this visualizer
    },
    lines: {
        num_lines: 9,
        width: 1000,
        height: 200,
        init: function () { }
    }
};

// Audio API Variables
var audio, context, source, analyser, frequency;

window.addEventListener('load', function (e) {

    // Load the beginning audio
    audio = new Audio('../mp3/cato_singles/Shout All Night.mp3');
    $('body').on('click', function () { audio.paused ? audio.play() : audio.pause() });

    // Initialize the visualizer
    init_visualizer();

    // Run visualizer on play
    audio.onplay = render_frame;
});

// Initialize Visualizer
function init_visualizer() {

    // Initialize Audio Analysis
    context = new AudioContext();
    source = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();
    source.connect(analyser);
    source.connect(context.destination);
    frequency = new Uint8Array(analyser.frequencyBinCount);

    // Initialize Visualizer Objects
    visualizers.halo.init();
}

// Visualizer Step Function
function render_frame() {

    // If the audio is paused, pause the animation
    if (audio.paused) { console.log('pause'); return; }

    // Get the next frame
    requestAnimationFrame(render_frame);
    analyser.getByteFrequencyData(frequency);

    // Run the visualizers
    visualizers.halo.draw_frame();
}


// Initialize the halo visualizer
function halo_init() {
    this.canvas = document.getElementById('visualizer');
    this.context = this.canvas.getContext('2d');
}

// Draw the halo visualizer
function halo_draw_frame() {

    // Clear the visualizer
    this.context.clearRect(0, 0, this.width, this.height);

    // For each bar
    for (var i = 0; i < this.num_bars; i++) {

        // Calculate the length of the bar
        // length = average of the percentile this group represents
        var length = 0;
        for (var j = Math.floor(i * (frequency.length / this.num_bars)); j < Math.floor((i + 1) * (frequency.length / this.num_bars)); j++) {
            length += frequency[j];
        }
        length /= (frequency.length / this.num_bars);
        length *= this.strength;
        length += this.base;
        console.log(length);

        // Calculate the points of the line SohCahToa!
        var vector = {
            'x1': this.radius * Math.cos((360 / this.num_bars) * i),
            'y1': this.radius * Math.sin((360 / this.num_bars) * i),
            'x2': (this.radius + length) * Math.cos((360 / this.num_bars) * i),
            'y2': (this.radius + length) * Math.sin((360 / this.num_bars) * i)
        };

        // Draw the line
        this.context.beginPath();
        this.context.moveTo(vector.x1 + this.width / 2, vector.y1 + this.height / 2);
        this.context.lineTo(vector.x2 + this.width / 2, vector.y2 + this.height / 2);
        this.context.stroke();

    } // END: For each bar
} // END: halo_draw_frame()