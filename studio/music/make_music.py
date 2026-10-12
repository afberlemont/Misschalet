#!/usr/bin/env python3
"""
Royalty-free music for the listing reels, synthesised from scratch (numpy +
scipy): nothing sampled, nothing licensed, so the videos can carry it anywhere.

    python3 music/make_music.py lux 36 music/out/lux-120.wav [--bpm 120] [--seed 3]

Styles (warm and low-mid heavy, like the reference reel's acoustic bed):
  lux      soft Rhodes piano, pad, sub bass, a half-time kick, rim and shaker
  famille  bright mallets in sixteenths, claps on 2 and 4, a light four-on-the-floor
  couples  deep house: off-beat stabs and open hats, Rhodes, rolling bass

Bars start on the beat grid from 0 s, so a cut placed at k × 60/bpm lands on
a beat. A one-bar intro (no drums) and a last bar that thins out; the renderer
fades the end. Writes a 44.1 kHz stereo 16-bit WAV.
"""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
A4 = 440.0
NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def hz(name):
    """'F#3' → Hz"""
    n, octv = name[:-1], int(name[-1])
    return A4 * 2 ** ((NOTE[n] + 12 * (octv + 1) - 69) / 12)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, 'high', fs=SR, output='sos'), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], 'band', fs=SR, output='sos'), x)


class Track:
    def __init__(self, seconds, rng):
        self.n = int(seconds * SR) + SR * 3
        self.bus = {k: np.zeros((self.n, 2)) for k in ('keys', 'pad', 'bass', 'drums', 'fx')}
        self.rng = rng

    def add(self, bus, t, sig, pan=0.0, gain=1.0):
        i = int(t * SR)
        if i >= self.n or len(sig) == 0:
            return
        sig = sig[: self.n - i] * gain
        l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        self.bus[bus][i:i + len(sig), 0] += sig * l * 1.414
        self.bus[bus][i:i + len(sig), 1] += sig * r * 1.414


# ---------------- instruments ----------------
def rhodes(f, dur, vel=0.7):
    t = np.arange(int((dur + 1.6) * SR)) / SR
    env = np.exp(-t * 1.6) * (1 - np.exp(-t * 400))
    rel = np.clip((dur + 1.6 - t) / 1.6, 0, 1)
    s = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 4)
    s += 0.12 * vel * np.sin(2 * np.pi * 7.0 * f * t) * np.exp(-t * 18)  # the tine
    s += 0.08 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 6)
    trem = 1 + 0.06 * np.sin(2 * np.pi * 4.5 * t)
    return s * env * rel * trem * vel * 0.32


def piano(f, dur, vel=0.7):
    t = np.arange(int((dur + 2.0) * SR)) / SR
    s = np.zeros_like(t)
    for h in range(1, 9):
        fh = f * h * np.sqrt(1 + 0.0004 * h * h)
        s += np.sin(2 * np.pi * fh * t) / h ** 1.4 * np.exp(-t * (0.9 + 0.7 * h))
    env = (1 - np.exp(-t * 600)) * np.clip((dur + 2.0 - t) / 2.0, 0, 1)
    return s * env * vel * 0.3


def mallet(f, vel=0.7):
    t = np.arange(int(0.9 * SR)) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 7) + 0.3 * np.sin(2 * np.pi * 4.0 * f * t) * np.exp(-t * 22)
    return s * (1 - np.exp(-t * 900)) * vel * 0.28


def pad(freqs, dur, bright=1400):
    t = np.arange(int((dur + 1.2) * SR)) / SR
    s = np.zeros_like(t)
    for f in freqs:
        for cents in (-7, 0, 7):
            ff = f * 2 ** (cents / 1200)
            ph = np.random.rand() * 2 * np.pi
            s += 2 * ((ff * t + ph / (2 * np.pi)) % 1) - 1
    s = lp(s / (3 * len(freqs)), bright)
    env = np.minimum(1, t / 0.7) * np.clip((dur + 1.2 - t) / 1.2, 0, 1)
    return s * env * 0.22


def bass(f, dur, pluck=False):
    t = np.arange(int((dur + 0.15) * SR)) / SR
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.exp(-t * 3.5) if pluck else np.ones_like(t)
    env *= (1 - np.exp(-t * 300)) * np.clip((dur + 0.15 - t) / 0.15, 0, 1)
    return lp(s, 900) * env * 0.42


