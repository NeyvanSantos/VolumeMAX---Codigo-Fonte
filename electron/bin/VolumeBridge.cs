using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Globalization;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;

namespace VolumeMaxBridge {

    // ── Core Audio COM Interfaces ─────────────────────────────────────────

    [Guid("5CDF2C82-841E-4546-9722-0CF74078229A"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioEndpointVolume {
        [PreserveSig] int RegisterControlChangeNotify(IntPtr pNotify);
        [PreserveSig] int UnregisterControlChangeNotify(IntPtr pNotify);
        [PreserveSig] int GetChannelCount(out uint pnChannelCount);
        [PreserveSig] int SetMasterVolumeLevel(float fLevelDB, ref Guid pguidEventContext);
        [PreserveSig] int SetMasterVolumeLevelScalar(float fLevel, ref Guid pguidEventContext);
        [PreserveSig] int GetMasterVolumeLevel(out float pfLevelDB);
        [PreserveSig] int GetMasterVolumeLevelScalar(out float pfLevel);
        [PreserveSig] int SetChannelVolumeLevel(uint nChannel, float fLevelDB, ref Guid pguidEventContext);
        [PreserveSig] int SetChannelVolumeLevelScalar(uint nChannel, float fLevel, ref Guid pguidEventContext);
        [PreserveSig] int GetChannelVolumeLevel(uint nChannel, out float pfLevelDB);
        [PreserveSig] int GetChannelVolumeLevelScalar(uint nChannel, out float pfLevel);
        [PreserveSig] int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, ref Guid pguidEventContext);
        [PreserveSig] int GetMute([MarshalAs(UnmanagedType.Bool)] out bool pbMute);
    }

    [Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioMeterInformation {
        [PreserveSig] int GetPeakValue(out float pfPeak);
        [PreserveSig] int GetMeteringChannelCount(out uint pnChannelCount);
        [PreserveSig] int GetChannelsPeakValues(uint u32ChannelCount, IntPtr afPeakValues);
        [PreserveSig] int QueryHardwareSupport(out uint pdwHardwareSupportMask);
    }

    [Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IMMDevice {
        [PreserveSig] int Activate(ref Guid id, int clsCtx, IntPtr activationParams, [MarshalAs(UnmanagedType.IUnknown)] out object interfacePointer);
        [PreserveSig] int OpenPropertyStore(int stgmAccess, out IntPtr properties);
        [PreserveSig] int GetId([MarshalAs(UnmanagedType.LPWStr)] out string id);
        [PreserveSig] int GetState(out int state);
    }

    [Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IMMDeviceEnumerator {
        [PreserveSig] int EnumAudioEndpoints(int dataFlow, int stateMask, out IntPtr devices);
        [PreserveSig] int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice endpoint);
    }

    [ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
    public class MMDeviceEnumeratorComObject { }

    // ── Audio Session COM Interfaces (WASAPI per-app) ─────────────────────

    [Guid("87CE5498-68D6-44E5-9215-6DA47EF883D8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface ISimpleAudioVolume {
        [PreserveSig] int SetMasterVolume(float fLevel, ref Guid EventContext);
        [PreserveSig] int GetMasterVolume(out float pfLevel);
        [PreserveSig] int SetMute([MarshalAs(UnmanagedType.Bool)] bool bMute, ref Guid EventContext);
        [PreserveSig] int GetMute([MarshalAs(UnmanagedType.Bool)] out bool pbMute);
    }

    [Guid("F4B1A599-7266-4319-A8CA-E70ACB11E8CD"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioSessionControl {
        [PreserveSig] int GetState(out int state);
        [PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string pRetVal);
        [PreserveSig] int SetDisplayName([MarshalAs(UnmanagedType.LPWStr)] string Value, ref Guid EventContext);
        [PreserveSig] int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string pRetVal);
        [PreserveSig] int SetIconPath([MarshalAs(UnmanagedType.LPWStr)] string Value, ref Guid EventContext);
        [PreserveSig] int GetGroupingParam(out Guid pRetVal);
        [PreserveSig] int SetGroupingParam(ref Guid Override, ref Guid EventContext);
        [PreserveSig] int RegisterAudioSessionNotification(IntPtr NewNotifications);
        [PreserveSig] int UnregisterAudioSessionNotification(IntPtr NewNotifications);
    }

    [Guid("bfb7ff88-7239-4fc9-8fa2-07c950be9c6d"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioSessionControl2 {
        [PreserveSig] int GetState(out int state);
        [PreserveSig] int GetDisplayName([MarshalAs(UnmanagedType.LPWStr)] out string pRetVal);
        [PreserveSig] int SetDisplayName([MarshalAs(UnmanagedType.LPWStr)] string Value, ref Guid EventContext);
        [PreserveSig] int GetIconPath([MarshalAs(UnmanagedType.LPWStr)] out string pRetVal);
        [PreserveSig] int SetIconPath([MarshalAs(UnmanagedType.LPWStr)] string Value, ref Guid EventContext);
        [PreserveSig] int GetGroupingParam(out Guid pRetVal);
        [PreserveSig] int SetGroupingParam(ref Guid Override, ref Guid EventContext);
        [PreserveSig] int RegisterAudioSessionNotification(IntPtr NewNotifications);
        [PreserveSig] int UnregisterAudioSessionNotification(IntPtr NewNotifications);
        [PreserveSig] int GetSessionIdentifier([MarshalAs(UnmanagedType.LPWStr)] out string pRetVal);
        [PreserveSig] int GetSessionInstanceIdentifier([MarshalAs(UnmanagedType.LPWStr)] out string pRetVal);
        [PreserveSig] int GetProcessId(out uint pRetVal);
        [PreserveSig] int IsSystemSoundsSession();
        [PreserveSig] int SetDuckingPreference([MarshalAs(UnmanagedType.Bool)] bool optOut);
    }

    [Guid("E2F5BB11-0570-40CA-ACDD-3AA01277DEE8"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioSessionEnumerator {
        [PreserveSig] int GetCount(out int SessionCount);
        [PreserveSig] int GetSession(int SessionCount, out IntPtr Session);
    }

    [Guid("77AA99A0-1BD6-484F-8BC7-2C654C9A9B6F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioSessionManager2 {
        [PreserveSig] int GetAudioSessionControl(ref Guid AudioSessionGuid, int StreamFlags, out IntPtr SessionControl);
        [PreserveSig] int GetSimpleAudioVolume(ref Guid AudioSessionGuid, int StreamFlags, out IntPtr AudioVolume);
        [PreserveSig] int GetSessionEnumerator(out IAudioSessionEnumerator SessionEnum);
        [PreserveSig] int RegisterSessionNotification(IntPtr SessionNotification);
        [PreserveSig] int UnregisterSessionNotification(IntPtr SessionNotification);
        [PreserveSig] int RegisterDuckNotification([MarshalAs(UnmanagedType.LPWStr)] string sessionID, IntPtr duckNotification);
        [PreserveSig] int UnregisterDuckNotification(IntPtr duckNotification);
    }

    // ── WASAPI Render/Capture Interfaces for Boost Engine ──────────────────

    [Guid("1CB9AD4C-DBFA-4c32-B178-C2F568A703B2"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioClient {
        [PreserveSig] int Initialize(int ShareMode, uint StreamFlags, long hnsBufferDuration, long hnsPeriodicity, IntPtr pFormat, IntPtr AudioSessionGuid);
        [PreserveSig] int GetBufferSize(out uint pNumBufferFrames);
        [PreserveSig] int GetStreamLatency(out long phnsLatency);
        [PreserveSig] int GetCurrentPadding(out uint pNumPaddingFrames);
        [PreserveSig] int IsFormatSupported(int ShareMode, IntPtr pFormat, out IntPtr ppClosestMatch);
        [PreserveSig] int GetMixFormat(out IntPtr ppDeviceFormat);
        [PreserveSig] int GetDevicePeriod(out long phnsDefaultDevicePeriod, out long phnsMinimumDevicePeriod);
        [PreserveSig] int Start();
        [PreserveSig] int Stop();
        [PreserveSig] int Reset();
        [PreserveSig] int SetEventHandle(IntPtr eventHandle);
        [PreserveSig] int GetService(ref Guid riid, [MarshalAs(UnmanagedType.IUnknown)] out object ppv);
    }

    [Guid("F294ACFC-3146-4483-A7BF-ADDCA7C260E2"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioRenderClient {
        [PreserveSig] int GetBuffer(uint NumFramesRequested, out IntPtr ppData);
        [PreserveSig] int ReleaseBuffer(uint NumFramesWritten, uint dwFlags);
    }

    [Guid("C8ADBD64-E71E-48a0-A4DE-185C395CD317"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    public interface IAudioCaptureClient {
        [PreserveSig] int GetBuffer(out IntPtr ppData, out uint pNumFramesRead, out uint pdwFlags, out long pu64DevicePosition, out long pu64QPCPosition);
        [PreserveSig] int ReleaseBuffer(uint NumFramesRead);
        [PreserveSig] int GetNextPacketSize(out uint pNumFramesInNextPacket);
    }

    // ── WAVEFORMATEX structure ──────────────────────────────────────────────

    [StructLayout(LayoutKind.Sequential)]
    public struct WAVEFORMATEX {
        public ushort wFormatTag;
        public ushort nChannels;
        public uint nSamplesPerSec;
        public uint nAvgBytesPerSec;
        public ushort nBlockAlign;
        public ushort wBitsPerSample;
        public ushort cbSize;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct WAVEFORMATEXTENSIBLE {
        public WAVEFORMATEX Format;
        public ushort wValidBitsPerSample;
        public uint dwChannelMask;
        public Guid SubFormat;
    }

    // ── Native Boost Engine ─────────────────────────────────────────────

    public static class BoostEngine {
        private static Thread _boostThread;
        private static volatile bool _running = false;
        private static volatile float _gainFactor = 1.0f;
        private static volatile bool _limiterEnabled = true;
        private static volatile float _limiterThreshold = 0.95f;
        private static readonly object _lock = new object();

        // WASAPI constants
        const int AUDCLNT_SHAREMODE_SHARED = 0;
        const uint AUDCLNT_STREAMFLAGS_LOOPBACK = 0x00020000;
        const uint AUDCLNT_STREAMFLAGS_EVENTCALLBACK = 0x00040000;

        static readonly Guid IID_IAudioClient = new Guid("1CB9AD4C-DBFA-4c32-B178-C2F568A703B2");
        static readonly Guid IID_IAudioCaptureClient = new Guid("C8ADBD64-E71E-48a0-A4DE-185C395CD317");
        static readonly Guid IID_IAudioRenderClient = new Guid("F294ACFC-3146-4483-A7BF-ADDCA7C260E2");
        static readonly Guid KSDATAFORMAT_SUBTYPE_IEEE_FLOAT = new Guid("00000003-0000-0010-8000-00aa00389b71");
        static readonly Guid KSDATAFORMAT_SUBTYPE_PCM = new Guid("00000001-0000-0010-8000-00aa00389b71");

        public static void SetGain(float boostPercent) {
            _gainFactor = boostPercent / 100.0f;
        }

        public static void SetLimiter(bool enabled, float threshold) {
            _limiterEnabled = enabled;
            _limiterThreshold = Math.Max(0.1f, Math.Min(1.0f, threshold));
        }

        public static bool IsRunning { get { return _running; } }

        public static void Start() {
            if (_running) return;
            _running = true;
            _boostThread = new Thread(BoostLoop);
            _boostThread.IsBackground = true;
            _boostThread.Priority = ThreadPriority.Highest;
            _boostThread.Start();
        }

        public static void Stop() {
            _running = false;
            if (_boostThread != null && _boostThread.IsAlive) {
                _boostThread.Join(2000);
            }
        }

        /// <summary>
        /// Soft-clip limiter: applies smooth saturation to prevent harsh digital clipping.
        /// Uses tanh-based soft knee for musical compression.
        /// </summary>
        static float SoftClip(float sample, float threshold) {
            if (!_limiterEnabled) {
                // Hard clip only to prevent DAC overflow
                if (sample > 1.0f) return 1.0f;
                if (sample < -1.0f) return -1.0f;
                return sample;
            }

            float abs = Math.Abs(sample);
            if (abs <= threshold) return sample;

            // Soft knee region: tanh-based saturation
            float sign = sample >= 0 ? 1.0f : -1.0f;
            float excess = (abs - threshold) / (1.0f - threshold);
            float compressed = threshold + (1.0f - threshold) * (float)Math.Tanh(excess);
            return sign * Math.Min(compressed, 1.0f);
        }

        static void BoostLoop() {
            try {
                var enumerator = (IMMDeviceEnumerator)(new MMDeviceEnumeratorComObject());
                IMMDevice renderDevice;
                enumerator.GetDefaultAudioEndpoint(0 /* eRender */, 1 /* eMultimedia */, out renderDevice);

                // ── Setup Loopback Capture (reads what's playing on speakers) ──
                object captureClientObj;
                var iidClient = IID_IAudioClient;
                renderDevice.Activate(ref iidClient, 23, IntPtr.Zero, out captureClientObj);
                var captureClient = (IAudioClient)captureClientObj;

                IntPtr mixFormatPtr;
                captureClient.GetMixFormat(out mixFormatPtr);
                var mixFormat = (WAVEFORMATEX)Marshal.PtrToStructure(mixFormatPtr, typeof(WAVEFORMATEX));

                int channels = mixFormat.nChannels;
                int sampleRate = (int)mixFormat.nSamplesPerSec;
                int bitsPerSample = mixFormat.wBitsPerSample;
                bool isFloat = (mixFormat.wFormatTag == 3); // WAVE_FORMAT_IEEE_FLOAT

                // Check for WAVEFORMATEXTENSIBLE
                if (mixFormat.wFormatTag == 0xFFFE && mixFormat.cbSize >= 22) {
                    var extFormat = (WAVEFORMATEXTENSIBLE)Marshal.PtrToStructure(mixFormatPtr, typeof(WAVEFORMATEXTENSIBLE));
                    isFloat = (extFormat.SubFormat == KSDATAFORMAT_SUBTYPE_IEEE_FLOAT);
                }

                // Initialize loopback capture: 50ms buffer
                long bufferDuration = 500000; // 50ms in 100ns units
                int hr = captureClient.Initialize(
                    AUDCLNT_SHAREMODE_SHARED,
                    AUDCLNT_STREAMFLAGS_LOOPBACK,
                    bufferDuration,
                    0,
                    mixFormatPtr,
                    IntPtr.Zero
                );
                if (hr != 0) {
                    Console.Error.WriteLine("Loopback capture init failed: 0x" + hr.ToString("X8"));
                    return;
                }

                object capClientObj;
                var iidCapture = IID_IAudioCaptureClient;
                captureClient.GetService(ref iidCapture, out capClientObj);
                var audioCaptureClient = (IAudioCaptureClient)capClientObj;

                // ── Setup Render Client (output to speakers with gain) ──
                // We use the same render device but as a normal render stream
                object renderClientObj;
                renderDevice.Activate(ref iidClient, 23, IntPtr.Zero, out renderClientObj);
                var renderAudioClient = (IAudioClient)renderClientObj;

                hr = renderAudioClient.Initialize(
                    AUDCLNT_SHAREMODE_SHARED,
                    0,
                    bufferDuration,
                    0,
                    mixFormatPtr,
                    IntPtr.Zero
                );
                if (hr != 0) {
                    Console.Error.WriteLine("Render init failed: 0x" + hr.ToString("X8"));
                    captureClient.Stop();
                    return;
                }

                object renderSvcObj;
                var iidRender = IID_IAudioRenderClient;
                renderAudioClient.GetService(ref iidRender, out renderSvcObj);
                var audioRenderClient = (IAudioRenderClient)renderSvcObj;

                uint renderBufferSize;
                renderAudioClient.GetBufferSize(out renderBufferSize);

                // Start both streams
                captureClient.Start();
                renderAudioClient.Start();

                int bytesPerFrame = channels * (bitsPerSample / 8);

                while (_running) {
                    Thread.Sleep(5); // ~200Hz polling for low latency

                    uint packetSize;
                    audioCaptureClient.GetNextPacketSize(out packetSize);

                    while (packetSize > 0 && _running) {
                        IntPtr dataPtr;
                        uint numFrames;
                        uint flags;
                        long devicePos, qpcPos;

                        hr = audioCaptureClient.GetBuffer(out dataPtr, out numFrames, out flags, out devicePos, out qpcPos);
                        if (hr != 0 || numFrames == 0) break;

                        float gain = _gainFactor;
                        bool needsBoost = gain > 1.001f; // Only process if actually boosting

                        if (needsBoost && isFloat && bitsPerSample == 32) {
                            // Get available render buffer space
                            uint padding;
                            renderAudioClient.GetCurrentPadding(out padding);
                            uint available = renderBufferSize - padding;
                            uint framesToWrite = Math.Min(numFrames, available);

                            if (framesToWrite > 0) {
                                IntPtr renderPtr;
                                hr = audioRenderClient.GetBuffer(framesToWrite, out renderPtr);
                                if (hr == 0) {
                                    int sampleCount = (int)(framesToWrite * channels);
                                    float[] samples = new float[sampleCount];
                                    Marshal.Copy(dataPtr, samples, 0, Math.Min(sampleCount, (int)(numFrames * channels)));

                                    // Apply gain + soft limiter
                                    float thresh = _limiterThreshold;
                                    for (int i = 0; i < sampleCount; i++) {
                                        samples[i] = SoftClip(samples[i] * gain, thresh);
                                    }

                                    Marshal.Copy(samples, 0, renderPtr, sampleCount);
                                    audioRenderClient.ReleaseBuffer(framesToWrite, 0);
                                }
                            }
                        }

                        audioCaptureClient.ReleaseBuffer(numFrames);
                        audioCaptureClient.GetNextPacketSize(out packetSize);
                    }
                }

                // Cleanup
                captureClient.Stop();
                renderAudioClient.Stop();
                captureClient.Reset();
                renderAudioClient.Reset();

            } catch (Exception ex) {
                Console.Error.WriteLine("BoostEngine error: " + ex.Message);
            } finally {
                _running = false;
            }
        }
    }

    // ── Main Program ──────────────────────────────────────────────────────

    public class Program {
        static IMMDevice GetDefaultDevice() {
            var enumerator = (IMMDeviceEnumerator)(new MMDeviceEnumeratorComObject());
            IMMDevice dev;
            enumerator.GetDefaultAudioEndpoint(0, 1, out dev);
            return dev;
        }

        static IAudioEndpointVolume GetMasterVolumeControl() {
            var dev = GetDefaultDevice();
            var iid = typeof(IAudioEndpointVolume).GUID;
            object o;
            dev.Activate(ref iid, 23, IntPtr.Zero, out o);
            return (IAudioEndpointVolume)o;
        }

        static IAudioMeterInformation GetMeterInformation() {
            var dev = GetDefaultDevice();
            var iid = typeof(IAudioMeterInformation).GUID;
            object o;
            dev.Activate(ref iid, 23, IntPtr.Zero, out o);
            return (IAudioMeterInformation)o;
        }

        static IAudioSessionManager2 GetSessionManager() {
            var dev = GetDefaultDevice();
            var iid = typeof(IAudioSessionManager2).GUID;
            object o;
            dev.Activate(ref iid, 23, IntPtr.Zero, out o);
            return (IAudioSessionManager2)o;
        }

        static string GetProcessIconBase64(Process p) {
            try {
                string exePath = null;
                try {
                    exePath = p.MainModule.FileName;
                } catch { }

                if (string.IsNullOrEmpty(exePath) || !File.Exists(exePath)) {
                    return null;
                }

                using (Icon ico = Icon.ExtractAssociatedIcon(exePath)) {
                    if (ico == null) return null;
                    using (Bitmap orig = ico.ToBitmap())
                    using (Bitmap resized = new Bitmap(32, 32, PixelFormat.Format32bppArgb))
                    using (Graphics g = Graphics.FromImage(resized)) {
                        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                        g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                        g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                        g.DrawImage(orig, 0, 0, 32, 32);

                        using (MemoryStream ms = new MemoryStream()) {
                            resized.Save(ms, ImageFormat.Png);
                            return "data:image/png;base64," + Convert.ToBase64String(ms.ToArray());
                        }
                    }
                }
            } catch {
                return null;
            }
        }

        static string CleanAndFormatProcessName(Process proc, string rawName) {
            if (proc != null) {
                try {
                    string desc = proc.MainModule.FileVersionInfo.FileDescription;
                    if (!string.IsNullOrEmpty(desc) && desc.Trim().Length > 0) {
                        return desc.Trim();
                    }
                } catch { }
            }

            if (string.IsNullOrEmpty(rawName)) return "Aplicativo";
            string lower = rawName.ToLowerInvariant();

            if (lower.Contains("spotify")) return "Spotify";
            if (lower == "chrome" || lower == "google chrome") return "Google Chrome";
            if (lower == "msedge" || lower.Contains("edge")) return "Microsoft Edge";
            if (lower.Contains("brave")) return "Brave";
            if (lower.Contains("firefox")) return "Firefox";
            if (lower.Contains("discord")) return "Discord";
            if (lower.Contains("whatsapp")) return "WhatsApp";
            if (lower.Contains("valorant")) return "VALORANT";
            if (lower == "video.ui" || lower.Contains("movies") || lower.Contains("filmes")) return "Filmes e TV";
            if (lower.Contains("vlc")) return "VLC Media Player";
            if (lower.Contains("steam")) return "Steam";
            if (lower.Contains("eartrumpet")) return "EarTrumpet";
            if (lower.Contains("teams")) return "Microsoft Teams";
            if (lower.Contains("zoom")) return "Zoom";
            if (lower.Contains("obs")) return "OBS Studio";
            if (lower.Contains("telegram")) return "Telegram";
            if (lower == "wmplayer") return "Windows Media Player";
            if (lower.Contains("code") || lower.Contains("vscode")) return "Visual Studio Code";
            if (lower.Contains("devenv")) return "Visual Studio";

            // Clean common suffix like -Win64-Shipping
            string clean = rawName;
            if (clean.IndexOf("-win", StringComparison.OrdinalIgnoreCase) > 0) {
                clean = clean.Substring(0, clean.IndexOf("-win", StringComparison.OrdinalIgnoreCase));
            }
            if (clean.IndexOf("_win", StringComparison.OrdinalIgnoreCase) > 0) {
                clean = clean.Substring(0, clean.IndexOf("_win", StringComparison.OrdinalIgnoreCase));
            }

            if (clean.Length > 0) {
                return char.ToUpper(clean[0]) + clean.Substring(1);
            }
            return rawName;
        }

        static bool ShouldIgnoreProcess(string processName) {
            if (string.IsNullOrEmpty(processName)) return true;
            string lower = processName.ToLowerInvariant();
            if (lower == "audiodg") return true;
            if (lower == "svchost" || lower == "system" || lower == "runtimebroker" || lower == "services") return true;
            if (lower == "volumemax" || lower == "volumebridge") return true;
            return false;
        }

        static string GetFallbackIcon(string displayName) {
            if (string.IsNullOrEmpty(displayName)) return "default";
            string lower = displayName.ToLowerInvariant();

            if (lower.Contains("spotify")) return "spotify";
            if (lower.Contains("chrome")) return "chrome";
            if (lower.Contains("edge")) return "edge";
            if (lower.Contains("discord")) return "discord";
            if (lower.Contains("whatsapp")) return "whatsapp";
            if (lower.Contains("filmes") || lower.Contains("video")) return "video";
            if (lower.Contains("vlc")) return "vlc";
            if (lower.Contains("steam")) return "steam";
            if (lower.Contains("eartrumpet")) return "eartrumpet";

            return "default";
        }

        static string EscapeJson(string s) {
            if (string.IsNullOrEmpty(s)) return "";
            return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "").Replace("\n", " ");
        }

        [STAThread]
        public static void Main(string[] args) {
            try {
                Console.OutputEncoding = System.Text.Encoding.UTF8;

                if (args.Length == 0) {
                    PrintStatus();
                    return;
                }

                string cmd = args[0].ToLowerInvariant();

                if (cmd == "status") {
                    PrintStatus();
                } else if (cmd == "sessions") {
                    PrintSessions();
                } else if (cmd == "set-volume" && args.Length > 1) {
                    SetMasterVolume(args[1]);
                } else if (cmd == "set-mute" && args.Length > 1) {
                    SetMasterMute(args[1]);
                } else if (cmd == "set-app-volume" && args.Length > 2) {
                    SetAppVolume(args[1], args[2]);
                } else if (cmd == "set-app-mute" && args.Length > 2) {
                    SetAppMute(args[1], args[2]);
                } else if (cmd == "meter") {
                    PrintMeter();
                } else if (cmd == "boost-start" && args.Length > 1) {
                    StartBoost(args[1]);
                } else if (cmd == "boost-update" && args.Length > 1) {
                    UpdateBoost(args[1]);
                } else if (cmd == "boost-stop") {
                    StopBoost();
                } else if (cmd == "boost-status") {
                    PrintBoostStatus();
                } else if (cmd == "boost-daemon" && args.Length > 1) {
                    RunBoostDaemon(args[1]);
                } else {
                    Console.WriteLine("{\"error\":\"Comando desconhecido\"}");
                }
            } catch (Exception ex) {
                Console.WriteLine("{\"error\":\"" + EscapeJson(ex.Message) + "\"}");
            }
        }

        // ── Boost Engine Commands ─────────────────────────────────────────

        static void StartBoost(string levelStr) {
            float level = float.Parse(levelStr, CultureInfo.InvariantCulture);
            BoostEngine.SetGain(level);
            BoostEngine.Start();
            Console.WriteLine("{\"ok\":true,\"engine\":\"native-wasapi\",\"boost\":" + level.ToString("F0", CultureInfo.InvariantCulture) + ",\"running\":true}");
        }

        static void UpdateBoost(string levelStr) {
            float level = float.Parse(levelStr, CultureInfo.InvariantCulture);
            BoostEngine.SetGain(level);
            Console.WriteLine("{\"ok\":true,\"boost\":" + level.ToString("F0", CultureInfo.InvariantCulture) + ",\"running\":" + (BoostEngine.IsRunning ? "true" : "false") + "}");
        }

        static void StopBoost() {
            BoostEngine.Stop();
            Console.WriteLine("{\"ok\":true,\"running\":false}");
        }

        static void PrintBoostStatus() {
            Console.WriteLine("{\"running\":" + (BoostEngine.IsRunning ? "true" : "false") + ",\"engine\":\"native-wasapi\"}");
        }

        /// <summary>
        /// Long-running daemon mode: keeps the boost engine running and listens for
        /// gain updates on stdin. Send a number (boost %) per line, or "stop" to exit.
        /// </summary>
        static void RunBoostDaemon(string initialLevelStr) {
            float level = float.Parse(initialLevelStr, CultureInfo.InvariantCulture);
            BoostEngine.SetGain(level);

            if (level > 100) {
                BoostEngine.Start();
            }

            Console.WriteLine("{\"ok\":true,\"engine\":\"native-wasapi\",\"mode\":\"daemon\",\"boost\":" + level.ToString("F0", CultureInfo.InvariantCulture) + "}");
            Console.Out.Flush();

            // Listen on stdin for live updates
            string line;
            while ((line = Console.ReadLine()) != null) {
                line = line.Trim().ToLowerInvariant();

                if (line == "stop" || line == "exit" || line == "quit") {
                    BoostEngine.Stop();
                    Console.WriteLine("{\"ok\":true,\"stopped\":true}");
                    Console.Out.Flush();
                    break;
                }

                if (line.StartsWith("limiter:")) {
                    string[] parts = line.Substring(8).Split(',');
                    bool enabled = parts.Length > 0 && parts[0].Trim() == "1";
                    float thresh = 0.95f;
                    if (parts.Length > 1) {
                        float.TryParse(parts[1].Trim(), NumberStyles.Float, CultureInfo.InvariantCulture, out thresh);
                    }
                    BoostEngine.SetLimiter(enabled, thresh);
                    Console.WriteLine("{\"ok\":true,\"limiter\":" + (enabled ? "true" : "false") + ",\"threshold\":" + thresh.ToString("F2", CultureInfo.InvariantCulture) + "}");
                    Console.Out.Flush();
                    continue;
                }

                float newLevel;
                if (float.TryParse(line, NumberStyles.Float, CultureInfo.InvariantCulture, out newLevel)) {
                    BoostEngine.SetGain(newLevel);
                    if (newLevel > 100 && !BoostEngine.IsRunning) {
                        BoostEngine.Start();
                    } else if (newLevel <= 100 && BoostEngine.IsRunning) {
                        BoostEngine.Stop();
                    }
                    Console.WriteLine("{\"ok\":true,\"boost\":" + newLevel.ToString("F0", CultureInfo.InvariantCulture) + ",\"running\":" + (BoostEngine.IsRunning ? "true" : "false") + "}");
                    Console.Out.Flush();
                }
            }
        }

        // ── Original Commands (preserved) ─────────────────────────────────

        static void PrintStatus() {
            var vol = GetMasterVolumeControl();
            float level;
            vol.GetMasterVolumeLevelScalar(out level);
            bool muted;
            vol.GetMute(out muted);

            Console.WriteLine(string.Format(CultureInfo.InvariantCulture,
                "{{\"masterVolume\":{0:F2},\"muted\":{1},\"engine\":\"native-wasapi\",\"boostRunning\":{2}}}",
                level, muted ? "true" : "false", BoostEngine.IsRunning ? "true" : "false"));
        }

        static void SetMasterVolume(string levelStr) {
            float target = float.Parse(levelStr, CultureInfo.InvariantCulture);
            target = Math.Max(0.0f, Math.Min(1.0f, target));
            var vol = GetMasterVolumeControl();
            Guid empty = Guid.Empty;
            vol.SetMasterVolumeLevelScalar(target, ref empty);
            Console.WriteLine("{\"ok\":true,\"volume\":" + target.ToString("F2", CultureInfo.InvariantCulture) + "}");
        }

        static void SetMasterMute(string muteStr) {
            bool mute = muteStr == "1" || muteStr.ToLowerInvariant() == "true";
            var vol = GetMasterVolumeControl();
            Guid empty = Guid.Empty;
            vol.SetMute(mute, ref empty);
            Console.WriteLine("{\"ok\":true,\"muted\":" + (mute ? "true" : "false") + "}");
        }

        static void PrintMeter() {
            try {
                var meter = GetMeterInformation();
                float peak = 0;
                meter.GetPeakValue(out peak);

                float left = peak;
                float right = peak;

                uint channels;
                try {
                    meter.GetMeteringChannelCount(out channels);
                    if (channels >= 2) {
                        int size = (int)channels * sizeof(float);
                        IntPtr p = Marshal.AllocHGlobal(size);
                        try {
                            meter.GetChannelsPeakValues(channels, p);
                            float[] arr = new float[channels];
                            Marshal.Copy(p, arr, 0, (int)channels);
                            left = arr[0];
                            right = arr[1];
                        } finally {
                            Marshal.FreeHGlobal(p);
                        }
                    }
                } catch { }

                Console.WriteLine("{\"master\":" + peak.ToString("F3", CultureInfo.InvariantCulture) + ",\"left\":" + left.ToString("F3", CultureInfo.InvariantCulture) + ",\"right\":" + right.ToString("F3", CultureInfo.InvariantCulture) + "}");
            } catch (Exception ex) {
                Console.WriteLine("{\"master\":0.000,\"left\":0.000,\"right\":0.000,\"err\":\"" + EscapeJson(ex.Message) + "\"}");
            }
        }

        static void PrintSessions() {
            var list = new List<string>();
            var seenPids = new HashSet<uint>();

            try {
                var mgr = GetSessionManager();
                IAudioSessionEnumerator sessionEnum;
                int hrMgr = mgr.GetSessionEnumerator(out sessionEnum);
                if (hrMgr != 0 || sessionEnum == null) {
                    PrintSessionsFallback(list, seenPids);
                    Console.WriteLine("[" + string.Join(",", list.ToArray()) + "]");
                    return;
                }

                int count;
                sessionEnum.GetCount(out count);

                Guid IID_IAudioSessionControl2 = typeof(IAudioSessionControl2).GUID;
                Guid IID_ISimpleAudioVolume = typeof(ISimpleAudioVolume).GUID;

                for (int i = 0; i < count; i++) {
                    IntPtr sessionPtr = IntPtr.Zero;
                    try {
                        sessionEnum.GetSession(i, out sessionPtr);
                        if (sessionPtr == IntPtr.Zero) continue;

                        IntPtr ctl2Ptr = IntPtr.Zero;
                        int hr = Marshal.QueryInterface(sessionPtr, ref IID_IAudioSessionControl2, out ctl2Ptr);
                        if (hr != 0 || ctl2Ptr == IntPtr.Zero) {
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        var ctl2 = (IAudioSessionControl2)Marshal.GetObjectForIUnknown(ctl2Ptr);

                        // Check system sounds session: S_OK (0) means system sounds
                        try {
                            int sysHr = ctl2.IsSystemSoundsSession();
                            if (sysHr == 0) {
                                Marshal.Release(ctl2Ptr);
                                Marshal.Release(sessionPtr);
                                continue;
                            }
                        } catch { }

                        uint pid = 0;
                        ctl2.GetProcessId(out pid);
                        if (pid == 0 || seenPids.Contains(pid)) {
                            Marshal.Release(ctl2Ptr);
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        // State: 0 = Active, 1 = Inactive, 2 = Expired
                        int state = 0;
                        ctl2.GetState(out state);
                        if (state == 2) {
                            Marshal.Release(ctl2Ptr);
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        // Get the process info
                        Process proc = null;
                        string rawProcessName = "";
                        try {
                            proc = Process.GetProcessById((int)pid);
                            rawProcessName = proc.ProcessName;
                        } catch {
                            Marshal.Release(ctl2Ptr);
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        if (ShouldIgnoreProcess(rawProcessName)) {
                            Marshal.Release(ctl2Ptr);
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        seenPids.Add(pid);
                        string displayName = CleanAndFormatProcessName(proc, rawProcessName);

                        // Get real volume via ISimpleAudioVolume
                        float volume = 1.0f;
                        bool muted = false;
                        try {
                            IntPtr volPtr = IntPtr.Zero;
                            int volHr = Marshal.QueryInterface(sessionPtr, ref IID_ISimpleAudioVolume, out volPtr);
                            if (volHr == 0 && volPtr != IntPtr.Zero) {
                                var simpleVol = (ISimpleAudioVolume)Marshal.GetObjectForIUnknown(volPtr);
                                simpleVol.GetMasterVolume(out volume);
                                simpleVol.GetMute(out muted);
                                Marshal.Release(volPtr);
                            }
                        } catch { }

                        // Extract icon in Base64 or use fallback
                        string icon = null;
                        try {
                            if (proc != null) {
                                icon = GetProcessIconBase64(proc);
                            }
                        } catch { }

                        if (string.IsNullOrEmpty(icon)) {
                            icon = GetFallbackIcon(displayName);
                        }

                        int volPercent = (int)Math.Round(volume * 100);

                        list.Add(string.Format(CultureInfo.InvariantCulture,
                            "{{\"pid\":{0},\"name\":\"{1}\",\"icon\":\"{2}\",\"volume\":{3},\"muted\":{4}}}",
                            pid, EscapeJson(displayName), EscapeJson(icon), volPercent, muted ? "true" : "false"));

                        Marshal.Release(ctl2Ptr);
                        Marshal.Release(sessionPtr);
                    } catch {
                        if (sessionPtr != IntPtr.Zero) {
                            try { Marshal.Release(sessionPtr); } catch { }
                        }
                    }
                }
            } catch {
                PrintSessionsFallback(list, seenPids);
            }

            Console.WriteLine("[" + string.Join(",", list.ToArray()) + "]");
        }

        static void PrintSessionsFallback(List<string> list, HashSet<uint> seenPids) {
            var audioAppNames = new string[] {
                "Spotify", "chrome", "msedge", "brave", "firefox", "Discord",
                "WhatsApp", "Video.UI", "vlc", "steam", "VALORANT-Win64-Shipping"
            };

            var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            foreach (var appName in audioAppNames) {
                try {
                    var procs = Process.GetProcessesByName(appName);
                    foreach (var p in procs) {
                        if (seenPids.Contains((uint)p.Id)) continue;
                        if (!seen.Contains(p.ProcessName)) {
                            seen.Add(p.ProcessName);

                            string displayName = CleanAndFormatProcessName(p, p.ProcessName);
                            string icon = GetProcessIconBase64(p);
                            if (string.IsNullOrEmpty(icon)) {
                                icon = GetFallbackIcon(displayName);
                            }

                            list.Add(string.Format(CultureInfo.InvariantCulture,
                                "{{\"pid\":{0},\"name\":\"{1}\",\"icon\":\"{2}\",\"volume\":100,\"muted\":false}}",
                                p.Id, EscapeJson(displayName), EscapeJson(icon)));
                        }
                    }
                } catch { }
            }
        }

        static void SetAppVolume(string pidStr, string volumeStr) {
            try {
                uint targetPid = uint.Parse(pidStr);
                float targetVol = float.Parse(volumeStr, CultureInfo.InvariantCulture);
                // If > 1 treat as percentage
                if (targetVol > 1.0f) targetVol = targetVol / 100.0f;
                targetVol = Math.Max(0f, Math.Min(1f, targetVol));

                var mgr = GetSessionManager();
                IAudioSessionEnumerator sessionEnum;
                mgr.GetSessionEnumerator(out sessionEnum);

                int count;
                sessionEnum.GetCount(out count);

                Guid IID_IAudioSessionControl2 = typeof(IAudioSessionControl2).GUID;
                Guid IID_ISimpleAudioVolume = typeof(ISimpleAudioVolume).GUID;

                bool found = false;
                for (int i = 0; i < count; i++) {
                    try {
                        IntPtr sessionPtr;
                        sessionEnum.GetSession(i, out sessionPtr);
                        if (sessionPtr == IntPtr.Zero) continue;

                        IntPtr ctl2Ptr;
                        int hr = Marshal.QueryInterface(sessionPtr, ref IID_IAudioSessionControl2, out ctl2Ptr);
                        if (hr != 0 || ctl2Ptr == IntPtr.Zero) {
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        var ctl2 = (IAudioSessionControl2)Marshal.GetObjectForIUnknown(ctl2Ptr);
                        uint pid;
                        ctl2.GetProcessId(out pid);

                        if (pid == targetPid) {
                            IntPtr volPtr;
                            int volHr = Marshal.QueryInterface(sessionPtr, ref IID_ISimpleAudioVolume, out volPtr);
                            if (volHr == 0 && volPtr != IntPtr.Zero) {
                                var simpleVol = (ISimpleAudioVolume)Marshal.GetObjectForIUnknown(volPtr);
                                Guid empty = Guid.Empty;
                                simpleVol.SetMasterVolume(targetVol, ref empty);
                                found = true;
                                Marshal.Release(volPtr);
                            }
                        }

                        Marshal.Release(ctl2Ptr);
                        Marshal.Release(sessionPtr);
                    } catch { }
                }

                Console.WriteLine("{\"ok\":" + (found ? "true" : "false") + ",\"pid\":" + targetPid + ",\"volume\":" + targetVol.ToString("F2", CultureInfo.InvariantCulture) + "}");
            } catch (Exception ex) {
                Console.WriteLine("{\"ok\":false,\"error\":\"" + EscapeJson(ex.Message) + "\"}");
            }
        }

        static void SetAppMute(string pidStr, string muteStr) {
            try {
                uint targetPid = uint.Parse(pidStr);
                bool targetMute = muteStr == "1" || muteStr.ToLowerInvariant() == "true";

                var mgr = GetSessionManager();
                IAudioSessionEnumerator sessionEnum;
                mgr.GetSessionEnumerator(out sessionEnum);

                int count;
                sessionEnum.GetCount(out count);

                Guid IID_IAudioSessionControl2 = typeof(IAudioSessionControl2).GUID;
                Guid IID_ISimpleAudioVolume = typeof(ISimpleAudioVolume).GUID;

                bool found = false;
                for (int i = 0; i < count; i++) {
                    try {
                        IntPtr sessionPtr;
                        sessionEnum.GetSession(i, out sessionPtr);
                        if (sessionPtr == IntPtr.Zero) continue;

                        IntPtr ctl2Ptr;
                        int hr = Marshal.QueryInterface(sessionPtr, ref IID_IAudioSessionControl2, out ctl2Ptr);
                        if (hr != 0 || ctl2Ptr == IntPtr.Zero) {
                            Marshal.Release(sessionPtr);
                            continue;
                        }

                        var ctl2 = (IAudioSessionControl2)Marshal.GetObjectForIUnknown(ctl2Ptr);
                        uint pid;
                        ctl2.GetProcessId(out pid);

                        if (pid == targetPid) {
                            IntPtr volPtr;
                            int volHr = Marshal.QueryInterface(sessionPtr, ref IID_IAudioSessionControl2, out volPtr);
                            if (volHr == 0 && volPtr != IntPtr.Zero) {
                                var simpleVol = (ISimpleAudioVolume)Marshal.GetObjectForIUnknown(volPtr);
                                Guid empty = Guid.Empty;
                                simpleVol.SetMute(targetMute, ref empty);
                                found = true;
                                Marshal.Release(volPtr);
                            }
                        }

                        Marshal.Release(ctl2Ptr);
                        Marshal.Release(sessionPtr);
                    } catch { }
                }

                Console.WriteLine("{\"ok\":" + (found ? "true" : "false") + ",\"pid\":" + targetPid + ",\"muted\":" + (targetMute ? "true" : "false") + "}");
            } catch (Exception ex) {
                Console.WriteLine("{\"ok\":false,\"error\":\"" + EscapeJson(ex.Message) + "\"}");
            }
        }
    }
}
