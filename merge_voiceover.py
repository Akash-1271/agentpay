import os
import sys
import glob
import json
import subprocess

FFMPEG = r"C:\Users\Akash\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-essentials_build\bin\ffmpeg.exe"
FFPROBE = r"C:\Users\Akash\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-essentials_build\bin\ffprobe.exe"

def get_duration(file_path):
    cmd = [
        FFPROBE,
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "json",
        file_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        try:
            data = json.loads(res.stdout)
            return float(data.get("format", {}).get("duration", 0))
        except Exception:
            return 0
    return 0

def main():
    workspace = r"c:\razorpay"
    output_path = os.path.join(workspace, "AgentPay-Pitch-Final.mp4")

    # Available video cuts
    video_cuts = [
        os.path.join(workspace, "agentpay-pitch-demo-5min.mp4"),
        os.path.join(workspace, "agentpay-pitch-demo-3min.mp4"),
        os.path.join(workspace, "agentpay-pitch-demo.mp4")
    ]
    existing_videos = [v for v in video_cuts if os.path.exists(v)]

    if not existing_videos:
        print(f"[Error] No demo videos found in {workspace}!")
        return 1

    # Look for candidate audio files
    audio_extensions = [".mp3", ".m4a", ".wav", ".aac", ".ogg", ".flac"]
    audio_candidates = []
    for ext in audio_extensions:
        audio_candidates.extend(glob.glob(os.path.join(workspace, f"*{ext}")))

    # Filter out output files
    audio_candidates = [f for f in audio_candidates if not f.endswith("final.mp3")]

    target_audio = None
    # Check if voiceover.* or audio.* exists
    for f in audio_candidates:
        base = os.path.basename(f).lower()
        if "voice" in base or "audio" in base or "pitch" in base or "speech" in base or "narrat" in base:
            target_audio = f
            break
    
    if not target_audio and audio_candidates:
        target_audio = audio_candidates[0]

    if not target_audio:
        print("==================================================================")
        print("                 AgentPay Voiceover Audio Merger                  ")
        print("==================================================================")
        print("\nReady to combine screen demo with your voiceover!")
        print("\nStep 1: Record your voiceover (read docs/pitch-video-script.md).")
        print("Step 2: Save the audio file in this directory as:")
        print("        c:\\razorpay\\voiceover.mp3   (or .m4a / .wav)")
        print("\nStep 3: Run this script again (or double-click merge_voiceover.bat).")
        print("\nIt will automatically merge your voice with the 1080p demo into:")
        print("        c:\\razorpay\\AgentPay-Pitch-Final.mp4\n")
        print("==================================================================")
        return 0

    a_dur = get_duration(target_audio)
    if a_dur <= 0:
        print(f"[Error] Could not determine audio duration for: {target_audio}")
        return 1

    # Pick the best matching video cut
    best_video = existing_videos[0]
    best_diff = 999999
    for v in existing_videos:
        vd = get_duration(v)
        diff = abs(vd - a_dur)
        if diff < best_diff:
            best_diff = diff
            best_video = v

    v_dur = get_duration(best_video)

    print("==================================================================")
    print("                 AgentPay Voiceover Audio Merger                  ")
    print("==================================================================")
    print(f"Selected Video: {os.path.basename(best_video)} ({v_dur:.1f}s)")
    print(f"Detected Audio: {os.path.basename(target_audio)} ({a_dur:.1f}s)")
    print("------------------------------------------------------------------")

    # If audio is slightly longer, hold last frame; if shorter, trim cleanly
    if abs(v_dur - a_dur) < 2:
        cmd = [
            FFMPEG, "-y",
            "-i", best_video,
            "-i", target_audio,
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            "-movflags", "+faststart",
            output_path
        ]
    elif a_dur > v_dur:
        diff = a_dur - v_dur
        print(f"Audio is {diff:.1f}s longer than video. Seamlessly extending final screen to match audio...")
        cmd = [
            FFMPEG, "-y",
            "-i", best_video,
            "-i", target_audio,
            "-filter_complex", f"[0:v]tpad=stop_mode=clone:stop_duration={diff+1}[v]",
            "-map", "[v]",
            "-map", "1:a",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            "-movflags", "+faststart",
            output_path
        ]
    else:
        print("Audio is shorter than video. Trimming video cleanly to match voiceover...")
        cmd = [
            FFMPEG, "-y",
            "-i", best_video,
            "-i", target_audio,
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            "-movflags", "+faststart",
            output_path
        ]

    print("Rendering final composite video...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode == 0:
        out_size = os.path.getsize(output_path) / (1024 * 1024)
        print("\n==================================================================")
        print(f"[SUCCESS] Final Video Ready:")
        print(f"  --> {output_path} ({out_size:.2f} MB)")
        print("==================================================================")
        print("You can play it now, or upload directly to YouTube / Google Drive / Devpost!")
    else:
        print("[Error during FFmpeg merge]:")
        print(res.stderr[-1000:])
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())
