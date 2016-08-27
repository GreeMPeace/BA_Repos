using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using Net3D.Models;

namespace Net3D.Controllers
{
    public class MeasurementController : ApiController
    {
        public IHttpActionResult Get(string dim)
        {
            Measurement meas = new Measurement();
            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/Allgon_7333_00_1900.apa"));

            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 1; i < lines.Length; i++)
            {
                var words = lines[i].Split(new char[] { ' ', '\r' }, StringSplitOptions.RemoveEmptyEntries);

                if (words.Length == 0)
                    continue;

                meas.x.Add(double.Parse(words[0], System.Globalization.CultureInfo.InvariantCulture));
                meas.y.Add(double.Parse(words[1], System.Globalization.CultureInfo.InvariantCulture));
                meas.z.Add(double.Parse(words[2], System.Globalization.CultureInfo.InvariantCulture));
                meas.vals.Add(new List<double>());
                for (int j = 3; j < words.Length; j++)
                {
                    meas.vals[meas.vals.Count - 1].Add(double.Parse(words[j], System.Globalization.CultureInfo.InvariantCulture));
                }
            }

            return Ok(meas);
        }
    }
}