def kick(vel=1.0):
    t = np.arange(int(0.45 * SR)) / SR
    f = 46 + 70 * np.exp(-t * 32)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    s += 0.25 * np.random.randn(len(t)) * np.exp(-t * 300)
    return s * vel * 0.85


def hat(open_=False, vel=0.5):
    t = np.arange(int((0.28 if open_ else 0.05) * SR)) / SR
    s = hp(np.random.randn(len(t)), 7500) * np.exp(-t * (11 if open_ else 70))
    return s * vel * 0.16


def clap(vel=0.6):
    t = np.arange(int(0.3 * SR)) / SR
    n = np.random.randn(len(t))
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += (t >= d) * np.exp(-(t - d).clip(0) * (60 if d < 0.02 else 14))
    return bp(n, 900, 3200) * env * vel * 0.3


def rim(vel=0.5):
    t = np.arange(int(0.08 * SR)) / SR
    s = bp(np.random.randn(len(t)), 1500, 4500) * np.exp(-t * 90) + 0.4 * np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 80)
    return s * vel * 0.25


def shaker(vel=0.4):
    t = np.arange(int(0.09 * SR)) / SR
    env = np.minimum(1, t / 0.02) * np.exp(-t * 40)
    return bp(np.random.randn(len(t)), 4000, 11000) * env * vel * 0.12


# ---------------- styles ----------------
STYLES = {
    # chords as note names (low to high), one per bar
    'lux': dict(bpm=120, chords=[['G2', 'B3', 'D4', 'F#4', 'A4'], ['F#2', 'A3', 'C#4', 'E4', 'A4'],
                                 ['E2', 'G3', 'B3', 'D4', 'F#4'], ['A2', 'G3', 'B3', 'D4', 'E4']]),
    'famille': dict(bpm=112, chords=[['C3', 'E4', 'G4', 'C5'], ['G2', 'D4', 'G4', 'B4'],
                                     ['A2', 'C4', 'E4', 'A4'], ['F2', 'C4', 'F4', 'A4']]),
    'couples': dict(bpm=118, chords=[['A2', 'G3', 'C4', 'E4', 'B4'], ['F2', 'E3', 'A3', 'C4', 'G4'],
                                     ['D2', 'F3', 'A3', 'C4', 'E4'], ['E2', 'D4', 'G#3', 'B3', 'E4']]),
}


