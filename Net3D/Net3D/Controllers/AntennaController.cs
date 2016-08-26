using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Net3D.Models;

namespace Net3D.Controllers
{
    public class AntennaController : ApiController
    {
        public IHttpActionResult Get()
        {
            Antenna antenna = new Antenna();
            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/Allgon_7333_00_1900.apa"));

            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            double gain = 0;
            bool start = false;
            for (int i = 0; i < lines.Length; i++)
            {
                var words = lines[i].Split(new char[] { ' ', '\r' }, StringSplitOptions.RemoveEmptyEntries);

                if (words.Length == 0)
                    continue;
                if (words[0] == "GAIN")
                {
                    gain = double.Parse(words[1], System.Globalization.CultureInfo.InvariantCulture);
                    continue;
                }
                if (words[0] == "*")
                    continue;

                antenna.verAng.Add(double.Parse(words[0], System.Globalization.CultureInfo.InvariantCulture));
                antenna.horAng.Add(double.Parse(words[1], System.Globalization.CultureInfo.InvariantCulture));
                antenna.dirStr.Add(double.Parse(words[2], System.Globalization.CultureInfo.InvariantCulture));
            }
            antenna.gain = gain;
            return Ok(antenna);
        }
    }
}
