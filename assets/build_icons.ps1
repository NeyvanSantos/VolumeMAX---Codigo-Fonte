$csharpCode = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Collections.Generic;

public class IconGenerator
{
    public static Bitmap DrawSpeakerIcon(int size, bool isTray)
    {
        Bitmap bmp = new Bitmap(size, size, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.Transparent);

            float scale = size / 256.0f;

            if (!isTray)
            {
                // Fundo Squircle moderno arredondado
                float rectSize = size - Math.Max(2.0f, 10.0f * scale);
                float margin = (10.0f * scale) / 2.0f;
                float radius = 52.0f * scale;

                using (GraphicsPath path = new GraphicsPath())
                {
                    float d = radius * 2.0f;
                    path.AddArc(margin, margin, d, d, 180, 90);
                    path.AddArc(margin + rectSize - d, margin, d, d, 270, 90);
                    path.AddArc(margin + rectSize - d, margin + rectSize - d, d, d, 0, 90);
                    path.AddArc(margin, margin + rectSize - d, d, d, 90, 90);
                    path.CloseFigure();

                    // Gradiente Dark Cyber
                    using (LinearGradientBrush bgBrush = new LinearGradientBrush(
                        new PointF(0, 0),
                        new PointF(size, size),
                        Color.FromArgb(255, 18, 20, 28),
                        Color.FromArgb(255, 10, 11, 15)))
                    {
                        g.FillPath(bgBrush, path);
                    }

                    // Borda Ciano Elétrica
                    using (Pen borderPen = new Pen(Color.FromArgb(120, 0, 229, 255), Math.Max(1.5f, 3.5f * scale)))
                    {
                        g.DrawPath(borderPen, path);
                    }
                }
            }

            Color cyan = Color.FromArgb(255, 0, 229, 255);
            Color green = Color.FromArgb(255, 0, 255, 136);

            float offsetX = isTray ? (20.0f * scale) : (44.0f * scale);
            float offsetY = isTray ? (20.0f * scale) : (44.0f * scale);
            float contentScale = isTray ? ((size - 40.0f * scale) / 180.0f) : ((size - 88.0f * scale) / 180.0f);

            // Alto-falante (Caixa retangular + Cone)
            using (GraphicsPath speakerPath = new GraphicsPath())
            {
                PointF[] points = new PointF[]
                {
                    new PointF(offsetX + 15.0f * contentScale, offsetY + 60.0f * contentScale),
                    new PointF(offsetX + 54.0f * contentScale, offsetY + 60.0f * contentScale),
                    new PointF(offsetX + 104.0f * contentScale, offsetY + 20.0f * contentScale),
                    new PointF(offsetX + 104.0f * contentScale, offsetY + 160.0f * contentScale),
                    new PointF(offsetX + 54.0f * contentScale, offsetY + 120.0f * contentScale),
                    new PointF(offsetX + 15.0f * contentScale, offsetY + 120.0f * contentScale)
                };
                speakerPath.AddLines(points);
                speakerPath.CloseFigure();

                using (LinearGradientBrush speakerBrush = new LinearGradientBrush(
                    new PointF(offsetX, offsetY),
                    new PointF(offsetX + 110.0f * contentScale, offsetY + 180.0f * contentScale),
                    cyan,
                    green))
                {
                    g.FillPath(speakerBrush, speakerPath);
                }
            }

            // Ondas sonoras (3 arcos progressivos)
            using (Pen wavePen = new Pen(cyan, Math.Max(2.0f, 13.0f * contentScale)))
            {
                wavePen.StartCap = LineCap.Round;
                wavePen.EndCap = LineCap.Round;

                // Arco 1
                float r1 = 38.0f * contentScale;
                wavePen.Color = Color.FromArgb(255, 0, 229, 255);
                wavePen.Width = Math.Max(1.5f, 13.0f * contentScale);
                g.DrawArc(wavePen, offsetX + 102.0f * contentScale - r1, offsetY + 90.0f * contentScale - r1, r1 * 2, r1 * 2, -42, 84);

                // Arco 2
                float r2 = 68.0f * contentScale;
                wavePen.Color = Color.FromArgb(255, 0, 242, 190);
                wavePen.Width = Math.Max(1.5f, 12.0f * contentScale);
                g.DrawArc(wavePen, offsetX + 102.0f * contentScale - r2, offsetY + 90.0f * contentScale - r2, r2 * 2, r2 * 2, -45, 90);

                // Arco 3
                float r3 = 98.0f * contentScale;
                wavePen.Color = Color.FromArgb(255, 0, 255, 136);
                wavePen.Width = Math.Max(1.5f, 11.0f * contentScale);
                g.DrawArc(wavePen, offsetX + 102.0f * contentScale - r3, offsetY + 90.0f * contentScale - r3, r3 * 2, r3 * 2, -48, 96);
            }
        }
        return bmp;
    }

    public static void GenerateAll(string baseDir)
    {
        string assetsDir = Path.Combine(baseDir, "assets");
        Directory.CreateDirectory(assetsDir);

        // 1. icon-256.png e icon.png
        using (Bitmap b256 = DrawSpeakerIcon(256, false))
        {
            b256.Save(Path.Combine(assetsDir, "icon-256.png"), ImageFormat.Png);
            b256.Save(Path.Combine(assetsDir, "icon.png"), ImageFormat.Png);
        }

        // 2. tray.png (32x32)
        using (Bitmap bTray = DrawSpeakerIcon(32, true))
        {
            bTray.Save(Path.Combine(assetsDir, "tray.png"), ImageFormat.Png);
        }

        // 3. icon.ico multi-resolution
        int[] sizes = new int[] { 256, 128, 64, 48, 32, 16 };
        List<byte[]> pngImages = new List<byte[]>();
        List<int> sizeList = new List<int>();

        foreach (int s in sizes)
        {
            using (Bitmap b = DrawSpeakerIcon(s, false))
            using (MemoryStream ms = new MemoryStream())
            {
                b.Save(ms, ImageFormat.Png);
                pngImages.Add(ms.ToArray());
                sizeList.Add(s);
            }
        }

        using (FileStream fs = File.Create(Path.Combine(assetsDir, "icon.ico")))
        using (BinaryWriter bw = new BinaryWriter(fs))
        {
            bw.Write((ushort)0); // Reserved
            bw.Write((ushort)1); // ICO type
            bw.Write((ushort)pngImages.Count); // Count

            int offset = 6 + (16 * pngImages.Count);

            for (int i = 0; i < pngImages.Count; i++)
            {
                int s = sizeList[i];
                byte[] data = pngImages[i];

                bw.Write(s >= 256 ? (byte)0 : (byte)s); // Width
                bw.Write(s >= 256 ? (byte)0 : (byte)s); // Height
                bw.Write((byte)0); // Color count
                bw.Write((byte)0); // Reserved
                bw.Write((ushort)1); // Planes
                bw.Write((ushort)32); // Bit count
                bw.Write((uint)data.Length); // BytesInRes
                bw.Write((uint)offset); // ImageOffset

                offset += data.Length;
            }

            foreach (byte[] data in pngImages)
            {
                bw.Write(data);
            }
        }
        Console.WriteLine("SUCESSO: Todos os icones foram gerados com perfeicao!");
    }
}
"@

Add-Type -TypeDefinition $csharpCode -ReferencedAssemblies System.Drawing
[IconGenerator]::GenerateAll("g:\VolumeMax")
