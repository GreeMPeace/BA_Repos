using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Net3D.Models
{
    public class Antenna
    {
        public List<double> verAng { get; set; }
        public List<double> horAng { get; set; }
        public List<double> dirStr { get; set; }
        public double gain { get; set; }

        public Antenna()
        {
            verAng = new List<double>();
            horAng = new List<double>();
            dirStr = new List<double>();
            gain = 0;
        }
    }
}