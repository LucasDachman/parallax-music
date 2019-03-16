const Tone = require('tone');

Tone.Transport.BPM = 88;
//a 4 voice Synth
const synth = new Tone.PolySynth(4, Tone.Synth);
synth.detune.value = 20;
synth.set({
    "envelope": {
        "decay": "2m",
        'sustain': 0.07
    }
});

const filter = new Tone.AutoFilter('4n');
filter.set({
    filter: {
        Q: 5
    },
    octaves: 3,
    baseFrequency: 400
});

const phaser = new Tone.Phaser(0.2, 2);
phaser.set({
    wet: 0.5
});

synth.chain(
    new Tone.Vibrato(),
    phaser,
    filter,
    new Tone.JCReverb(),
    new Tone.Volume(-24),
    Tone.Master
);

//play a chord
document.querySelector('#play').addEventListener('click', () => {
    Tone.context.resume();
    filter.start();
    synth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2m");
});