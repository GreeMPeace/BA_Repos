﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;

namespace Net3D.Models
{
    [Serializable]
    public class Measurement
    {
        public List<double> x { get; set; }
        public List<double> y { get; set; }
        public List<double> z { get; set; }
        public List<List<double>> vals { get; set; }
        public double[] dim { get; set; }
        private double[,] xlookup { get; set; }
        private double[,] ylookup { get; set; }
        private double[,] zlookup { get; set; }

        public Measurement(double[] dims)
        {
            x = new List<double>();
            y = new List<double>();
            z = new List<double>();
            vals = new List<List<double>>();
            dim = dims;
            xlookup = new double[,] { { 0, 1, 1 }, { dims[1], 0, dims[2] }, { dims[1] * dims[2], dims[1] * dims[2], 0 } };
            ylookup = new double[,] { { 0, 1, 1 }, { dims[2], 0, dims[0] }, { dims[0] * dims[2], dims[0] * dims[2], 0 } };
            zlookup = new double[,] { { 0, 1, 1 }, { dims[0], 0, dims[1] }, { dims[1] * dims[0], dims[1] * dims[0], 0 } };
        }

        public void fill()
        {

            double xdiff = 0, ydiff = 0, zdiff = 0;
            int xrang = 0, yrang = 0, zrang = 0;
            double lastx = x[0];
            double lasty = y[0];
            double lastz = z[0];
            bool boolx = true, booly = true, boolz = true;

            for (int l = 0, m = 0; l < x.Count; l++)
            {
                if (lastx != x[l] && boolx)
                {
                    xrang = m++;
                    xdiff = Math.Abs(lastx - x[l]);
                    boolx = false;
                }
                if (lasty != y[l] && booly)
                {
                    yrang = m++;
                    ydiff = Math.Abs(lasty - y[l]);
                    booly = false;
                }
                if (lastz != z[l] && boolz)
                {
                    zrang = m++;
                    zdiff = Math.Abs(lastz - z[l]);
                    boolz = false;
                }
                if (!boolx && !booly && !boolz)
                    break;
                if (l == x.Count - 1)
                {
                    if (m < 2)
                        throw new System.Exception("no valid values");
                    if (boolx)
                        xrang = 2;
                    if (booly)
                        yrang = 2;
                    if (boolz)
                        zrang = 2;
                }
            }

            for (int l = 0; l < x.Count; l++)
            {
                if (Math.Abs(lastx - x[l]) > xdiff && l % (xlookup[xrang, yrang] * dim[0]) != 0)
                {
                    introduce(l, lastx, xdiff, 'x');
                    l--;
                }
                if (Math.Abs(lasty - y[l]) > ydiff && l % (ylookup[yrang, zrang] * dim[1]) != 0)
                {
                    introduce(l, lasty, ydiff, 'y');
                    l--;
                }
                if (Math.Abs(lastz - z[l]) > zdiff && l % (zlookup[zrang, xrang] * dim[2]) != 0)
                {
                    introduce(l, lastz, zdiff, 'z');
                    l--;
                }

                lastx = x[l];
                lasty = y[l];
                lastz = z[l];
            }


        }

        private void introduce(int i, double lastv, double diff, char coord)
        {
            if (coord == 'x')
            {
                x.Insert(i, lastv + diff);
                y.Insert(i, y[i - 1]);
                z.Insert(i, z[i - 1]);
                vals.Insert(i, new List<double>());
                for (var j = 0; j < vals[i].Count; j++)
                {
                    vals[i].Add(-1000);
                }
            }
            else if (coord == 'y')
            {
                y.Insert(i, lastv + diff);
                x.Insert(i, x[i - 1]);
                z.Insert(i, z[i - 1]);
                vals.Insert(i, new List<double>());
                for (var j = 0; j < vals[i].Count; j++)
                {
                    vals[i].Add(-1000);
                }
            }
            else if (coord == 'z')
            {
                z.Insert(i, lastv + diff);
                y.Insert(i, y[i - 1]);
                x.Insert(i, x[i - 1]);
                vals.Insert(i, new List<double>());
                for (var j = 0; j < vals[i-1].Count; j++)
                {
                    vals[i].Add(-1000);
                }
            }
        }

        public void expand()
        {
            var xalt = DeepClone<List<double>>(x);
            var yalt = DeepClone<List<double>>(y);
            var zalt = DeepClone<List<double>>(z);
            var valsalt = DeepClone<List<List<double>>>(vals);
            x.AddRange(xalt);
            y.AddRange(yalt);
            zalt.ForEach(delegate(double v)
            {
                v += 1.5;
            });
            z.AddRange(zalt);
            vals.AddRange(valsalt);
            x.AddRange(xalt);
            y.AddRange(yalt);
            zalt.ForEach(delegate(double v)
            {
                v += 1.5;
            });
            z.AddRange(zalt);
            vals.AddRange(valsalt);
            x.AddRange(xalt);
            y.AddRange(yalt);
            zalt.ForEach(delegate(double v)
            {
                v += 1.5;
            });
            z.AddRange(zalt);
            vals.AddRange(valsalt);
        }

        public static T DeepClone<T>(T obj)
        {
            using (var ms = new MemoryStream())
            {
                var formatter = new BinaryFormatter();
                formatter.Serialize(ms, obj);
                ms.Position = 0;

                return (T)formatter.Deserialize(ms);
            }
        }
    }
}