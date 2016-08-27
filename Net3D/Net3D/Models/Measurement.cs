using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Net3D.Models
{
    public class Measurement
    {
        public List<double> x { get; set; }
        public List<double> y { get; set; }
        public List<double> z { get; set; }
        public List<List<double>> vals { get; set; }

        public void fill()
        {

            double xdiff, ydiff, zdiff, xrang, yrang, zrang;
            double lastx = x[0];
            double lasty = y[0];
            double lastz = z[0];
            bool boolx = true, booly = true, boolz = true;

            for (int l = 0, m = 0; l < x.Count; l++)
            {
                if (lastx != x[l] && boolx)
                {
                    xrang = m++;
                    xdiff = Math.abs(lastx - values[l].x);
                    boolx = false;
                }
                if (lasty != y[l] && booly)
                {
                    yrang = m++;
                    ydiff = Math.abs(lasty - values[l].y);
                    booly = false;
                }
                if (lastz != z[l] && boolz)
                {
                    zrang = m++;
                    zdiff = Math.abs(lastz - values[l].z);
                    boolz = false;
                }
                if (!boolx && !booly && !boolz)
                    break;
                if (l == values.length - 1)
                {
                    if (m < 2)
                        throw new Error("no valid values");
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
                if (Math.abs(lastx - values[l].x) > xdiff && l % (xlookup[xrang, yrang] * dim.x) != 0)
                {
                    introduce(l, lastx, xdiff, 'x');
                    l--;
                }
                if (Math.abs(lasty - values[l].y) > ydiff && l % (ylookup[yrang, zrang] * dim.y) != 0)
                {
                    introduce(l, lasty, ydiff, 'y');
                    l--;
                }
                if (Math.abs(lastz - values[l].z) > zdiff && l % (zlookup[zrang, xrang] * dim.z) != 0)
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
                for (var j = 0; j < vals[i].length; j++)
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
                for (var j = 0; j < vals[i].length; j++)
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
                for (var j = 0; j < vals[i-1].length; j++)
                {
                    vals[i].Add(-1000);
                }
            }
        }
    }
}