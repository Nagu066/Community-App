#!/usr/bin/env python3
import ctypes
import os
import signal
import subprocess
import time

class CGPoint(ctypes.Structure):
    _fields_ = [('x', ctypes.c_double), ('y', ctypes.c_double)]

cg = ctypes.cdll.LoadLibrary('/System/Library/Frameworks/ApplicationServices.framework/ApplicationServices')
cg.CGEventCreateMouseEvent.restype = ctypes.c_void_p
cg.CGEventCreateMouseEvent.argtypes = [ctypes.c_void_p, ctypes.c_uint32, CGPoint, ctypes.c_uint32]
cg.CGEventPost.argtypes = [ctypes.c_uint32, ctypes.c_void_p]
cg.CFRelease.argtypes = [ctypes.c_void_p]

def activate_simulator():
    subprocess.run(['osascript', '-e', 'tell application "DeviceHub" to activate'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(0.3)

def click_at(x, y):
    activate_simulator()
    pt = CGPoint(x, y)
    for event_type in [5, 1, 2]: # move, down, up
        e = cg.CGEventCreateMouseEvent(None, event_type, pt, 0)
        cg.CGEventPost(0, e)
        cg.CFRelease(e)
        time.sleep(0.05)

def smooth_scroll(start_x, start_y, end_y, steps=25, duration=0.6):
    activate_simulator()
    p = CGPoint(start_x, start_y)
    e = cg.CGEventCreateMouseEvent(None, 1, p, 0)
    cg.CGEventPost(0, e)
    cg.CFRelease(e)
    time.sleep(0.05)

    step_delay = duration / steps
    for i in range(1, steps + 1):
        curr_y = start_y + (end_y - start_y) * (i / steps)
        p = CGPoint(start_x, curr_y)
        e = cg.CGEventCreateMouseEvent(None, 6, p, 0) # dragged
        cg.CGEventPost(0, e)
        cg.CFRelease(e)
        time.sleep(step_delay)

    p = CGPoint(start_x, end_y)
    e = cg.CGEventCreateMouseEvent(None, 2, p, 0) # up
    cg.CGEventPost(0, e)
    cg.CFRelease(e)
    time.sleep(0.5)

def open_url(url):
    subprocess.run(['xcrun', 'simctl', 'openurl', 'booted', url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(repo_root, 'assets', 'demo.mp4')
    raw_output_path = '/tmp/raw_demo.mp4'

    print("=== Starting Melyn Community Demo Video Recording ===")
    
    # Ensure home screen
    open_url('exp://192.168.1.4:8081/--/')
    time.sleep(1.5)

    # Start simctl video recording
    rec_proc = subprocess.Popen([
        'xcrun', 'simctl', 'io', 'booted', 'recordVideo',
        '--codec=h264', '--force', raw_output_path
    ])
    
    print("Recording started. Waiting for first frame...")
    time.sleep(2.0)

    # Scene 1: Home Feed Overview
    print("Scene 1: Home feed overview...")
    time.sleep(2.0)

    # Scene 2: Category Filter Tabs
    # Filter chip coordinates in window (wx=1478, wy=30):
    # Emergency: ~1680, 205
    # Events: ~1780, 205
    # All Notices: ~1560, 205
    print("Scene 2: Filter by Emergency...")
    click_at(1680, 205)
    time.sleep(2.0)

    print("Scene 2: Filter by Events...")
    click_at(1780, 205)
    time.sleep(2.0)

    print("Scene 2: Filter back to All Notices...")
    click_at(1550, 205)
    time.sleep(2.0)

    # Scene 3: Smooth Scrolling & Pagination
    print("Scene 3: Scrolling through notices...")
    smooth_scroll(1700, 650, 320, steps=30, duration=0.8)
    time.sleep(1.5)
    smooth_scroll(1700, 650, 320, steps=30, duration=0.8)
    time.sleep(1.8)

    # Scene 4: Edge Case - Long Title Notice (ntc_0004)
    print("Scene 4: Inspecting Long Title Notice (ntc_0004)...")
    open_url('exp://192.168.1.4:8081/--/notice/ntc_0004')
    time.sleep(2.5)

    # Scroll detail slightly
    smooth_scroll(1700, 600, 480, steps=15, duration=0.5)
    time.sleep(1.5)

    # Return to home
    open_url('exp://192.168.1.4:8081/--/')
    time.sleep(1.8)

    # Scene 5: Edge Case - Image Notice & Upcoming Tag (ntc_0020)
    print("Scene 5: Inspecting Notice with Image & Upcoming badge (ntc_0020)...")
    open_url('exp://192.168.1.4:8081/--/notice/ntc_0020')
    time.sleep(2.5)

    # Return home
    open_url('exp://192.168.1.4:8081/--/')
    time.sleep(1.8)

    # Scene 6: Edge Case - Empty Body Fallback (ntc_0008)
    print("Scene 6: Inspecting Empty Body Notice Fallback (ntc_0008)...")
    open_url('exp://192.168.1.4:8081/--/notice/ntc_0008')
    time.sleep(2.5)

    # Return home
    open_url('exp://192.168.1.4:8081/--/')
    time.sleep(1.8)

    # Scene 7: Edge Case - Expired Notice Banner (ntc_0012)
    print("Scene 7: Inspecting Expired Notice Archive State (ntc_0012)...")
    open_url('exp://192.168.1.4:8081/--/notice/ntc_0012')
    time.sleep(2.5)

    # Return home
    open_url('exp://192.168.1.4:8081/--/')
    time.sleep(1.8)

    # Scene 8: Edge Case - Broken Image URL Fallback (ntc_0016)
    print("Scene 8: Inspecting Broken Image Fallback (ntc_0016)...")
    open_url('exp://192.168.1.4:8081/--/notice/ntc_0016')
    time.sleep(2.5)

    # Return home
    open_url('exp://192.168.1.4:8081/--/')
    time.sleep(2.0)

    # Scene 9: Developer Controls Modal
    print("Scene 9: Opening Developer Controls Modal...")
    click_at(1850, 110)
    time.sleep(2.5)

    # Dismiss modal by tapping overlay
    click_at(1700, 750)
    time.sleep(1.5)

    # Scene 10: Final Feed View
    print("Scene 10: Final feed overview...")
    time.sleep(2.0)

    # Stop recording gracefully
    print("Stopping video recording...")
    rec_proc.send_signal(signal.SIGINT)
    rec_proc.wait()
    time.sleep(1.0)

    if os.path.exists(raw_output_path):
        raw_size = os.path.getsize(raw_output_path)
        print(f"Raw recording finalized: {raw_output_path} ({raw_size / (1024*1024):.2f} MB)")

        # Compress to 720p with avconvert to optimize file size for git and web playback
        print("Optimizing video with avconvert for fast GitHub streaming...")
        conv_cmd = [
            'avconvert',
            '--source', raw_output_path,
            '--preset', 'PresetAppleM4V720pHD',
            '--output', output_path,
            '--replace'
        ]
        res = subprocess.run(conv_cmd)
        if res.returncode == 0 and os.path.exists(output_path):
            opt_size = os.path.getsize(output_path)
            print(f"Successfully generated optimized demo video: {output_path} ({opt_size / (1024*1024):.2f} MB)")
        else:
            # Fallback to moving raw
            subprocess.run(['cp', raw_output_path, output_path])
            print(f"Saved demo video to: {output_path}")

    print("Demo recording complete!")

if __name__ == '__main__':
    main()
