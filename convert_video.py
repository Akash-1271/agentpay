import os
import sys
import time
import subprocess
from PIL import Image, ImageSequence

def main():
    ffmpeg_exe = r"C:\Users\Akash\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-essentials_build\bin\ffmpeg.exe"
    webp_path = r"C:\Users\Akash\.gemini\antigravity-ide\brain\71b9a499-edbf-462b-b20a-2564f738958e\agentpay_pitch_demo_1788582192096.webp"
    import argparse
    parser = argparse.ArgumentParser(description="Convert WebP recording to MP4")
    parser.add_argument("--fps", type=float, default=8.0, help="Framerate for the output video (default: 8.0)")
    parser.add_argument("--output", type=str, default=r"c:\razorpay\agentpay-pitch-demo.mp4", help="Output MP4 path")
    args = parser.parse_args()

    output_mp4 = args.output
    fps = args.fps

    if not os.path.exists(ffmpeg_exe):
        print(f"Error: ffmpeg not found at {ffmpeg_exe}")
        sys.exit(1)

    print(f"Opening {webp_path}...")
    t0 = time.time()
    im = Image.open(webp_path)
    w, h = im.size
    total_frames = getattr(im, "n_frames", 1)
    print(f"Resolution: {w}x{h}, Total frames: {total_frames}")

    print(f"Encoding MP4 at {fps} fps (duration ~{total_frames / fps:.1f}s)...")

    cmd = [
        ffmpeg_exe,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{w}x{h}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        output_mp4
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    count = 0
    for frame in ImageSequence.Iterator(im):
        rgb_frame = frame.convert("RGB")
        proc.stdin.write(rgb_frame.tobytes())
        count += 1
        if count % 100 == 0 or count == total_frames:
            print(f"Processed {count}/{total_frames} frames ({count*100//total_frames}%)...")

    proc.stdin.close()
    out, err = proc.communicate()

    elapsed = time.time() - t0
    if proc.returncode == 0:
        file_size = os.path.getsize(output_mp4) / (1024 * 1024)
        print(f"SUCCESS: Created {output_mp4} ({file_size:.2f} MB) in {elapsed:.1f}s!")
    else:
        print(f"FFmpeg error (code {proc.returncode}):")
        print(err.decode("utf-8", errors="ignore")[-1000:])
        sys.exit(proc.returncode)

if __name__ == "__main__":
    main()
