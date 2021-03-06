﻿using Net3D.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Net3D.Utils;

namespace Net3D.Controllers
{
    public class BuildingController : ApiController
    {
        struct Final
        {
            public List<Building> lBuildings;
            public double[] min;
        };
        [HttpGet]
        public IHttpActionResult Get(string id)
        {
            List<Building> lBuildings = new List<Building>();
            double[] min = { 0, 0 };
            string path = id.Replace(";", ".");
            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/" + path));

            var lines = contents.Split(new char[] { '\n' }, StringSplitOptions.RemoveEmptyEntries);
            int num = 0;
            bool start = false;
            for (int i = 0; i < lines.Length; i++)
            {
                var words = lines[i].Split(new char[] { ' ', '\r' }, StringSplitOptions.RemoveEmptyEntries);

                if (words.Length == 0)
                    continue;
                if (words[0] == "SETTINGS")
                {
                    num = Convert.ToInt32(words[1]);
                    min[0] = Convert.ToDouble(words[2]);
                    min[1] = Convert.ToDouble(words[3]);
                    continue;
                }
                if (words[0] == "BEGIN_BUILDINGS")
                {
                    start = true;
                    continue;
                }
                if (words[0] == "END_BUILDINGS")
                    break;
                if (start)
                {
                    var building = new Building();
                    building.id = Convert.ToInt32(words[0]);
                    int corners = Convert.ToInt32(words[1]);
                    building.x = new double[corners];
                    building.y = new double[corners];
                    for (int j = 0; j < corners; j++)
                    {
                        building.x[j] = double.Parse(words[2 * (j + 1)].Remove(words[2 * (j + 1)].Length - 1), System.Globalization.CultureInfo.InvariantCulture);
                        building.y[j] = double.Parse(words[2 * (j + 1) + 1], System.Globalization.CultureInfo.InvariantCulture);
                    }
                    building.height = double.Parse(words[words.Length - 3], System.Globalization.CultureInfo.InvariantCulture);
                    lBuildings.Add(building);
                }
                else
                    continue;
            }

            Final response;
            response.lBuildings = lBuildings;
            response.min = min;
            return Ok(response);
        }
    }
}