def compose(style, seconds, bpm=None, seed=3):
    rng = np.random.default_rng(seed)
    np.random.seed(seed)
    cfg = STYLES[style]
    bpm = bpm or cfg['bpm']
    beat = 60 / bpm
    bar = 4 * beat
    bars = int(np.ceil(seconds / bar)) + 1
    tr = Track(bars * bar, rng)
    kicks = []
    for b in range(bars):
        t0 = b * bar
        ch = [hz(n) for n in cfg['chords'][b % len(cfg['chords'])]]
        root, upper = ch[0], ch[1:]
        intro, last = b == 0, b == bars - 1
        if style == 'lux':
            tr.add('pad', t0, pad(upper, bar, 1100), gain=0.9)
            for i, f in enumerate(upper):  # a soft rolled chord on 1, an arpeggio after
                tr.add('keys', t0 + i * 0.03, rhodes(f, beat * 1.5, 0.55), pan=-0.3 + 0.15 * i)
            arp = [upper[i % len(upper)] * (2 if i >= len(upper) else 1) for i in (1, 2, 3, 2, 4, 3)]
            for i, f in enumerate(arp):
                tr.add('keys', t0 + (2 + i * 0.5) * beat, piano(f, beat * 0.5, 0.32 + 0.06 * rng.random()), pan=0.25 - 0.1 * (i % 3))
            if not intro:
                tr.add('bass', t0, bass(root, bar * 0.95), gain=0.9)
                for k in (0, 2.5) if not last else (0,):
                    tr.add('drums', t0 + k * beat, kick(0.8)); kicks.append(t0 + k * beat)
                if not last:
                    tr.add('drums', t0 + 2 * beat, rim(0.45), pan=0.1)
                    for s in range(8):
                        tr.add('drums', t0 + s * beat / 2, shaker(0.35 + 0.25 * (s % 2)), pan=0.35)
        elif style == 'famille':
            tr.add('pad', t0, pad(upper, bar, 1800), gain=0.6)
            pattern = [0, 1, 2, 3, 2, 1, 3, 2, 0, 1, 2, 3, 3, 2, 1, 2]
            for s, p in enumerate(pattern):
                f = upper[p % len(upper)] * (2 if s % 8 >= 4 else 1)
                tr.add('keys', t0 + s * beat / 4, mallet(f, 0.5 + 0.2 * (s % 4 == 0)), pan=-0.4 + 0.8 * (s % 2))
            if not intro:
                for k in range(4):
                    tr.add('bass', t0 + k * beat, bass(root, beat * 0.8, pluck=True), gain=0.9)
                    tr.add('drums', t0 + k * beat, kick(0.6)); kicks.append(t0 + k * beat)
                    tr.add('drums', t0 + (k + 0.5) * beat, hat(False, 0.5), pan=0.3)
                for k in (1, 3):
                    tr.add('drums', t0 + k * beat, clap(0.6), pan=-0.05)
        else:  # couples
            for k in (0.5, 1.5, 2.5, 3.5):  # off-beat stabs
                for i, f in enumerate(upper):
                    tr.add('keys', t0 + k * beat, rhodes(f, beat * 0.35, 0.45), pan=-0.2 + 0.1 * i)
            tr.add('pad', t0, pad(upper, bar, 900), gain=0.7)
            if not intro:
                for k in range(4):
                    tr.add('drums', t0 + k * beat, kick(0.85)); kicks.append(t0 + k * beat)
                    tr.add('drums', t0 + (k + 0.5) * beat, hat(True, 0.45), pan=0.25)
                    tr.add('drums', t0 + (k + 0.75) * beat, hat(False, 0.25), pan=-0.25)
                    tr.add('bass', t0 + (k + 0.5) * beat, bass(root * (2 if k == 3 else 1), beat * 0.42, pluck=True))
                for k in (1, 3):
                    tr.add('drums', t0 + k * beat, clap(0.5))

    # sidechain: pad and bass breathe with the kick
    duck = np.ones(tr.n)
    t = np.arange(int(beat * SR)) / SR
    shape = 1 - 0.55 * np.exp(-t * 9)
    for k in kicks:
        i = int(k * SR)
        j = min(tr.n, i + len(shape))
        duck[i:j] = np.minimum(duck[i:j], shape[: j - i])
    for b in ('pad', 'bass'):
        tr.bus[b] *= duck[:, None]

    mix = tr.bus['keys'] * 1.0 + tr.bus['pad'] * 0.9 + tr.bus['bass'] * 1.0 + tr.bus['drums'] * 0.9
    # a warm room: a 2.6 s decaying stereo noise, dark
    ir_t = np.arange(int(2.6 * SR)) / SR
    ir = np.stack([lp(np.random.randn(len(ir_t)), 5000) * np.exp(-ir_t / 0.55) for _ in range(2)], 1)
    ir /= np.abs(ir).sum(0) ** 0.5 * 30
    send = tr.bus['keys'] + tr.bus['pad'] * 0.8 + tr.bus['drums'] * 0.25
    wet = np.stack([fftconvolve(send[:, c], ir[:, c])[: tr.n] for c in range(2)], 1)
    mix = mix + wet * 0.55
    # warmth: a touch less top, a little low-mid
    mix = np.stack([lp(mix[:, c], 9500, 1) for c in range(2)], 1)
    mix = mix[: int(seconds * SR)]
    mix /= np.max(np.abs(mix)) + 1e-9
    mix = np.tanh(mix * 1.6) / np.tanh(1.6)  # glue
    rms = np.sqrt(np.mean(mix ** 2))
    mix *= min(1.0, 0.2 / rms) * 0.95
    return mix, bpm


def main():
    args = sys.argv[1:]
    if len(args) < 3:
        print(__doc__)
        sys.exit(1)
    style, seconds, out = args[0], float(args[1]), args[2]
    bpm = float(args[args.index('--bpm') + 1]) if '--bpm' in args else None
    seed = int(args[args.index('--seed') + 1]) if '--seed' in args else 3
    mix, bpm = compose(style, seconds, bpm, seed)
    wavfile.write(out, SR, (np.clip(mix, -1, 1) * 32767).astype(np.int16))
    print(f'{out}: {style}, {bpm:g} bpm, {seconds:g} s')


if __name__ == '__main__':
    main()
