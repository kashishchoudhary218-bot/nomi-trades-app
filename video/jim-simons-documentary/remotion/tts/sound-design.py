"""Procedural sound design: 7 ambient music beds + 12 subtle SFX, synthesised from scratch
(numpy only — original, royalty-free). Written as WAV; scripts/sound-design.mjs encodes to MP3.

Usage: python3 tts/sound-design.py <out_dir>

These are deliberately understated beds that sit under the narration. For a premium mix,
replace any file in public/audio/music or public/audio/sfx with a licensed track of the same name.
"""
import os
import sys

import numpy as np
import soundfile as sf

SR = 48000
RNG = np.random.default_rng(1982)


# ───────────────────────── building blocks ─────────────────────────
def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff):
    """One-pole low-pass; cutoff may be a scalar or per-sample array (Hz)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):  # fine for SFX lengths; pads use lowpass_fast
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def lowpass_fast(x, cutoff):
    a = np.exp(-2 * np.pi * cutoff / SR)
    from scipy.signal import lfilter  # noqa: WPS433 (optional fast path)

    return lfilter([1 - a], [1, -a], x)


def lp(x, cutoff):
    try:
        if np.isscalar(cutoff):
            return lowpass_fast(x, cutoff)
    except ImportError:
        pass
    return lowpass(x, cutoff)


def highpass(x, cutoff):
    return x - lp(x, cutoff)


def env_adsr(n, a, d, s, r):
    a, d, r = int(a * SR), int(d * SR), int(r * SR)
    sus = max(0, n - a - d - r)
    return np.concatenate([np.linspace(0, 1, a), np.linspace(1, s, d), np.full(sus, s), np.linspace(s, 0, r)])[:n]


def exp_decay(n, tau):
    return np.exp(-np.arange(n) / (SR * tau))


def pad_voice(freq, sec, detune=0.004, bright=0.35):
    t = t_axis(sec)
    x = np.zeros_like(t)
    for d in (-detune, 0.0, detune):
        f = freq * (1 + d)
        x += np.sin(2 * np.pi * f * t) + bright * np.sin(2 * np.pi * 2 * f * t) / 2 + bright * 0.5 * np.sin(2 * np.pi * 3 * f * t) / 3
    return x / 3


def pluck(freq, sec=1.2, tau=0.35, harm=(1, 0.5, 0.25, 0.12)):
    t = t_axis(sec)
    x = sum(a * np.sin(2 * np.pi * freq * (k + 1) * t) for k, a in enumerate(harm))
    return x * exp_decay(len(t), tau) * env_adsr(len(t), 0.004, 0.0, 1.0, 0.05)


def place(buf, clip, at_sec, gain=1.0):
    i = int(at_sec * SR)
    j = min(len(buf), i + len(clip))
    if i < len(buf):
        buf[i:j] += clip[: j - i] * gain


def loopify(x, xfade=2.0):
    """Crossfade the tail into the head so the bed loops seamlessly."""
    n = int(xfade * SR)
    head, tail = x[:n].copy(), x[-n:]
    ramp = np.linspace(0, 1, n)
    x = x[:-n].copy()
    x[:n] = head * ramp + tail * (1 - ramp)
    return x


def norm_rms(x, dbfs):
    rms = np.sqrt(np.mean(x ** 2) + 1e-12)
    x = x * (10 ** (dbfs / 20) / rms)
    peak = np.max(np.abs(x))
    return np.tanh(x / 0.9) * 0.9 if peak > 0.9 else x


def norm_peak(x, dbfs):
    return x * (10 ** (dbfs / 20) / (np.max(np.abs(x)) + 1e-12))


def noise(sec):
    return RNG.standard_normal(int(SR * sec))


def slow_lfo(sec, rate, depth, base=1.0):
    return base + depth * np.sin(2 * np.pi * rate * t_axis(sec))


# ───────────────────────── music beds (~64 s loops) ─────────────────────────
def chord_pad(notes, sec, cutoff=1400, lfo_rate=0.05):
    x = sum(pad_voice(midi(n), sec) for n in notes) / len(notes)
    x = lp(x, cutoff)
    return x * slow_lfo(sec, lfo_rate, 0.25) * env_adsr(len(x), 3.0, 0.0, 1.0, 3.0)


def bed_pattern():  # M1 — mysterious, precise, ~80 BPM clock pulse
    sec, bpm = 66, 80
    x = chord_pad([45, 52, 57, 60, 64], sec, cutoff=900) * 0.9  # A minor add9, low
    x += 0.35 * np.sin(2 * np.pi * midi(33) * t_axis(sec)) * slow_lfo(sec, 0.03, 0.3)  # sub drone
    tick = highpass(noise(0.012), 3000) * exp_decay(int(0.012 * SR), 0.002)
    for k in range(int(sec * bpm / 60)):
        place(x, tick, k * 60 / bpm, 0.05)
    for k, n in enumerate([69, 72, 76, 74]):  # sparse felt-piano notes
        place(x, pluck(midi(n), 3.0, 1.1), 4 + k * 15, 0.10)
    return loopify(x)


def bed_laboratory():  # M2 — curious, forward, ~95 BPM arpeggio
    sec, bpm = 66, 95
    x = chord_pad([50, 57, 62, 65, 69], sec, cutoff=1600) * 0.7  # D minor
    step = 60 / bpm / 2
    arp = [62, 65, 69, 72, 69, 65]
    for k in range(int(sec / step)):
        place(x, pluck(midi(arp[k % len(arp)]), 0.5, 0.12, (1, 0.3, 0.1)), k * step, 0.09)
    return loopify(x)


def bed_ground_truth():  # M3 — low drone, sober
    sec = 66
    t = t_axis(sec)
    x = np.sin(2 * np.pi * midi(26) * t) + 0.6 * np.sin(2 * np.pi * midi(33) * t) + 0.25 * np.sin(2 * np.pi * midi(38) * t)
    x *= slow_lfo(sec, 0.04, 0.35)
    x += 0.15 * lp(noise(sec), 300)
    return loopify(x)


def bed_method():  # M4 — confident, bright, ~100 BPM
    sec, bpm = 66, 100
    x = chord_pad([48, 55, 60, 64, 67, 74], sec, cutoff=2200) * 0.7  # C major add9
    beat = 60 / bpm
    for k in range(int(sec / beat)):
        place(x, pluck(midi([60, 64, 67, 64][k % 4]), 0.8, 0.18), k * beat, 0.08)
        if k % 2 == 0:
            place(x, np.sin(2 * np.pi * 55 * t_axis(0.25)) * exp_decay(int(0.25 * SR), 0.06), k * beat, 0.12)
    return loopify(x)


def bed_pressure():  # M5 — tense, heartbeat ~70 BPM
    sec, bpm = 66, 70
    x = chord_pad([45, 46, 52, 53], sec, cutoff=700) * 0.6  # minor-second cluster, dark
    beat = 60 / bpm
    thump = np.sin(2 * np.pi * 50 * t_axis(0.3)) * exp_decay(int(0.3 * SR), 0.07)
    for k in range(int(sec / beat)):
        place(x, thump, k * beat, 0.35)
        place(x, thump, k * beat + 0.22, 0.2)
    return loopify(x)


def bed_noise():  # M6 — granular, uneasy, pulsing bass
    sec, bpm = 66, 90
    x = lp(noise(sec), 1200) * 0.18 * slow_lfo(sec, 0.11, 0.5)
    x += chord_pad([40, 47, 50, 53], sec, cutoff=800) * 0.5
    step = 60 / bpm / 2
    bass = np.sin(2 * np.pi * midi(28) * t_axis(0.22)) * exp_decay(int(0.22 * SR), 0.08)
    for k in range(int(sec / step)):
        place(x, bass, k * step, 0.22 if k % 2 == 0 else 0.12)
    return loopify(x)


def bed_discipline():  # M7 — piano + strings, resolving
    sec = 66
    prog = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [48, 55, 60, 64]]  # Am F G C
    x = np.zeros(int(SR * sec))
    seg = sec / 4
    for k, ch in enumerate(prog):
        pad = chord_pad(ch, seg, cutoff=1500) * 0.6
        place(x, pad, k * seg)
        for j, n in enumerate(ch + [ch[-1] + 12]):
            place(x, pluck(midi(n + 12), 4.0, 1.4), k * seg + 0.35 * j, 0.09)
    return loopify(x)


MUSIC = {
    'm1-pattern': bed_pattern,
    'm2-laboratory': bed_laboratory,
    'm3-ground-truth': bed_ground_truth,
    'm4-method': bed_method,
    'm5-pressure': bed_pressure,
    'm6-noise': bed_noise,
    'm7-discipline': bed_discipline,
}


# ───────────────────────── sound effects ─────────────────────────
def sfx_sub_boom():
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    f = 48 * np.exp(-t * 0.6)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * exp_decay(n, 0.45)
    x[: int(0.02 * SR)] += lp(noise(0.02), 400) * 0.5
    return x


def sfx_counter_ticks():
    x = np.zeros(int(1.6 * SR))
    tick = highpass(noise(0.006), 2500) * exp_decay(int(0.006 * SR), 0.0015)
    t, gap = 0.0, 0.03
    while t < 1.45:
        place(x, tick, t, 0.8)
        t += gap
        gap *= 1.07
    return x


def sfx_whoosh():
    sec = 0.9
    n = int(sec * SR)
    cutoff = 300 + 2600 * np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return lowpass(noise(sec), cutoff) * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5


def sfx_data_blip():
    t = t_axis(0.09)
    return (np.sin(2 * np.pi * 1760 * t) + 0.4 * np.sin(2 * np.pi * 2640 * t)) * exp_decay(len(t), 0.025)


def sfx_typing():
    x = np.zeros(int(1.3 * SR))
    key = lp(highpass(noise(0.018), 1500), 5000) * exp_decay(int(0.018 * SR), 0.004)
    t = 0.0
    while t < 1.2:
        place(x, key, t, RNG.uniform(0.5, 1.0))
        t += RNG.uniform(0.07, 0.16)
    return x


def sfx_pen_scratch():
    sec = 1.0
    n = int(sec * SR)
    am = np.abs(np.sin(2 * np.pi * 7 * np.linspace(0, sec, n))) ** 0.5
    return highpass(noise(sec), 3000) * am * env_adsr(n, 0.05, 0.1, 0.8, 0.2)


def sfx_static():
    sec = 0.8
    x = highpass(noise(sec), 1500) * 0.4
    crackle = (RNG.random(int(sec * SR)) > 0.9985).astype(float) * RNG.uniform(-1, 1, int(sec * SR))
    return (x + crackle) * env_adsr(len(x), 0.02, 0.1, 0.7, 0.3)


def sfx_glass_tick():
    t = t_axis(0.45)
    return (np.sin(2 * np.pi * 2349 * t) + 0.5 * np.sin(2 * np.pi * 3520 * t) + 0.2 * np.sin(2 * np.pi * 5274 * t)) * exp_decay(len(t), 0.09)


def sfx_denied_thud():
    t = t_axis(0.4)
    return np.sin(2 * np.pi * 85 * t) * exp_decay(len(t), 0.08) + lp(noise(0.4), 250) * exp_decay(len(t), 0.03) * 0.6


def sfx_heartbeat():
    x = np.zeros(int(2.4 * SR))
    thump = np.sin(2 * np.pi * 55 * t_axis(0.25)) * exp_decay(int(0.25 * SR), 0.06)
    for beat in (0.0, 1.0):
        place(x, thump, beat, 1.0)
        place(x, thump, beat + 0.24, 0.6)
    return x


def sfx_riser():
    sec = 1.8
    n = int(sec * SR)
    ramp = np.linspace(0, 1, n)
    return lowpass(noise(sec), 400 + 7000 * ramp ** 2) * ramp ** 2.5


def sfx_room_tone():
    sec = 6.0
    return lp(noise(sec), 500) * env_adsr(int(sec * SR), 1.0, 0.0, 1.0, 1.5)


SFX = {
    'sfx-01-sub-boom': (sfx_sub_boom, -5),
    'sfx-02-counter-ticks': (sfx_counter_ticks, -14),
    'sfx-03-whoosh': (sfx_whoosh, -12),
    'sfx-04-data-blip': (sfx_data_blip, -20),
    'sfx-05-typing': (sfx_typing, -18),
    'sfx-06-pen-scratch': (sfx_pen_scratch, -22),
    'sfx-07-static': (sfx_static, -24),
    'sfx-08-glass-tick': (sfx_glass_tick, -18),
    'sfx-09-denied-thud': (sfx_denied_thud, -10),
    'sfx-10-heartbeat': (sfx_heartbeat, -8),
    'sfx-11-riser': (sfx_riser, -14),
    'sfx-12-room-tone': (sfx_room_tone, -30),
}


def main():
    out = sys.argv[1]
    os.makedirs(f'{out}/music', exist_ok=True)
    os.makedirs(f'{out}/sfx', exist_ok=True)
    for name, fn in MUSIC.items():
        x = norm_rms(fn(), -22.0)
        sf.write(f'{out}/music/{name}.wav', x.astype(np.float32), SR, subtype='PCM_16')
        print(f'music  {name}  {len(x) / SR:.1f}s')
    for name, (fn, peak) in SFX.items():
        x = norm_peak(fn(), peak)
        sf.write(f'{out}/sfx/{name}.wav', x.astype(np.float32), SR, subtype='PCM_16')
        print(f'sfx    {name}  {len(x) / SR:.2f}s')


if __name__ == '__main__':
    main()
