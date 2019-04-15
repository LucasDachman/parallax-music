const Tone = require('tone');
const { getScrollRatio } = require('./util');

Tone.Transport.BPM = 88;
//a 4 voice Synth
const synth = new Tone.PolySynth(4, Tone.Synth);
synth.set({
    detune: 20,
    envelope: {
        decay: 20,
        sustain: 5
    }
});

const filter = new Tone.Filter({
    frequency: 1000,
    type: 'lowpass',
    Q: 5
});

const phaser = new Tone.Phaser(0.2, 2);
phaser.set({
    wet: 0.5
});

synth.chain(
    new Tone.Volume(-36),
    new Tone.Vibrato(),
    phaser,
    filter,
    new Tone.JCReverb(),
    new Tone.Volume(-6),
    Tone.Master
);

// start audio
Tone.context.resume();
synth.triggerAttack(["C4", "E4", "G4", "B4"]);

document.addEventListener('scroll', () => {
    const scrollR = getScrollRatio();
    filter.frequency.value = Math.pow(scrollR, 3) * (5000 - 100) + 100

    if (scrollR > 0.9 || scrollR < 0.1) {
        Tone.context.resume().then(() => {
            console.log("trigger attack");
            synth.triggerAttack(["C4", "E4", "G4", "B4"]);
        });
    }
});
