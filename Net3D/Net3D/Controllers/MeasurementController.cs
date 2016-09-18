using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using Net3D.Models;
using Net3D.Utils;

namespace Net3D.Controllers
{
    public class MeasurementController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetSimulation(string id)
        {
            var dimstr = id.Split(new char[] { '-' }, StringSplitOptions.RemoveEmptyEntries);
            if (dimstr.Length != 3)
            {
                return Content(HttpStatusCode.BadRequest, "Error with the dimensions!");
            }

            int[] dims = new int[3];
            dims[0] = int.Parse(dimstr[0], System.Globalization.CultureInfo.InvariantCulture);
            dims[1] = int.Parse(dimstr[1], System.Globalization.CultureInfo.InvariantCulture);
            dims[2] = int.Parse(dimstr[2], System.Globalization.CultureInfo.InvariantCulture);

            SimulMeasurement meas = new SimulMeasurement(dims);

            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/Power_Fra_2_BS_1.txt"));

            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 1; i < lines.Length; i++)
            {
                var words = lines[i].Split(new char[] { ' ', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);

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

            meas.fill();
            fourdimlist<double> values = meas.extract();
            meas.expand();

            return Ok(values);
        }

        [HttpGet]
        public IHttpActionResult GetReal(string id, string end = "")
        {
            var control = id.Split(new char[] { '-' }, StringSplitOptions.RemoveEmptyEntries);

            if (!(end == "csv"))
            {
                return Content(HttpStatusCode.BadRequest, "Wrong File! Expected .cvs");
            }

            Measurement meas = new Measurement();

            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/" + id + "." + end));

            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < lines.Length; i++)
            {
                var words = lines[i].Split(new char[] { ',', '\r' }, StringSplitOptions.RemoveEmptyEntries);

                if (words.Length < 4 || words[0] == "\"\"")
                    continue;

                meas.x.Add(double.Parse(words[1], System.Globalization.CultureInfo.InvariantCulture));
                meas.y.Add(double.Parse(words[2], System.Globalization.CultureInfo.InvariantCulture));
                meas.z.Add(0.0);

                if (meas.min[0] > meas.x.Last())
                    meas.min[0] = meas.x.Last();
                else if (meas.max[0] < meas.x.Last())
                    meas.max[0] = meas.x.Last();
                if (meas.min[1] > meas.y.Last())
                    meas.min[1] = meas.y.Last();
                else if (meas.max[1] < meas.y.Last())
                    meas.max[1] = meas.y.Last();

                meas.vals.Add(new List<double>());
                for (int j = 3; j < words.Length; j++)
                {
                    meas.vals.Last().Add(double.Parse(words[j], System.Globalization.CultureInfo.InvariantCulture));
                }
            }

            return Ok(meas);
        }
    }
}
