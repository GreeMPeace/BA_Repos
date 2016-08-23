using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Net3D.Models
{
    public class Building
    {
        public int id { get; set; }
        public double [] x { get; set; }
        public double [] y { get; set; }
        public double height { get; set; }
    }
}