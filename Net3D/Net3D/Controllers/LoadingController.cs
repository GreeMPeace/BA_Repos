using Net3D.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Net3D.Controllers
{
    public class LoadingController : ApiController
    {
        public IHttpActionResult GetBuildings(string city)
        {
            List<Building> lBuildings = new List<Building>();
            var contents = System.IO.File.ReadAllText(HttpContext.Current.Server.MapPath(@"~/App_Data/" + city));

            var lines = contents.Split("\n", StringSplitOptions.RemoveEmptyEntries);
            int num = 0;
            bool start = false;
            for(int i = 0; i<lines.Length; i++)
            {
                var words = lines[i].Split(" ", StringSplitOptions.RemoveEmptyEntries);
                if(words[0] == "SETTINGS")
                {
                    num = Convert.ToInt32(words[1]);
                    continue;
                }
                if (words[0] == "BEGIN_BUILDINGS")
                {
                    start = true;
                    continue;
                }
                if (start)
                {
                    var building = new Building();
                    for(int j = 0; j<Convert.ToInt32(words[1]); j++)
                    {
                        building.x = Convert.ToDouble(words[2 * (j + 1)].Remove(words[2 * (j + 1)].Length - 1));
                        building.y = Convert.ToDouble(words[2 * (j + 1) + 1]);
                    }
                    building.height = Convert.ToDouble(words[words.Length - 3]);
                    lBuildings.add(building);
                }
                else
                    continue;
            }
            return Ok(lBuildings);
        }
    }
}
