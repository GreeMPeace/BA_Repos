using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using Net3D.Models;
using Net3D.Utils;
using DotSpatial.Projections;

namespace Net3D.Controllers
{
    public class MeasurementController : ApiController
    {
        struct Final
        {
            public fourdimlist<double> vals;
            public double[] min;
            public double[] max;
        };

        [HttpGet]
        public IHttpActionResult GetSimulation(string id , string dimensions)
        {
            var dimstr = dimensions.Split(new char[] { '-' }, StringSplitOptions.RemoveEmptyEntries);
            string path = id.Replace(";", ".");
            if (dimstr.Length != 3)
            {
                return Content(HttpStatusCode.BadRequest, "Error with the dimensions!");
            }

            int[] dims = new int[3];
            dims[0] = int.Parse(dimstr[0], System.Globalization.CultureInfo.InvariantCulture);
            dims[1] = int.Parse(dimstr[1], System.Globalization.CultureInfo.InvariantCulture);
            dims[2] = int.Parse(dimstr[2], System.Globalization.CultureInfo.InvariantCulture);

            SimulMeasurement meas = new SimulMeasurement(dims);

            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/" + path));

            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            string[] words;

            for (int i = 1; i < lines.Length; i++)
            {
                words = lines[i].Split(new char[] { ' ', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);

                if (words.Length == 0)
                    continue;

                meas.x.Add(double.Parse(words[0], System.Globalization.CultureInfo.InvariantCulture));
                meas.y.Add(double.Parse(words[1], System.Globalization.CultureInfo.InvariantCulture));
                meas.z.Add(double.Parse(words[2], System.Globalization.CultureInfo.InvariantCulture));

                if (meas.min[0] > meas.x.Last() || i == 1)
                    meas.min[0] = meas.x.Last();
                if (meas.max[0] < meas.x.Last() || i == 1)
                    meas.max[0] = meas.x.Last();
                if (meas.min[1] > meas.y.Last() || i == 1)
                    meas.min[1] = meas.y.Last();
                if (meas.max[1] < meas.y.Last() || i == 1)
                    meas.max[1] = meas.y.Last();
                if (meas.min[2] > meas.z.Last() || i == 1)
                    meas.min[2] = meas.z.Last();
                if (meas.max[2] < meas.z.Last() || i == 1)
                    meas.max[2] = meas.z.Last();

                meas.vals.Add(new List<double>());
                for (int j = 3; j < words.Length; j++)
                {
                    meas.vals[meas.vals.Count - 1].Add(double.Parse(words[j], System.Globalization.CultureInfo.InvariantCulture));

                    if (meas.min[4] > meas.vals.Last().Last())
                        meas.min[4] = meas.vals.Last().Last();
                    else if (meas.max[4] < meas.vals.Last().Last())
                        meas.max[4] = meas.vals.Last().Last();
                }
            }

            meas.fill();
            //meas.expand();
            fourdimlist<double> values = meas.extract();

            
            Final response;
            response.vals = values;
            response.min = meas.min;
            response.max = meas.max;

            return Ok(response);
        }

        [HttpGet]
        public IHttpActionResult GetReal(string id)
        {
            string path = id.Replace(";", ".");
            string [] parts = path.Split(new char[] { '.' }, StringSplitOptions.RemoveEmptyEntries);

            if (!(parts.Last() == "csv"))
            {
                return Content(HttpStatusCode.BadRequest, "Wrong File! Expected .cvs");
            }

            Measurement meas = new Measurement();

            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/" + path));

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

                    if (meas.min[4] > meas.vals.Last().Last())
                        meas.min[4] = meas.vals.Last().Last();
                    else if (meas.max[4] < meas.vals.Last().Last())
                        meas.max[4] = meas.vals.Last().Last();
                }
            }

            fetchMap(meas.min, meas.max, id);
            return Ok(meas);
        }

        private void fetchMap(double[] min, double[] max, string name)
        {
            ProjectionInfo pStart = KnownCoordinateSystems.Geographic.World.WGS1984;
            ProjectionInfo pEnd = KnownCoordinateSystems.Projected.UtmWgs1984.WGS1984UTMZone32N;



            double xMiddle = (max[0] + min[0]) / 2;
            double yMiddle = (max[1] + min[1]) / 2;

            int zoom = GoogleMapsAPI.GetZoom(new Coordinate(xMiddle, yMiddle), 640, 640, min, max);



            string url = "https://maps.googleapis.com/maps/api/staticmap?center=" + yMiddle + "," + xMiddle + "&zoom=" + zoom + "&size=640x640&scale=2";

            WebClient client = new WebClient();
            client.DownloadFile(url, HttpContext.Current.Server.MapPath(@"~/Maps/" + name + ".png"));

            MapCoordinates bounds = GoogleMapsAPI.GetBounds(new Coordinate(xMiddle, yMiddle), zoom, 640, 640);
            min[2] = bounds.SouthWest.X;
            min[3] = bounds.SouthWest.Y;
            max[2] = bounds.NorthEast.X;
            max[3] = bounds.NorthEast.Y;
        }
    }
}