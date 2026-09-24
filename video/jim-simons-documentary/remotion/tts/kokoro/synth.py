"""Kokoro-82M synthesis worker for tts/providers/kokoro.ts.

Reads a JSON job on stdin: {text, voice, speed, lang, model, voices, out}
Writes a 24 kHz mono 16-bit WAV: silence-trimmed, loudness-normalised, soft-faded.
"""
import json
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

TARGET_RMS_DBFS = -19.0   # consistent narration level across scenes
PEAK_CEILING = 0.89       # ≈ -1 dBFS
SILENCE_DBFS = -45.0
PAD_S = 0.06
FADE_S = 0.01


def trim(x: np.ndarray, sr: int) -> np.ndarray:
    win = int(sr * 0.02)
    if len(x) < win * 2:
        return x
    frames = len(x) // win
    rms = np.sqrt(np.mean(x[: frames * win].reshape(frames, win) ** 2, axis=1) + 1e-12)
    loud = np.where(20 * np.log10(rms) > SILENCE_DBFS)[0]
    if len(loud) == 0:
        return x
    pad = int(sr * PAD_S)
    start = max(0, loud[0] * win - pad)
    end = min(len(x), (loud[-1] + 1) * win + pad)
    return x[start:end]


def normalise(x: np.ndarray) -> np.ndarray:
    rms = np.sqrt(np.mean(x ** 2) + 1e-12)
    x = x * (10 ** (TARGET_RMS_DBFS / 20) / rms)
    peak = np.max(np.abs(x))
    if peak > PEAK_CEILING:  # simple soft limiter on the few peaks above the ceiling
        x = np.tanh(x / PEAK_CEILING) * PEAK_CEILING
    return x


def fade(x: np.ndarray, sr: int) -> np.ndarray:
    n = min(int(sr * FADE_S), len(x) // 2)
    if n > 0:
        ramp = np.linspace(0.0, 1.0, n)
        x[:n] *= ramp
        x[-n:] *= ramp[::-1]
    return x


def main() -> None:
    job = json.loads(sys.stdin.read())
    kokoro = Kokoro(job["model"], job["voices"])
    samples, sr = kokoro.create(job["text"], voice=job["voice"], speed=float(job["speed"]), lang=job["lang"])
    x = np.asarray(samples, dtype=np.float64)
    x = fade(normalise(trim(x, sr)), sr)
    sf.write(job["out"], x.astype(np.float32), sr, subtype="PCM_16")


if __name__ == "__main__":
    main()
