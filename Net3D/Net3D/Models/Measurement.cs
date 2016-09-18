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
        public double[] min { get; set; }
        public double[] max { get; set; }

        public Measurement()
        {
            x = new List<double>();
            y = new List<double>();
            z = new List<double>();
            vals = new List<List<double>>();
            min = new double[2] { 0, 0 };
            max = new double[2] { 0, 0 };
        }
    }

}